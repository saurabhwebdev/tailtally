import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Owner from '@/models/Owner';
import Inventory from '@/models/Inventory';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'daily-sales';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    const filter = dateFilter.$gte || dateFilter.$lte ? { saleDate: dateFilter } : {};

    let reportData = {};

    switch (type) {
      case 'daily-sales':
        reportData = await generateDailySalesReport(filter, startDate);
        break;
      case 'weekly-sales':
        reportData = await generateWeeklySalesReport(filter, startDate, endDate);
        break;
      case 'monthly-revenue':
        reportData = await generateMonthlyRevenueReport(filter, startDate, endDate);
        break;
      case 'product-performance':
        reportData = await generateProductPerformanceReport(filter);
        break;
      case 'customer-purchases':
        reportData = await generateCustomerPurchaseReport(filter);
        break;
      case 'payment-methods':
        reportData = await generatePaymentMethodReport(filter);
        break;
      case 'sales-trends':
        reportData = await generateSalesTrendsReport(filter);
        break;
      case 'discount-analysis':
        reportData = await generateDiscountAnalysisReport(filter);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid report type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function generateDailySalesReport(filter, startDate) {
  const sales = await Sale.find(filter)
    .populate('customer.owner', 'firstName lastName email')
    .populate('salesPerson', 'firstName lastName')
    .sort({ saleDate: -1 })
    .limit(100);

  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totals?.grandTotal || 0), 0);
  const transactionCount = sales.length;
  const averageOrderValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
  const uniqueCustomers = new Set(sales.map(s => s.customer?.owner?._id?.toString())).size;

  const dateStr = startDate ? new Date(startDate).toLocaleDateString() : 'Today';

  return {
    date: dateStr,
    totalRevenue: totalRevenue.toFixed(2),
    transactionCount,
    averageOrderValue: averageOrderValue.toFixed(2),
    uniqueCustomers
  };
}

async function generateWeeklySalesReport(filter, startDate, endDate) {
  const sales = await Sale.find(filter);

  // Calculate daily breakdown
  const dailyBreakdown = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const daySales = sales.filter(s => {
      const saleDate = new Date(s.createdAt);
      return saleDate >= dayStart && saleDate <= dayEnd;
    });
    
    const dayRevenue = daySales.reduce((sum, sale) => sum + sale.total, 0);
    
    dailyBreakdown.push({
      date: currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      revenue: dayRevenue.toFixed(2)
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = sales.length;
  const avgDailySales = dailyBreakdown.length > 0 ? 
    (totalRevenue / dailyBreakdown.length).toFixed(2) : '0';

  // Calculate growth vs previous week
  const previousWeekStart = new Date(startDate);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(endDate);
  previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

  const previousWeekSales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: previousWeekStart,
        lte: previousWeekEnd
      }
    }
  });

  const previousWeekRevenue = previousWeekSales.reduce((sum, sale) => sum + sale.total, 0);
  const growth = previousWeekRevenue > 0 
    ? ((totalRevenue - previousWeekRevenue) / previousWeekRevenue * 100).toFixed(1)
    : 0;

  return {
    totalRevenue: totalRevenue.toFixed(2),
    totalOrders,
    avgDailySales,
    growth,
    dailyBreakdown
  };
}

async function generateMonthlyRevenueReport(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Get previous month data for growth calculation
  const previousMonthStart = new Date(startDate);
  previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
  const previousMonthEnd = new Date(endDate);
  previousMonthEnd.setMonth(previousMonthEnd.getMonth() - 1);

  const previousMonthSales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: previousMonthStart,
        lte: previousMonthEnd
      }
    }
  });

  const previousMonthRevenue = previousMonthSales.reduce((sum, sale) => sum + sale.total, 0);
  const growth = previousMonthRevenue > 0 
    ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
    : 0;

  // Calculate top categories
  const categoryRevenue = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const category = item.product?.category || 'Uncategorized';
      categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
    });
  });

  const topCategories = Object.entries(categoryRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, revenue]) => ({
      name,
      revenue: revenue.toFixed(2)
    }));

  // Calculate insights
  const dailyRevenue = {};
  sales.forEach(sale => {
    const day = new Date(sale.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
    dailyRevenue[day] = (dailyRevenue[day] || 0) + sale.total;
  });
  const bestDay = Object.entries(dailyRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const hourlyRevenue = {};
  sales.forEach(sale => {
    const hour = new Date(sale.createdAt).getHours();
    hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + sale.total;
  });
  const peakHour = Object.entries(hourlyRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const productRevenue = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const productName = item.product?.name || 'Unknown';
      productRevenue[productName] = (productRevenue[productName] || 0) + (item.price * item.quantity);
    });
  });
  const topProduct = Object.entries(productRevenue).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalRevenue: totalRevenue.toFixed(2),
    growth,
    topCategories,
    bestDay,
    peakHour: peakHour !== 'N/A' ? `${peakHour}:00` : 'N/A',
    topProduct
  };
}

async function generateProductPerformanceReport(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const productStats = {};
  
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const productId = item.productId;
      if (!productStats[productId]) {
        productStats[productId] = {
          name: item.product?.name || 'Unknown',
          category: item.product?.category || 'Uncategorized',
          unitsSold: 0,
          revenue: 0
        };
      }
      productStats[productId].unitsSold += item.quantity;
      productStats[productId].revenue += item.price * item.quantity;
    });
  });

  const products = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(p => ({
      ...p,
      revenue: p.revenue.toFixed(2)
    }));

  return { products };
}

async function generateCustomerPurchaseReport(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      customer: {
        include: {
          pets: true
        }
      }
    }
  });

  const customerStats = {};
  
  sales.forEach(sale => {
    const customerId = sale.customerId;
    if (!customerStats[customerId]) {
      customerStats[customerId] = {
        name: `${sale.customer?.firstName || ''} ${sale.customer?.lastName || ''}`.trim() || 'Unknown',
        petCount: sale.customer?.pets?.length || 0,
        totalSpent: 0,
        orderCount: 0,
        loyaltyTier: 'bronze'
      };
    }
    customerStats[customerId].totalSpent += sale.total;
    customerStats[customerId].orderCount += 1;
  });

  // Determine loyalty tier based on total spent
  Object.values(customerStats).forEach(customer => {
    if (customer.totalSpent >= 1000) {
      customer.loyaltyTier = 'gold';
    } else if (customer.totalSpent >= 500) {
      customer.loyaltyTier = 'silver';
    }
    customer.totalSpent = customer.totalSpent.toFixed(2);
  });

  const customers = Object.values(customerStats)
    .sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent))
    .slice(0, 10);

  return { customers };
}

async function generatePaymentMethodReport(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const paymentMethods = {};
  
  sales.forEach(sale => {
    const method = sale.paymentMethod || 'cash';
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  const total = Object.values(paymentMethods).reduce((sum, count) => sum + count, 0);
  
  const methods = Object.entries(paymentMethods)
    .map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: ((count / total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count);

  return { methods };
}

async function generateSalesTrendsReport(startDate, endDate) {
  // Placeholder for more complex trending analysis
  // This would typically involve time-series analysis and forecasting
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Calculate daily trends
  const dailyTrends = {};
  sales.forEach(sale => {
    const date = new Date(sale.createdAt).toLocaleDateString();
    if (!dailyTrends[date]) {
      dailyTrends[date] = {
        revenue: 0,
        orders: 0
      };
    }
    dailyTrends[date].revenue += sale.total;
    dailyTrends[date].orders += 1;
  });

  const trendData = Object.entries(dailyTrends).map(([date, data]) => ({
    date,
    revenue: data.revenue.toFixed(2),
    orders: data.orders
  }));

  return { 
    trends: trendData,
    forecast: 'Analysis based on historical data patterns'
  };
}

async function generateDiscountAnalysisReport(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const salesWithDiscount = sales.filter(s => s.discount > 0);
  const salesWithoutDiscount = sales.filter(s => s.discount === 0);

  const totalDiscountGiven = salesWithDiscount.reduce((sum, sale) => sum + sale.discount, 0);
  const avgDiscountPercentage = salesWithDiscount.length > 0
    ? (totalDiscountGiven / salesWithDiscount.reduce((sum, sale) => sum + (sale.total + sale.discount), 0) * 100)
    : 0;

  const revenueWithDiscount = salesWithDiscount.reduce((sum, sale) => sum + sale.total, 0);
  const revenueWithoutDiscount = salesWithoutDiscount.reduce((sum, sale) => sum + sale.total, 0);

  return {
    totalDiscountGiven: totalDiscountGiven.toFixed(2),
    avgDiscountPercentage: avgDiscountPercentage.toFixed(1),
    salesWithDiscount: salesWithDiscount.length,
    salesWithoutDiscount: salesWithoutDiscount.length,
    revenueWithDiscount: revenueWithDiscount.toFixed(2),
    revenueWithoutDiscount: revenueWithoutDiscount.toFixed(2),
    impact: 'Discount promotions analysis'
  };
}
