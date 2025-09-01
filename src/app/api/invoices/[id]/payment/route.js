import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Sale from '@/models/Sale';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// POST /api/invoices/[id]/payment - Add payment to invoice
export async function POST(request, { params }) {
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
        { success: false, message: 'Insufficient permissions to process payments' },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const { amount, method, transactionId, notes } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid payment amount is required' },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json(
        { success: false, message: 'Payment method is required' },
        { status: 400 }
      );
    }

    // Get the invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice is cancelled
    if (invoice.status === 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Cannot add payment to cancelled invoice' },
        { status: 400 }
      );
    }

    // Check if payment amount exceeds due amount
    if (amount > invoice.payment.dueAmount) {
      return NextResponse.json(
        { success: false, message: `Payment amount cannot exceed due amount of ₹${invoice.payment.dueAmount}` },
        { status: 400 }
      );
    }

    // Add payment to invoice
    await invoice.addPayment(amount, method, transactionId);

    // Update corresponding sale payment status
    if (invoice.sale) {
      const sale = await Sale.findById(invoice.sale);
      if (sale) {
        await sale.addPayment(amount, method, transactionId);
      }
    }

    // Populate the response
    await invoice.populate([
      { path: 'customer.owner', select: 'firstName lastName email phone' },
      { path: 'customer.pet', select: 'name species breed' },
      { path: 'sale', select: 'saleNumber status' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Payment added successfully',
      data: { 
        invoice,
        paymentDetails: {
          amount,
          method,
          transactionId,
          paymentDate: new Date(),
          remainingDue: invoice.payment.dueAmount
        }
      }
    });

  } catch (error) {
    console.error('Add payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add payment', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/invoices/[id]/payment - Get payment history for invoice
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

    const { id } = params;

    const invoice = await Invoice.findById(id)
      .select('payment invoiceNumber totals.finalAmount customer.details.name')
      .populate('sale', 'saleNumber payment');

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }

    // For now, we'll return the current payment status
    // In a more complex system, you might have a separate PaymentHistory model
    const paymentHistory = {
      invoiceNumber: invoice.invoiceNumber,
      customerName: invoice.customer.details.name,
      totalAmount: invoice.totals.finalAmount,
      paidAmount: invoice.payment.paidAmount,
      dueAmount: invoice.payment.dueAmount,
      paymentStatus: invoice.payment.status,
      paymentMethod: invoice.payment.method,
      paymentDate: invoice.payment.paymentDate,
      transactionId: invoice.payment.transactionId
    };

    return NextResponse.json({
      success: true,
      data: { paymentHistory }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment history', error: error.message },
      { status: 500 }
    );
  }
}