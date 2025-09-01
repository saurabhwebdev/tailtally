import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/inventory/gst - Get GST settings for inventory items
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
    const itemId = searchParams.get('itemId');

    if (itemId) {
      // Get GST settings for specific item
      const item = await Inventory.findById(itemId).select('gst priceBreakdown');
      if (!item) {
        return NextResponse.json(
          { success: false, message: 'Inventory item not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          gst: item.gst,
          priceBreakdown: item.priceBreakdown
        }
      });
    }

    // Get GST configuration summary
    const gstStats = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$gst.gstRate',
          count: { $sum: 1 },
          items: { $push: { name: '$name', sku: '$sku' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const gstTypes = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$gst.gstType',
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        gstRateDistribution: gstStats,
        gstTypeDistribution: gstTypes,
        defaultSettings: {
          gstRate: 18,
          gstType: 'CGST_SGST',
          taxCategory: 'GOODS',
          isGSTApplicable: true
        }
      }
    });

  } catch (error) {
    console.error('GST settings GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch GST settings', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/inventory/gst - Update GST settings for inventory items
export async function PUT(request) {
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
        { success: false, message: 'Insufficient permissions to update GST settings' },
        { status: 403 }
      );
    }

    const { itemIds, gstSettings, bulkUpdate = false } = await request.json();

    // Validate GST settings
    if (gstSettings.gstRate < 0 || gstSettings.gstRate > 100) {
      return NextResponse.json(
        { success: false, message: 'GST rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    const validGstTypes = ['CGST_SGST', 'IGST', 'EXEMPT', 'NIL_RATED', 'ZERO_RATED'];
    if (!validGstTypes.includes(gstSettings.gstType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid GST type' },
        { status: 400 }
      );
    }

    // Calculate GST breakdown
    const calculateGSTRates = (gstRate, gstType) => {
      let cgstRate = 0, sgstRate = 0, igstRate = 0;
      
      if (gstType === 'CGST_SGST') {
        cgstRate = gstRate / 2;
        sgstRate = gstRate / 2;
      } else if (gstType === 'IGST') {
        igstRate = gstRate;
      }
      
      return { cgstRate, sgstRate, igstRate };
    };

    const { cgstRate, sgstRate, igstRate } = calculateGSTRates(gstSettings.gstRate, gstSettings.gstType);

    const updateData = {
      'gst.isGSTApplicable': gstSettings.isGSTApplicable,
      'gst.gstRate': gstSettings.gstRate,
      'gst.gstType': gstSettings.gstType,
      'gst.cgstRate': cgstRate,
      'gst.sgstRate': sgstRate,
      'gst.igstRate': igstRate,
      'gst.cessRate': gstSettings.cessRate || 0,
      'gst.taxCategory': gstSettings.taxCategory || 'GOODS',
      'gst.hsnCode': gstSettings.hsnCode || '',
      'gst.sacCode': gstSettings.sacCode || '',
      'gst.reverseCharge': gstSettings.reverseCharge || false
    };

    if (gstSettings.placeOfSupply) {
      updateData['gst.placeOfSupply.stateCode'] = gstSettings.placeOfSupply.stateCode;
      updateData['gst.placeOfSupply.stateName'] = gstSettings.placeOfSupply.stateName;
    }

    let result;
    if (bulkUpdate && itemIds && itemIds.length > 0) {
      // Bulk update multiple items
      result = await Inventory.updateMany(
        { _id: { $in: itemIds }, isActive: true },
        { $set: updateData }
      );
    } else if (itemIds && itemIds.length === 1) {
      // Update single item
      result = await Inventory.findByIdAndUpdate(
        itemIds[0],
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Item IDs are required' },
        { status: 400 }
      );
    }

    // Recalculate price breakdown for updated items
    const updatedItems = await Inventory.find({ _id: { $in: itemIds } });
    
    for (const item of updatedItems) {
      if (item.gst.isGSTApplicable) {
        const basePrice = item.price / (1 + (item.gst.gstRate / 100));
        const gstAmount = basePrice * (item.gst.gstRate / 100);
        
        item.priceBreakdown = {
          basePrice: Math.round(basePrice * 100) / 100,
          gstAmount: Math.round(gstAmount * 100) / 100,
          totalPriceWithGST: Math.round(item.price * 100) / 100
        };
        
        await item.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: bulkUpdate ? 
        `GST settings updated for ${result.modifiedCount} items` : 
        'GST settings updated successfully',
      data: { 
        modifiedCount: result.modifiedCount || 1,
        updatedItems: bulkUpdate ? null : result
      }
    });

  } catch (error) {
    console.error('GST settings PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update GST settings', error: error.message },
      { status: 500 }
    );
  }
}