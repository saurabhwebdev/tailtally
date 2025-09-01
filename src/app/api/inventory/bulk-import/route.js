import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import { requireAuth } from '@/lib/auth-middleware';

export async function POST(request) {
  try {
    // Apply auth middleware
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: 'Items array is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const results = {
      successful: 0,
      failed: 0,
      errors: [],
      duplicates: []
    };

    // Process items in batches to avoid overwhelming the database
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (item, index) => {
        try {
          // Check if SKU already exists
          const existingItem = await Inventory.findOne({ 
            sku: item.sku,
            userId: authResult.user._id 
          });

          if (existingItem) {
            results.duplicates.push({
              sku: item.sku,
              name: item.name,
              error: 'SKU already exists'
            });
            results.failed++;
            return;
          }

          // Validate required fields
          const requiredFields = ['name', 'sku', 'category', 'quantity', 'price'];
          const missingFields = requiredFields.filter(field => !item[field] && item[field] !== 0);
          
          if (missingFields.length > 0) {
            results.errors.push({
              sku: item.sku,
              name: item.name,
              error: `Missing required fields: ${missingFields.join(', ')}`
            });
            results.failed++;
            return;
          }

          // Create inventory item
          const inventoryItem = new Inventory({
            userId: authResult.user._id,
            name: item.name.trim(),
            sku: item.sku.trim(),
            category: item.category.toLowerCase().trim(),
            brand: item.brand?.trim() || '',
            description: item.description?.trim() || '',
            quantity: parseInt(item.quantity) || 0,
            price: parseFloat(item.price) || 0,
            minStockLevel: parseInt(item.minStockLevel) || 0,
            petSpecies: item.petSpecies?.toLowerCase().trim() || 'other',
            requiresPrescription: Boolean(item.requiresPrescription),
            isActive: item.isActive !== false, // Default to true unless explicitly false
            
            // Default GST settings
            gst: {
              isGSTApplicable: false,
              gstRate: 0,
              gstType: 'IGST',
              hsnCode: '',
              taxableValue: parseFloat(item.price) || 0,
              cgstAmount: 0,
              sgstAmount: 0,
              igstAmount: 0,
              totalGSTAmount: 0,
              totalAmountWithGST: parseFloat(item.price) || 0
            },

            // Audit fields
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await inventoryItem.save();
          results.successful++;

        } catch (error) {
          console.error(`Error importing item ${item.sku}:`, error);
          results.errors.push({
            sku: item.sku,
            name: item.name,
            error: error.message
          });
          results.failed++;
        }
      });

      // Wait for current batch to complete before processing next batch
      await Promise.all(batchPromises);
    }

    // Return results
    return NextResponse.json({
      message: `Import completed. ${results.successful} items imported successfully, ${results.failed} failed.`,
      successful: results.successful,
      failed: results.failed,
      errors: results.errors,
      duplicates: results.duplicates,
      totalProcessed: items.length
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { message: 'Internal server error during bulk import' },
      { status: 500 }
    );
  }
}