import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/invoices/[id] - Get a specific invoice
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

    const invoice = await Invoice.findById(id)
      .populate('customer.owner', 'firstName lastName email phone address')
      .populate('customer.pet', 'name species breed age')
      .populate('sale', 'saleNumber status saleDate')
      .populate('signature.authorizedBy', 'firstName lastName');

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { invoice }
    });

  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch invoice', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/invoices/[id] - Update an invoice
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
        { success: false, message: 'Insufficient permissions to update invoices' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Only allow updates to certain fields based on status
    const allowedUpdates = ['status', 'dueDate', 'terms', 'payment'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        if (field === 'payment' && typeof body[field] === 'object') {
          // Merge payment updates
          updates.payment = { ...invoice.payment.toObject(), ...body[field] };
        } else if (field === 'terms' && typeof body[field] === 'object') {
          // Merge terms updates
          updates.terms = { ...invoice.terms.toObject(), ...body[field] };
        } else {
          updates[field] = body[field];
        }
      }
    }

    // Update the invoice
    Object.assign(invoice, updates);
    await invoice.save();

    // Populate the response
    await invoice.populate([
      { path: 'customer.owner', select: 'firstName lastName email phone' },
      { path: 'customer.pet', select: 'name species breed' },
      { path: 'sale', select: 'saleNumber status' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      data: { invoice }
    });

  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update invoice', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] - Cancel an invoice
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
        { success: false, message: 'Insufficient permissions to cancel invoices' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation if not paid
    if (invoice.payment.status === 'paid') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel paid invoice' },
        { status: 400 }
      );
    }

    // Cancel the invoice
    invoice.status = 'cancelled';
    invoice.isActive = false;
    await invoice.save();

    return NextResponse.json({
      success: true,
      message: 'Invoice cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel invoice error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel invoice', error: error.message },
      { status: 500 }
    );
  }
}