import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Invoice from '@/models/Invoice';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/sales/[id] - Get a specific sale
export async function GET(request, { params }) {
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

    const { id } = await params;

    const sale = await Sale.findById(id)
      .populate('customer.owner', 'firstName lastName email phone address')
      .populate('customer.pet', 'name species breed age')
      .populate('salesPerson', 'firstName lastName email')
      .populate('items.inventory', 'name sku category')
      .populate('invoice');

    if (!sale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { sale }
    });

  } catch (error) {
    console.error('Get sale error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sale', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/sales/[id] - Update a sale
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
        { success: false, message: 'Insufficient permissions to update sales' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const sale = await Sale.findById(id);
    if (!sale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    // Allow updates to customer, payment, and other fields
    const allowedUpdates = ['customer', 'status', 'notes', 'deliveryDate', 'payment', 'items'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        if (field === 'customer') {
          // Handle customer update specially to validate pet
          updates.customer = {
            owner: body.customer.owner || sale.customer.owner,
            pet: (body.customer.pet && body.customer.pet !== 'none' && body.customer.pet !== '') 
              ? body.customer.pet 
              : null
          };
        } else if (field === 'payment') {
          // Recalculate payment fields if payment is updated
          const grandTotal = sale.totals.grandTotal;
          const paidAmount = Math.max(0, body.payment.paidAmount || 0);
          const dueAmount = Math.max(0, grandTotal - paidAmount);
          
          let paymentStatus = 'pending';
          if (paidAmount >= grandTotal) {
            paymentStatus = 'paid';
          } else if (paidAmount > 0 && paidAmount < grandTotal) {
            paymentStatus = 'partial';
          }
          
          updates.payment = {
            ...sale.payment.toObject(),
            ...body.payment,
            status: paymentStatus,
            paidAmount: paidAmount,
            dueAmount: dueAmount
          };
        } else {
          updates[field] = body[field];
        }
      }
    }

    // Update the sale
    Object.assign(sale, updates);
    await sale.save();

    // Populate the response
    await sale.populate([
      { path: 'customer.owner', select: 'firstName lastName email phone' },
      { path: 'customer.pet', select: 'name species breed' },
      { path: 'salesPerson', select: 'firstName lastName' },
      { path: 'items.inventory', select: 'name sku' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Sale updated successfully',
      data: { sale }
    });

  } catch (error) {
    console.error('Update sale error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update sale', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/sales/[id] - Cancel a sale
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
        { success: false, message: 'Insufficient permissions to cancel sales' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const sale = await Sale.findById(id);
    if (!sale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation if not delivered
    if (sale.status === 'delivered') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel delivered sale' },
        { status: 400 }
      );
    }

    // Cancel the sale
    sale.status = 'cancelled';
    sale.isActive = false;
    await sale.save();

    // Restore inventory quantities
    const Inventory = require('@/models/Inventory').default;
    for (const item of sale.items) {
      await Inventory.findByIdAndUpdate(
        item.inventory,
        {
          $inc: { quantity: item.quantity, totalSold: -item.quantity },
          $push: {
            stockMovements: {
              type: 'adjustment',
              quantity: item.quantity,
              date: new Date(),
              reference: sale.saleNumber,
              notes: `Sale cancelled - stock restored`
            }
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Sale cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel sale error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel sale', error: error.message },
      { status: 500 }
    );
  }
}