import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/inventory/[id] - Get specific inventory item
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    const item = await Inventory.findById(id)
      .populate('usedByPets.pet', 'name species breed')
      .populate('usedByPets.owner', 'firstName lastName email')
      .populate('stockMovements.user', 'firstName lastName')
      .lean();

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { item }
    });

  } catch (error) {
    console.error('Inventory GET by ID error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inventory item', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/[id] - Update inventory item
export async function PUT(request, { params }) {
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
        { success: false, message: 'Insufficient permissions to update inventory items' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const updateData = await request.json();

    // Find current item
    const currentItem = await Inventory.findById(id);
    if (!currentItem) {
      return NextResponse.json(
        { success: false, message: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Track quantity changes
    const oldQuantity = currentItem.quantity;
    const newQuantity = updateData.quantity;

    // Update the item
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Add stock movement if quantity changed
    if (newQuantity !== undefined && newQuantity !== oldQuantity) {
      const quantityChange = newQuantity - oldQuantity;
      await updatedItem.adjustStock(
        quantityChange,
        'adjustment',
        authResult.user._id,
        'Manual quantity adjustment',
        'Manual Update'
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: { item: updatedItem }
    });

  } catch (error) {
    console.error('Inventory PUT error:', error);
    
    // Handle duplicate SKU error
    if (error.code === 11000 && error.keyPattern?.sku) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update inventory item', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/inventory/[id] - Soft delete inventory item
export async function DELETE(request, { params }) {
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
        { success: false, message: 'Insufficient permissions to delete inventory items' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const item = await Inventory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory item deleted successfully',
      data: { item }
    });

  } catch (error) {
    console.error('Inventory DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete inventory item', error: error.message },
      { status: 500 }
    );
  }
}