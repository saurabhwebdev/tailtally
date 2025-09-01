import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/inventory - Get all inventory items with filtering and pagination
export async function GET(request) {
  try {
    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock') === 'true';
    const expiringSoon = searchParams.get('expiringSoon') === 'true';
    const petSpecies = searchParams.get('petSpecies');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    // Build query object
    let query = { isActive: true };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Pet species filter
    if (petSpecies && petSpecies !== 'all') {
      query.$or = [
        { petSpecies: petSpecies },
        { petSpecies: 'all' }
      ];
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Low stock filter
    if (lowStock) {
      query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
    }

    // Expiring soon filter
    if (expiringSoon) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      query.expirationDate = { $lte: thirtyDaysFromNow, $gte: new Date() };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [items, total] = await Promise.all([
      Inventory.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('stockMovements.user', 'firstName lastName')
        .lean(),
      Inventory.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          current: page,
          total: totalPages,
          count: items.length,
          totalCount: total,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Inventory GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inventory', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/inventory - Create new inventory item
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
        { success: false, message: 'Insufficient permissions to create inventory items' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'category', 'price', 'quantity'];
    for (const field of requiredFields) {
      if (!data[field] && data[field] !== 0) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create new inventory item
    const inventoryItem = new Inventory(data);
    
    // Add initial stock movement
    inventoryItem.stockMovements.push({
      type: 'adjustment',
      quantity: data.quantity,
      date: new Date(),
      user: authResult.user._id,
      notes: 'Initial stock entry'
    });

    await inventoryItem.save();

    return NextResponse.json({
      success: true,
      message: 'Inventory item created successfully',
      data: { item: inventoryItem }
    }, { status: 201 });

  } catch (error) {
    console.error('Inventory POST error:', error);
    
    // Handle duplicate SKU error
    if (error.code === 11000 && error.keyPattern?.sku) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create inventory item', error: error.message },
      { status: 500 }
    );
  }
}