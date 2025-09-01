import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Sale from '@/models/Sale';
import Owner from '@/models/Owner';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/invoices - Get all invoices with filtering and pagination
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
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const customerId = searchParams.get('customerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const overdue = searchParams.get('overdue') === 'true';
    const search = searchParams.get('search');

    // Build query
    let query = { isActive: true };

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query['payment.status'] = paymentStatus;
    }

    if (customerId) {
      query['customer.owner'] = customerId;
    }

    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (overdue) {
      query.dueDate = { $lt: new Date() };
      query['payment.status'] = { $ne: 'paid' };
      query.status = { $ne: 'cancelled' };
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { invoiceNumber: searchRegex },
        { 'customer.details.name': searchRegex },
        { 'customer.details.email': searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(query)
      .populate('customer.owner', 'firstName lastName email phone')
      .populate('customer.pet', 'name species breed')
      .populate('sale', 'saleNumber status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    // Get invoice statistics
    const stats = await Invoice.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          totalDue: { $sum: '$payment.dueAmount' },
          averageInvoice: { $avg: '$totals.finalAmount' }
        }
      }
    ]);

    // Get overdue count
    const overdueCount = await Invoice.countDocuments({
      dueDate: { $lt: new Date() },
      'payment.status': { $ne: 'paid' },
      status: { $ne: 'cancelled' },
      isActive: true
    });

    return NextResponse.json({
      success: true,
      data: {
        invoices,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: invoices.length,
          totalCount: total
        },
        statistics: {
          ...(stats[0] || {
            totalInvoices: 0,
            totalAmount: 0,
            totalPaid: 0,
            totalDue: 0,
            averageInvoice: 0
          }),
          overdueCount
        }
      }
    });

  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch invoices', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice from sale
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
        { success: false, message: 'Insufficient permissions to create invoices' },
        { status: 403 }
      );
    }

    const { user } = authResult;
    const body = await request.json();

    const { saleId, dueDate, terms, businessInfo } = body;

    // Validate required fields
    if (!saleId) {
      return NextResponse.json(
        { success: false, message: 'Sale ID is required' },
        { status: 400 }
      );
    }

    // Get the sale
    const sale = await Sale.findById(saleId)
      .populate('customer.owner')
      .populate('customer.pet')
      .populate('items.inventory');

    if (!sale) {
      return NextResponse.json(
        { success: false, message: 'Sale not found' },
        { status: 404 }
      );
    }

    // Ensure sale has valid items
    if (!sale.items || !Array.isArray(sale.items) || sale.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Sale must have at least one item' },
        { status: 400 }
      );
    }

    // Check if invoice already exists for this sale
    const existingInvoice = await Invoice.findOne({ sale: saleId });
    if (existingInvoice) {
      return NextResponse.json(
        { success: false, message: 'Invoice already exists for this sale' },
        { status: 400 }
      );
    }

    // Prepare customer details snapshot
    const customerDetails = {
      name: sale.customer.owner.fullName,
      email: sale.customer.owner.email,
      phone: sale.customer.owner.phone,
      address: sale.customer.owner.address || {},
      gstNumber: sale.customer.owner.gstNumber || ''
    };

    // Prepare business information
    const defaultBusinessInfo = {
      name: 'TailTally Pet Services',
      address: {
        street: '123 Pet Street',
        city: 'Pet City',
        state: 'Pet State',
        zipCode: '12345',
        country: 'India'
      },
      contact: {
        phone: '+91-9876543210',
        email: 'info@tailtally.com',
        website: 'www.tailtally.com'
      },
      gstNumber: '27AAAAA0000A1Z5'
    };

    // Calculate invoice items with proper GST breakdown
    const invoiceItems = sale.items.map(item => {
      // Calculate GST components based on type
      let cgstAmount = 0, sgstAmount = 0, igstAmount = 0, cessAmount = 0;
      
      if (item.gst.isApplicable) {
        if (item.gst.type === 'CGST_SGST') {
          cgstAmount = (item.taxableAmount * (item.gst.rate / 2)) / 100;
          sgstAmount = (item.taxableAmount * (item.gst.rate / 2)) / 100;
        } else if (item.gst.type === 'IGST') {
          igstAmount = (item.taxableAmount * item.gst.rate) / 100;
        }
        cessAmount = (item.taxableAmount * 0) / 100; // No cess for now
      }
      
      return {
        name: item.name,
        description: item.inventory?.description || '',
        sku: item.sku,
        hsnCode: item.gst.hsnCode || '',
        sacCode: item.gst.sacCode || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        discountType: item.discountType,
        gst: {
          isApplicable: item.gst.isApplicable,
          rate: item.gst.rate,
          type: item.gst.type,
          cgstRate: item.gst.type === 'CGST_SGST' ? item.gst.rate / 2 : 0,
          sgstRate: item.gst.type === 'CGST_SGST' ? item.gst.rate / 2 : 0,
          igstRate: item.gst.type === 'IGST' ? item.gst.rate : 0,
          cessRate: 0
        },
        subtotal: item.subtotal,
        discountAmount: item.discountAmount,
        taxableAmount: item.taxableAmount,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount,
        cessAmount: cessAmount,
        totalGstAmount: item.gstAmount,
        total: item.total
      };
    });

    // Calculate invoice totals
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = invoiceItems.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalTaxable = invoiceItems.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalCGST = invoiceItems.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSGST = invoiceItems.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIGST = invoiceItems.reduce((sum, item) => sum + item.igstAmount, 0);
    const totalCess = invoiceItems.reduce((sum, item) => sum + item.cessAmount, 0);
    const totalGST = invoiceItems.reduce((sum, item) => sum + item.totalGstAmount, 0);
    const grandTotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate round off (to nearest rupee)
    const roundOff = Math.round(grandTotal) - grandTotal;
    const finalAmount = Math.round(grandTotal);

    // Generate invoice number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice number for this month
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}-`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    const invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;

    // Create invoice
    const invoiceData = {
      invoiceNumber: invoiceNumber,
      sale: saleId,
      customer: {
        owner: sale.customer.owner._id,
        pet: sale.customer.pet?._id || null,
        details: customerDetails
      },
      business: businessInfo || defaultBusinessInfo,
      items: invoiceItems,
      totals: {
        subtotal: subtotal,
        totalDiscount: totalDiscount,
        totalTaxable: totalTaxable,
        totalCGST: totalCGST,
        totalSGST: totalSGST,
        totalIGST: totalIGST,
        totalCess: totalCess,
        totalGST: totalGST,
        grandTotal: grandTotal,
        roundOff: roundOff,
        finalAmount: finalAmount
      },
      invoiceDate: new Date(),
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      payment: {
        status: sale.payment.status,
        method: sale.payment.method,
        paidAmount: sale.payment.paidAmount,
        dueAmount: finalAmount - sale.payment.paidAmount
      },
      terms: {
        paymentTerms: terms?.paymentTerms || 'Payment due within 30 days',
        notes: terms?.notes || '',
        bankDetails: terms?.bankDetails || {}
      },
      signature: {
        authorizedBy: user._id,
        timestamp: new Date()
      }
    };

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // Update sale with invoice reference
    sale.invoice = invoice._id;
    
    // Ensure sale has valid items before saving
    if (!sale.items) {
      sale.items = [];
    }
    
    await sale.save();

    // Populate the response
    await invoice.populate([
      { path: 'customer.owner', select: 'firstName lastName email phone' },
      { path: 'customer.pet', select: 'name species breed' },
      { path: 'sale', select: 'saleNumber status' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      data: { invoice }
    }, { status: 201 });

  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create invoice', error: error.message },
      { status: 500 }
    );
  }
}