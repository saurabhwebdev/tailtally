import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Inventory from '@/models/Inventory';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/inventory/stats - Get inventory statistics
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

    // Get basic inventory stats
    const [basicStats] = await Inventory.getInventoryStats();
    
    // Get category breakdown
    const categoryStats = await Inventory.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get low stock items
    const lowStockItems = await Inventory.findLowStock();

    // Get expiring items
    const expiringItems = await Inventory.findExpiringSoon(30);

    // Get top selling items (based on totalSold)
    const topSellingItems = await Inventory.find({ isActive: true })
      .sort({ totalSold: -1 })
      .limit(10)
      .select('name totalSold currentPrice category');

    // Get recent stock movements
    const recentMovements = await Inventory.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$stockMovements' },
      { $sort: { 'stockMovements.date': -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'stockMovements.user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $project: {
          name: 1,
          sku: 1,
          'stockMovements.type': 1,
          'stockMovements.quantity': 1,
          'stockMovements.date': 1,
          'stockMovements.notes': 1,
          'stockMovements.reference': 1,
          'user.firstName': 1,
          'user.lastName': 1
        }
      }
    ]);

    // Calculate monthly sales trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const salesTrend = await Inventory.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$stockMovements' },
      {
        $match: {
          'stockMovements.type': 'sale',
          'stockMovements.date': { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$stockMovements.date' },
            month: { $month: '$stockMovements.date' }
          },
          totalSales: { $sum: { $abs: '$stockMovements.quantity' } },
          totalValue: { $sum: { $multiply: [{ $abs: '$stockMovements.quantity' }, '$price'] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get inventory alerts
    const alerts = [];
    
    // Low stock alerts
    if (lowStockItems.length > 0) {
      alerts.push({
        type: 'low_stock',
        title: 'Low Stock Alert',
        message: `${lowStockItems.length} item(s) are running low on stock`,
        count: lowStockItems.length,
        severity: 'warning'
      });
    }

    // Expiring items alerts
    if (expiringItems.length > 0) {
      alerts.push({
        type: 'expiring_soon',
        title: 'Items Expiring Soon',
        message: `${expiringItems.length} item(s) will expire within 30 days`,
        count: expiringItems.length,
        severity: 'error'
      });
    }

    // Out of stock alerts
    const outOfStockCount = await Inventory.countDocuments({
      isActive: true,
      quantity: 0
    });

    if (outOfStockCount > 0) {
      alerts.push({
        type: 'out_of_stock',
        title: 'Out of Stock',
        message: `${outOfStockCount} item(s) are completely out of stock`,
        count: outOfStockCount,
        severity: 'error'
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalItems: basicStats?.totalItems || 0,
          totalValue: basicStats?.totalValue || 0,
          lowStockItems: basicStats?.lowStockItems || 0,
          expiringSoonItems: basicStats?.expiringSoonItems || 0,
          outOfStockItems: outOfStockCount
        },
        categoryBreakdown: categoryStats,
        lowStockItems: lowStockItems.slice(0, 10), // Top 10 low stock items
        expiringItems: expiringItems.slice(0, 10), // Top 10 expiring items
        topSellingItems,
        recentMovements,
        salesTrend,
        alerts
      }
    });

  } catch (error) {
    console.error('Inventory stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inventory statistics', error: error.message },
      { status: 500 }
    );
  }
}