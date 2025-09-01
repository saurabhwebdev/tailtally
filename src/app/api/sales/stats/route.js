import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Invoice from '@/models/Invoice';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/sales/stats - Get sales statistics and analytics
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
    const period = searchParams.get('period') || '30'; // days
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Calculate date range
    let dateRange;
    if (startDate && endDate) {
      dateRange = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else {
      const days = parseInt(period);
      const start = new Date();
      start.setDate(start.getDate() - days);
      dateRange = {
        $gte: start,
        $lte: new Date()
      };
    }

    // Get sales statistics
    const salesStats = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: '$totals.grandTotal' },
          totalItems: { $sum: { $sum: '$items.quantity' } },
          averageSale: { $avg: '$totals.grandTotal' },
          totalDiscount: { $sum: '$totals.totalDiscount' },
          totalGST: { $sum: '$totals.totalGST' }
        }
      }
    ]);

    // Get sales by status
    const salesByStatus = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totals.grandTotal' }
        }
      }
    ]);

    // Get payment status breakdown
    const paymentStats = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 },
          amount: { $sum: '$totals.grandTotal' },
          paidAmount: { $sum: '$payment.paidAmount' },
          dueAmount: { $sum: '$payment.dueAmount' }
        }
      }
    ]);

    // Get top selling items
    const topItems = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            inventory: '$items.inventory',
            name: '$items.name',
            sku: '$items.sku'
          },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // Get sales by payment method
    const paymentMethods = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$payment.method',
          count: { $sum: 1 },
          amount: { $sum: '$totals.grandTotal' }
        }
      }
    ]);

    // Get daily sales trend
    const dailyTrend = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$saleDate' },
            month: { $month: '$saleDate' },
            day: { $dayOfMonth: '$saleDate' }
          },
          sales: { $sum: 1 },
          revenue: { $sum: '$totals.grandTotal' },
          items: { $sum: { $sum: '$items.quantity' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get customer statistics
    const customerStats = await Sale.aggregate([
      {
        $match: {
          saleDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$customer.owner',
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: '$totals.grandTotal' },
          averageSpent: { $avg: '$totals.grandTotal' }
        }
      },
      {
        $group: {
          _id: null,
          uniqueCustomers: { $sum: 1 },
          totalCustomerSpending: { $sum: '$totalSpent' },
          averageCustomerValue: { $avg: '$totalSpent' },
          repeatCustomers: {
            $sum: {
              $cond: [{ $gt: ['$totalPurchases', 1] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get invoice statistics
    const invoiceStats = await Invoice.aggregate([
      {
        $match: {
          invoiceDate: dateRange,
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalInvoiceAmount: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          totalDue: { $sum: '$payment.dueAmount' },
          paidInvoices: {
            $sum: {
              $cond: [{ $eq: ['$payment.status', 'paid'] }, 1, 0]
            }
          },
          overdueInvoices: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$payment.status', 'paid'] },
                    { $ne: ['$status', 'cancelled'] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Compile response
    const stats = {
      sales: salesStats[0] || {
        totalSales: 0,
        totalRevenue: 0,
        totalItems: 0,
        averageSale: 0,
        totalDiscount: 0,
        totalGST: 0
      },
      salesByStatus: salesByStatus.reduce((acc, item) => {
        acc[item._id] = { count: item.count, revenue: item.revenue };
        return acc;
      }, {}),
      paymentStats: paymentStats.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          amount: item.amount,
          paidAmount: item.paidAmount,
          dueAmount: item.dueAmount
        };
        return acc;
      }, {}),
      topItems: topItems.map(item => ({
        name: item._id.name,
        sku: item._id.sku,
        quantity: item.totalQuantity,
        revenue: item.totalRevenue,
        salesCount: item.salesCount
      })),
      paymentMethods: paymentMethods.reduce((acc, item) => {
        acc[item._id] = { count: item.count, amount: item.amount };
        return acc;
      }, {}),
      dailyTrend: dailyTrend.map(item => ({
        date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
        sales: item.sales,
        revenue: item.revenue,
        items: item.items
      })),
      customers: customerStats[0] || {
        uniqueCustomers: 0,
        totalCustomerSpending: 0,
        averageCustomerValue: 0,
        repeatCustomers: 0
      },
      invoices: invoiceStats[0] || {
        totalInvoices: 0,
        totalInvoiceAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        paidInvoices: 0,
        overdueInvoices: 0
      }
    };

    // Calculate additional metrics
    stats.conversionRate = stats.customers.uniqueCustomers > 0 
      ? (stats.customers.repeatCustomers / stats.customers.uniqueCustomers * 100).toFixed(2)
      : 0;

    stats.paymentCollectionRate = stats.invoices.totalInvoiceAmount > 0
      ? (stats.invoices.totalPaid / stats.invoices.totalInvoiceAmount * 100).toFixed(2)
      : 0;

    stats.averageItemsPerSale = stats.sales.totalSales > 0
      ? (stats.sales.totalItems / stats.sales.totalSales).toFixed(2)
      : 0;

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get sales stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch sales statistics', error: error.message },
      { status: 500 }
    );
  }
}