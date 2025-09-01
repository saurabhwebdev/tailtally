import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Invoice from '@/models/Invoice';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import Inventory from '@/models/Inventory';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/sales - Get all sales with filtering and pagination
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
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { saleNumber: searchRegex },
        { 'items.name': searchRegex },
        { notes: searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const sales = await Sale.find(query)
      .populate('customer.owner', 'firstName lastName email phone')
      .populate('customer.pet', 'name species breed')
      .populate('salesPerson', 'firstName lastName')
      .populate('items.inventory', 'name sku')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sale.countDocuments(query);

    // Get sales statistics
    const stats = await Sale.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totals.grandTotal' },
          totalItems: { $sum: { $sum: '$items.quantity' } },
          averageSale: { $avg: '$totals.grandTotal' }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sales,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: sales.length,
          totalCount: total
        },
        statistics: stats[0] || {
          totalSales: 0,
          totalRevenue: 0,
          totalItems: 0,
          averageSale: 0
        }
      }
    });

  } catch (error) {
    console.error('Get sales error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sales', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/sales - Create a new sale
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
        { success: false, message: 'Insufficient permissions to create sales' },
        { status: 403 }
      );
    }

    const { user } = authResult;
    const body = await request.json();

    const {
      customer,
      items,
      payment,
      notes,
      deliveryDate
    } = body;

    // Validate required fields
    if (!customer?.owner || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Customer and items are required' },
        { status: 400 }
      );
    }

    // Verify customer exists
    const owner = await Owner.findById(customer.owner);
    if (!owner) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Verify pet if provided (skip if "none" or invalid)
    let pet = null;
    if (customer.pet && customer.pet !== 'none' && customer.pet !== '') {
      // Validate if it's a valid ObjectId format
      if (!/^[0-9a-fA-F]{24}$/.test(customer.pet)) {
        return NextResponse.json(
          { success: false, message: 'Invalid pet ID format' },
          { status: 400 }
        );
      }
      
      pet = await Pet.findById(customer.pet);
      if (!pet || pet.owner.toString() !== customer.owner) {
        return NextResponse.json(
          { success: false, message: 'Pet not found or does not belong to customer' },
          { status: 404 }
        );
      }
    }

    // Process and validate items
    const processedItems = [];
    for (const item of items) {
      // Verify inventory item exists
      const inventoryItem = await Inventory.findById(item.inventory);
      if (!inventoryItem) {
        return NextResponse.json(
          { success: false, message: `Inventory item not found: ${item.inventory}` },
          { status: 404 }
        );
      }

      // Check stock availability
      if (inventoryItem.quantity < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${inventoryItem.name}. Available: ${inventoryItem.quantity}` },
          { status: 400 }
        );
      }

      // Calculate item totals
      const unitPrice = item.unitPrice || inventoryItem.price;
      const subtotal = item.quantity * unitPrice;
      const discountAmount = item.discountType === 'percentage' 
        ? (subtotal * (item.discount || 0)) / 100 
        : (item.discount || 0);
      const taxableAmount = subtotal - discountAmount;
      const gstRate = inventoryItem.gst?.gstRate ?? 18;
      const isGSTApplicable = inventoryItem.gst?.isGSTApplicable ?? true;
      const gstAmount = isGSTApplicable ? (taxableAmount * gstRate) / 100 : 0;
      const total = taxableAmount + gstAmount;

      // Process item with inventory data and calculated totals
      processedItems.push({
        inventory: inventoryItem._id,
        name: inventoryItem.name,
        sku: inventoryItem.sku,
        quantity: item.quantity,
        unitPrice: unitPrice,
        discount: item.discount || 0,
        discountType: item.discountType || 'percentage',
        subtotal: subtotal,
        discountAmount: discountAmount,
        taxableAmount: taxableAmount,
        gst: {
          isApplicable: isGSTApplicable,
          rate: gstRate,
          type: (inventoryItem.gst?.gstType ?? 'CGST_SGST').replace(/[+]/g, '_'),
          hsnCode: inventoryItem.gst?.hsnCode ?? '',
          sacCode: inventoryItem.gst?.sacCode ?? ''
        },
        gstAmount: gstAmount,
        total: total,
        notes: item.notes || ''
      });
    }

    // Calculate sale totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = processedItems.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalTaxable = processedItems.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalGST = processedItems.reduce((sum, item) => sum + item.gstAmount, 0);
    const grandTotal = processedItems.reduce((sum, item) => sum + item.total, 0);

    // Generate sale number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last sale number for this month
    const lastSale = await Sale.findOne({
      saleNumber: new RegExp(`^SAL-${year}${month}-`)
    }).sort({ saleNumber: -1 });
    
    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.saleNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    const saleNumber = `SAL-${year}${month}-${String(sequence).padStart(4, '0')}`;

    // Calculate payment details
    const paidAmount = Math.max(0, payment?.paidAmount || 0);
    const dueAmount = Math.max(0, grandTotal - paidAmount);
    
    // Determine payment status
    let paymentStatus = 'pending';
    if (paidAmount >= grandTotal) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0 && paidAmount < grandTotal) {
      paymentStatus = 'partial';
    } else if (paidAmount === 0) {
      paymentStatus = 'pending';
    }
    
    // Handle overpayment case (change/credit)
    const changeAmount = paidAmount > grandTotal ? paidAmount - grandTotal : 0;

    // Create sale
    const saleData = {
      saleNumber: saleNumber,
      customer: {
        owner: customer.owner,
        pet: (customer.pet && customer.pet !== 'none' && customer.pet !== '') ? customer.pet : null
      },
      items: processedItems,
      totals: {
        subtotal: subtotal,
        totalDiscount: totalDiscount,
        totalTaxable: totalTaxable,
        totalGST: totalGST,
        grandTotal: grandTotal
      },
      payment: {
        method: payment?.method || 'cash',
        status: paymentStatus,
        paidAmount: paidAmount,
        dueAmount: dueAmount,
        dueDate: payment?.dueDate ? new Date(payment.dueDate) : null,
        transactionId: payment?.transactionId || null
      },
      salesPerson: user._id,
      notes: notes || '',
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      status: 'confirmed',
      changeAmount: changeAmount // Store change amount for reference
    };

    const sale = new Sale(saleData);
    await sale.save();

    // Update inventory quantities
    await sale.updateInventory();

    // Update customer spending
    await owner.addToTotalSpent(sale.totals.grandTotal);
    await owner.updateLastVisit();

    // Populate the response
    await sale.populate([
      { path: 'customer.owner', select: 'firstName lastName email phone' },
      { path: 'customer.pet', select: 'name species breed' },
      { path: 'salesPerson', select: 'firstName lastName' },
      { path: 'items.inventory', select: 'name sku' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Sale created successfully',
      data: { sale }
    }, { status: 201 });

  } catch (error) {
    console.error('Create sale error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create sale', error: error.message },
      { status: 500 }
    );
  }
}