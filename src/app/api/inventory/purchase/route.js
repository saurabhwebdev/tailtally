import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import Inventory from '@/models/Inventory';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// POST /api/inventory/purchase - Record inventory purchase by pet/owner
export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication and permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_BILLING]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to record purchases' },
        { status: 403 }
      );
    }

    const { 
      items, // Array of { itemId, quantity, notes }
      petId,
      ownerId,
      paymentMethod = 'cash',
      notes = '',
      generateInvoice = true
    } = await request.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Items array is required' },
        { status: 400 }
      );
    }

    if (!petId && !ownerId) {
      return NextResponse.json(
        { success: false, message: 'Either petId or ownerId is required' },
        { status: 400 }
      );
    }

    // Validate pet and owner exist
    let pet = null;
    let owner = null;

    if (petId) {
      pet = await Pet.findById(petId).populate('owner');
      if (!pet) {
        return NextResponse.json(
          { success: false, message: 'Pet not found' },
          { status: 404 }
        );
      }
      owner = pet.owner;
    } else if (ownerId) {
      owner = await Owner.findById(ownerId);
      if (!owner) {
        return NextResponse.json(
          { success: false, message: 'Owner not found' },
          { status: 404 }
        );
      }
    }

    // Process each item
    const purchaseDetails = [];
    let totalAmount = 0;
    let totalGST = 0;

    for (const item of items) {
      const { itemId, quantity, notes: itemNotes = '' } = item;

      if (!itemId || !quantity || quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid item data: itemId and positive quantity required' },
          { status: 400 }
        );
      }

      // Find inventory item
      const inventoryItem = await Inventory.findById(itemId);
      if (!inventoryItem) {
        return NextResponse.json(
          { success: false, message: `Inventory item not found: ${itemId}` },
          { status: 404 }
        );
      }

      // Check stock availability
      if (inventoryItem.quantity < quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${quantity}` },
          { status: 400 }
        );
      }

      // Calculate pricing with GST
      const priceBreakdown = inventoryItem.calculateGSTBreakdown();
      const itemTotal = priceBreakdown.totalPriceWithGST * quantity;
      const itemGST = priceBreakdown.totalGST * quantity;

      // Record the sale to pet (if applicable)
      if (pet) {
        await inventoryItem.sellToPet(
          pet._id, 
          owner._id, 
          quantity, 
          itemNotes || `Purchase: ${quantity} units`
        );
      } else {
        // Just adjust stock for owner-only purchases
        await inventoryItem.adjustStock(
          -quantity, 
          'sale', 
          authResult.user.id, 
          `Sold to owner: ${owner.fullName}${itemNotes ? ` - ${itemNotes}` : ''}`,
          generateInvoice ? `INV-${Date.now()}` : ''
        );
      }

      purchaseDetails.push({
        item: {
          id: inventoryItem._id,
          name: inventoryItem.name,
          sku: inventoryItem.sku,
          category: inventoryItem.category
        },
        quantity,
        unitPrice: priceBreakdown.totalPriceWithGST,
        basePrice: priceBreakdown.basePrice,
        gstAmount: priceBreakdown.totalGST,
        totalPrice: itemTotal,
        notes: itemNotes,
        gstBreakdown: {
          cgst: priceBreakdown.cgstAmount * quantity,
          sgst: priceBreakdown.sgstAmount * quantity,
          igst: priceBreakdown.igstAmount * quantity,
          cess: priceBreakdown.cessAmount * quantity
        }
      });

      totalAmount += itemTotal;
      totalGST += itemGST;
    }

    // Update owner's total spent
    if (owner) {
      await owner.addToTotalSpent(totalAmount);
      await owner.updateLastVisit();
    }

    // Generate invoice number if requested
    const invoiceNumber = generateInvoice ? `INV-${Date.now()}-${owner._id.toString().slice(-6)}` : null;

    const purchaseRecord = {
      invoiceNumber,
      pet: pet ? {
        id: pet._id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed
      } : null,
      owner: {
        id: owner._id,
        name: owner.fullName,
        email: owner.email,
        phone: owner.phone
      },
      items: purchaseDetails,
      summary: {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal: totalAmount - totalGST,
        totalGST,
        totalAmount,
        paymentMethod
      },
      notes,
      purchaseDate: new Date()
    };

    return NextResponse.json({
      success: true,
      message: `Purchase recorded successfully${invoiceNumber ? ` - Invoice: ${invoiceNumber}` : ''}`,
      data: purchaseRecord
    });

  } catch (error) {
    console.error('Purchase recording error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record purchase', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/inventory/purchase - Get purchase history
export async function GET(request) {
  try {
    await connectDB();
    
    // Check authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const petId = searchParams.get('petId');
    const ownerId = searchParams.get('ownerId');
    const itemId = searchParams.get('itemId');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;

    // Build aggregation pipeline
    const pipeline = [];

    // Match stage
    const matchConditions = { isActive: true };
    
    if (petId || ownerId) {
      pipeline.push({
        $match: matchConditions
      });

      // Lookup usedByPets to get purchase history
      pipeline.push({
        $unwind: '$usedByPets'
      });

      const usedByPetsMatch = {};
      if (petId) usedByPetsMatch['usedByPets.pet'] = new mongoose.Types.ObjectId(petId);
      if (ownerId) usedByPetsMatch['usedByPets.owner'] = new mongoose.Types.ObjectId(ownerId);

      pipeline.push({
        $match: usedByPetsMatch
      });

      // Populate pet and owner details
      pipeline.push({
        $lookup: {
          from: 'pets',
          localField: 'usedByPets.pet',
          foreignField: '_id',
          as: 'petDetails'
        }
      });

      pipeline.push({
        $lookup: {
          from: 'owners',
          localField: 'usedByPets.owner',
          foreignField: '_id',
          as: 'ownerDetails'
        }
      });

      // Project the results
      pipeline.push({
        $project: {
          name: 1,
          sku: 1,
          category: 1,
          price: 1,
          gst: 1,
          purchaseDate: '$usedByPets.date',
          quantity: '$usedByPets.quantity',
          notes: '$usedByPets.notes',
          pet: { $arrayElemAt: ['$petDetails', 0] },
          owner: { $arrayElemAt: ['$ownerDetails', 0] }
        }
      });
    } else if (itemId) {
      matchConditions._id = new mongoose.Types.ObjectId(itemId);
      pipeline.push({
        $match: matchConditions
      });

      pipeline.push({
        $project: {
          name: 1,
          sku: 1,
          category: 1,
          price: 1,
          gst: 1,
          usedByPets: 1,
          totalSold: 1,
          lastSaleDate: 1
        }
      });
    } else {
      // Get general purchase statistics
      pipeline.push({
        $match: { isActive: true, totalSold: { $gt: 0 } }
      });

      pipeline.push({
        $project: {
          name: 1,
          sku: 1,
          category: 1,
          price: 1,
          totalSold: 1,
          lastSaleDate: 1,
          usedByPetsCount: { $size: '$usedByPets' }
        }
      });
    }

    // Sort by purchase date (most recent first)
    pipeline.push({
      $sort: { purchaseDate: -1, lastSaleDate: -1, _id: -1 }
    });

    // Pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const results = await Inventory.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit
    countPipeline.push({ $count: 'total' });
    const countResult = await Inventory.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        purchases: results,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Purchase history error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchase history', error: error.message },
      { status: 500 }
    );
  }
}