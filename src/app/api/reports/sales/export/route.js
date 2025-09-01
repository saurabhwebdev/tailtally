import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'pdf';

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Get report data based on type
    const reportData = await getReportData(type, start, end);

    if (format === 'csv') {
      return generateCSV(reportData, type);
    } else {
      return generatePDF(reportData, type, startDate, endDate);
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { message: 'Failed to export report' },
      { status: 500 }
    );
  }
}

async function getReportData(type, startDate, endDate) {
  switch (type) {
    case 'daily-sales':
      return await getDailySalesData(startDate, endDate);
    case 'weekly-sales':
      return await getWeeklySalesData(startDate, endDate);
    case 'monthly-revenue':
      return await getMonthlyRevenueData(startDate, endDate);
    case 'product-performance':
      return await getProductPerformanceData(startDate, endDate);
    case 'customer-purchases':
      return await getCustomerPurchaseData(startDate, endDate);
    case 'payment-methods':
      return await getPaymentMethodData(startDate, endDate);
    default:
      throw new Error('Invalid report type');
  }
}

async function getDailySalesData(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      customer: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return sales.map(sale => ({
    date: sale.createdAt.toLocaleDateString(),
    time: sale.createdAt.toLocaleTimeString(),
    customer: `${sale.customer?.firstName || ''} ${sale.customer?.lastName || ''}`.trim(),
    items: sale.items.length,
    subtotal: sale.subtotal,
    tax: sale.tax,
    discount: sale.discount,
    total: sale.total,
    paymentMethod: sale.paymentMethod
  }));
}

async function getWeeklySalesData(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    include: {
      customer: true
    }
  });

  // Group by day
  const dailyData = {};
  sales.forEach(sale => {
    const date = sale.createdAt.toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        transactions: 0,
        revenue: 0,
        customers: new Set()
      };
    }
    dailyData[date].transactions += 1;
    dailyData[date].revenue += sale.total;
    dailyData[date].customers.add(sale.customerId);
  });

  return Object.values(dailyData).map(day => ({
    date: day.date,
    transactions: day.transactions,
    revenue: day.revenue.toFixed(2),
    uniqueCustomers: day.customers.size
  }));
}

async function getMonthlyRevenueData(startDate, endDate) {
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

  // Group by category
  const categoryData = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const category = item.product?.category || 'Uncategorized';
      if (!categoryData[category]) {
        categoryData[category] = {
          category,
          itemsSold: 0,
          revenue: 0
        };
      }
      categoryData[category].itemsSold += item.quantity;
      categoryData[category].revenue += (item.price * item.quantity);
    });
  });

  return Object.values(categoryData).map(cat => ({
    ...cat,
    revenue: cat.revenue.toFixed(2)
  }));
}

async function getProductPerformanceData(startDate, endDate) {
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

  const productData = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const productName = item.product?.name || 'Unknown';
      if (!productData[productName]) {
        productData[productName] = {
          product: productName,
          category: item.product?.category || 'Uncategorized',
          unitsSold: 0,
          revenue: 0
        };
      }
      productData[productName].unitsSold += item.quantity;
      productData[productName].revenue += (item.price * item.quantity);
    });
  });

  return Object.values(productData)
    .sort((a, b) => b.revenue - a.revenue)
    .map(p => ({
      ...p,
      revenue: p.revenue.toFixed(2)
    }));
}

async function getCustomerPurchaseData(startDate, endDate) {
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

  const customerData = {};
  sales.forEach(sale => {
    const customerId = sale.customerId;
    if (!customerData[customerId]) {
      customerData[customerId] = {
        customer: `${sale.customer?.firstName || ''} ${sale.customer?.lastName || ''}`.trim() || 'Unknown',
        email: sale.customer?.email || '',
        phone: sale.customer?.phone || '',
        pets: sale.customer?.pets?.length || 0,
        orders: 0,
        totalSpent: 0
      };
    }
    customerData[customerId].orders += 1;
    customerData[customerId].totalSpent += sale.total;
  });

  return Object.values(customerData)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .map(c => ({
      ...c,
      totalSpent: c.totalSpent.toFixed(2)
    }));
}

async function getPaymentMethodData(startDate, endDate) {
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const methodData = {};
  sales.forEach(sale => {
    const method = sale.paymentMethod || 'cash';
    if (!methodData[method]) {
      methodData[method] = {
        method: method.charAt(0).toUpperCase() + method.slice(1),
        transactions: 0,
        total: 0
      };
    }
    methodData[method].transactions += 1;
    methodData[method].total += sale.total;
  });

  return Object.values(methodData)
    .sort((a, b) => b.total - a.total)
    .map(m => ({
      ...m,
      total: m.total.toFixed(2)
    }));
}

function generateCSV(data, type) {
  try {
    let fields;
    switch (type) {
      case 'daily-sales':
        fields = ['date', 'time', 'customer', 'items', 'subtotal', 'tax', 'discount', 'total', 'paymentMethod'];
        break;
      case 'weekly-sales':
        fields = ['date', 'transactions', 'revenue', 'uniqueCustomers'];
        break;
      case 'monthly-revenue':
        fields = ['category', 'itemsSold', 'revenue'];
        break;
      case 'product-performance':
        fields = ['product', 'category', 'unitsSold', 'revenue'];
        break;
      case 'customer-purchases':
        fields = ['customer', 'email', 'phone', 'pets', 'orders', 'totalSpent'];
        break;
      case 'payment-methods':
        fields = ['method', 'transactions', 'total'];
        break;
      default:
        fields = Object.keys(data[0] || {});
    }

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="sales-report-${type}-${Date.now()}.csv"`
      }
    });
  } catch (error) {
    throw new Error('Failed to generate CSV');
  }
}

function generatePDF(data, type, startDate, endDate) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="sales-report-${type}-${Date.now()}.pdf"`
          }
        }));
      });

      // Add title
      doc.fontSize(20).text('Sales Report', { align: 'center' });
      doc.fontSize(14).text(getReportTitle(type), { align: 'center' });
      doc.fontSize(10).text(`Period: ${startDate} to ${endDate}`, { align: 'center' });
      doc.moveDown(2);

      // Add content based on report type
      switch (type) {
        case 'daily-sales':
          addDailySalesPDF(doc, data);
          break;
        case 'weekly-sales':
          addWeeklySalesPDF(doc, data);
          break;
        case 'monthly-revenue':
          addMonthlyRevenuePDF(doc, data);
          break;
        case 'product-performance':
          addProductPerformancePDF(doc, data);
          break;
        case 'customer-purchases':
          addCustomerPurchasePDF(doc, data);
          break;
        case 'payment-methods':
          addPaymentMethodPDF(doc, data);
          break;
      }

      // Add footer
      doc.moveDown(2);
      doc.fontSize(8).text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function getReportTitle(type) {
  const titles = {
    'daily-sales': 'Daily Sales Summary',
    'weekly-sales': 'Weekly Sales Analysis',
    'monthly-revenue': 'Monthly Revenue Report',
    'product-performance': 'Product Performance Analysis',
    'customer-purchases': 'Customer Purchase History',
    'payment-methods': 'Payment Method Analysis'
  };
  return titles[type] || 'Sales Report';
}

function addDailySalesPDF(doc, data) {
  doc.fontSize(12).text('Transaction Details', { underline: true });
  doc.moveDown();

  data.forEach((sale, index) => {
    if (index > 0) doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`${sale.date} ${sale.time} - ${sale.customer}`);
    doc.text(`Items: ${sale.items}, Total: $${sale.total}, Payment: ${sale.paymentMethod}`);
  });

  // Add summary
  doc.moveDown(2);
  doc.fontSize(12).text('Summary', { underline: true });
  doc.moveDown();
  const totalRevenue = data.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
  doc.text(`Total Transactions: ${data.length}`);
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
}

function addWeeklySalesPDF(doc, data) {
  doc.fontSize(12).text('Daily Breakdown', { underline: true });
  doc.moveDown();

  data.forEach(day => {
    doc.fontSize(10);
    doc.text(`${day.date}: ${day.transactions} transactions, $${day.revenue} revenue, ${day.uniqueCustomers} customers`);
  });

  // Add summary
  doc.moveDown(2);
  doc.fontSize(12).text('Week Summary', { underline: true });
  doc.moveDown();
  const totalRevenue = data.reduce((sum, day) => sum + parseFloat(day.revenue), 0);
  const totalTransactions = data.reduce((sum, day) => sum + day.transactions, 0);
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
  doc.text(`Total Transactions: ${totalTransactions}`);
}

function addMonthlyRevenuePDF(doc, data) {
  doc.fontSize(12).text('Revenue by Category', { underline: true });
  doc.moveDown();

  data.forEach(cat => {
    doc.fontSize(10);
    doc.text(`${cat.category}: ${cat.itemsSold} items, $${cat.revenue} revenue`);
  });

  // Add summary
  doc.moveDown(2);
  doc.fontSize(12).text('Month Summary', { underline: true });
  doc.moveDown();
  const totalRevenue = data.reduce((sum, cat) => sum + parseFloat(cat.revenue), 0);
  const totalItems = data.reduce((sum, cat) => sum + cat.itemsSold, 0);
  doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`);
  doc.text(`Total Items Sold: ${totalItems}`);
}

function addProductPerformancePDF(doc, data) {
  doc.fontSize(12).text('Top Products', { underline: true });
  doc.moveDown();

  data.slice(0, 20).forEach((product, index) => {
    doc.fontSize(10);
    doc.text(`${index + 1}. ${product.product} (${product.category})`);
    doc.text(`   Units: ${product.unitsSold}, Revenue: $${product.revenue}`);
  });
}

function addCustomerPurchasePDF(doc, data) {
  doc.fontSize(12).text('Top Customers', { underline: true });
  doc.moveDown();

  data.slice(0, 20).forEach((customer, index) => {
    doc.fontSize(10);
    doc.text(`${index + 1}. ${customer.customer}`);
    doc.text(`   Orders: ${customer.orders}, Total Spent: $${customer.totalSpent}`);
  });
}

function addPaymentMethodPDF(doc, data) {
  doc.fontSize(12).text('Payment Method Distribution', { underline: true });
  doc.moveDown();

  data.forEach(method => {
    doc.fontSize(10);
    doc.text(`${method.method}: ${method.transactions} transactions, $${method.total} total`);
  });

  // Calculate percentages
  const totalRevenue = data.reduce((sum, m) => sum + parseFloat(m.total), 0);
  doc.moveDown();
  doc.fontSize(10).text('Percentage Distribution:', { underline: true });
  data.forEach(method => {
    const percentage = ((parseFloat(method.total) / totalRevenue) * 100).toFixed(1);
    doc.text(`${method.method}: ${percentage}%`);
  });
}
