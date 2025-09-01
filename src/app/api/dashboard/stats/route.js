import connectDB from '@/lib/mongodb';
import Pet from '@/models/Pet';
import User from '@/models/User';
import Inventory from '@/models/Inventory';
import Sale from '@/models/Sale';
import Invoice from '@/models/Invoice';
import Owner from '@/models/Owner';
import Appointment from '@/models/Appointment';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(request) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    await connectDB();
    
    // Build query based on user role
    let petQuery = { isActive: true };
    if (user.role === 'customer') {
      petQuery.owner = user._id;
    }
    
    // Get total pets count
    const totalPets = await Pet.countDocuments(petQuery);
    
    // Get pets by species
    const petsBySpecies = await Pet.aggregate([
      { $match: petQuery },
      { $group: { _id: '$species', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get recently added pets (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPets = await Pet.countDocuments({
      ...petQuery,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get pets with upcoming vaccinations (next 30 days)
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const petsWithUpcomingVaccinations = await Pet.countDocuments({
      ...petQuery,
      'vaccinations.nextDue': {
        $gte: new Date(),
        $lte: nextMonth
      }
    });
    
    // Get total customers (for admin/staff)
    let totalCustomers = 0;
    if (user.role !== 'customer') {
      totalCustomers = await User.countDocuments({ role: 'customer' });
    }

    // Get sales statistics (for admin/staff)
    let salesStats = null;
    if (user.role !== 'customer') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      
      // Get sales data
      // First, let's check a sample sale to see the structure
      const sampleSale = await Sale.findOne({});
      console.log('Sample sale structure:', JSON.stringify(sampleSale, null, 2));
      
      const [totalSalesResult] = await Sale.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $ifNull: ['$totals.grandTotal', 0] } },
            totalSales: { $sum: 1 },
            averageSale: { $avg: { $ifNull: ['$totals.grandTotal', 0] } }
          }
        }
      ]);

      // Get monthly sales
      console.log('Start of month:', startOfMonth.toISOString());
      console.log('Today:', today.toISOString());
      
      // Get total sales count first
      const totalSalesCount = await Sale.countDocuments({});
      console.log('Total sales in database:', totalSalesCount);
      
      const salesCount = await Sale.countDocuments({ saleDate: { $gte: startOfMonth } });
      console.log('Sales count this month:', salesCount);
      
      // Get all sales to check date format
      const allSales = await Sale.find({}).limit(5).select('saleDate totals saleNumber');
      console.log('First 5 sales:', allSales);
      
      const [monthlySalesResult] = await Sale.aggregate([
        { $match: { 
          saleDate: { $gte: startOfMonth },
          'totals.grandTotal': { $exists: true }
        }},
        {
          $group: {
            _id: null,
            monthlyRevenue: { $sum: { $ifNull: ['$totals.grandTotal', 0] } },
            monthlySales: { $sum: 1 }
          }
        }
      ]);
      
      console.log('Monthly sales result:', monthlySalesResult);

      // Get daily sales trend (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const dailySalesTrend = await Sale.aggregate([
        { $match: { saleDate: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$saleDate' },
              month: { $month: '$saleDate' },
              day: { $dayOfMonth: '$saleDate' }
            },
            revenue: { $sum: '$totals.grandTotal' },
            sales: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      salesStats = {
        totalRevenue: totalSalesResult?.totalRevenue || 0,
        totalSales: totalSalesResult?.totalSales || 0,
        averageSale: totalSalesResult?.averageSale || 0,
        monthlyRevenue: monthlySalesResult?.monthlyRevenue || 0,
        monthlySales: monthlySalesResult?.monthlySales || 0,
        dailyTrend: dailySalesTrend
      };
    }

    // Get inventory statistics (for admin/staff)
    let inventoryStats = null;
    if (user.role !== 'customer') {
      const [inventoryOverview] = await Inventory.getInventoryStats();
      
      // Get category breakdown
      const categoryBreakdown = await Inventory.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      inventoryStats = {
        totalItems: inventoryOverview?.totalItems || 0,
        totalValue: inventoryOverview?.totalValue || 0,
        lowStockItems: inventoryOverview?.lowStockItems || 0,
        expiringSoonItems: inventoryOverview?.expiringSoonItems || 0,
        categoryBreakdown
      };
    }

    // Get invoice statistics (for admin/staff)
    let invoiceStats = null;
    if (user.role !== 'customer') {
      const [invoiceOverview] = await Invoice.aggregate([
        {
          $group: {
            _id: null,
            totalInvoices: { $sum: 1 },
            totalAmount: { $sum: '$totals.finalAmount' },
            paidInvoices: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, 1, 0] }
            },
            pendingInvoices: {
              $sum: { $cond: [{ $eq: ['$payment.status', 'pending'] }, 1, 0] }
            },
            overdueInvoices: {
              $sum: { 
                $cond: [
                  { 
                    $and: [
                      { $eq: ['$payment.status', 'pending'] },
                      { $lt: ['$dueDate', new Date()] }
                    ]
                  }, 
                  1, 
                  0 
                ]
              }
            },
            totalPaid: {
              $sum: { 
                $cond: [
                  { $eq: ['$payment.status', 'paid'] }, 
                  '$totals.finalAmount', 
                  0 
                ]
              }
            },
            totalDue: {
              $sum: { 
                $cond: [
                  { $eq: ['$payment.status', 'pending'] }, 
                  '$totals.finalAmount', 
                  0 
                ]
              }
            }
          }
        }
      ]);

      invoiceStats = {
        totalInvoices: invoiceOverview?.totalInvoices || 0,
        totalAmount: invoiceOverview?.totalAmount || 0,
        paidInvoices: invoiceOverview?.paidInvoices || 0,
        pendingInvoices: invoiceOverview?.pendingInvoices || 0,
        overdueInvoices: invoiceOverview?.overdueInvoices || 0,
        totalPaid: invoiceOverview?.totalPaid || 0,
        totalDue: invoiceOverview?.totalDue || 0,
        collectionRate: invoiceOverview?.totalAmount > 0 
          ? ((invoiceOverview?.totalPaid || 0) / invoiceOverview.totalAmount * 100).toFixed(1)
          : 0
      };
    }
    
    // Get recent activities
    const recentPetActivities = await Pet.find(petQuery)
      .populate('owner', 'firstName lastName email')
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('name species owner updatedAt createdAt');
    
    // Format recent activities
    const recentActivities = recentPetActivities.map(pet => {
      const isNewPet = new Date(pet.createdAt).getTime() === new Date(pet.updatedAt).getTime();
      return {
        id: pet._id,
        action: isNewPet ? 'New pet registered' : 'Pet information updated',
        pet: `${pet.name} (${pet.species})`,
        time: getTimeAgo(pet.updatedAt),
        user: pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : 'Unknown',
        type: isNewPet ? 'registration' : 'update'
      };
    });
    
    // Get today's appointments
    let todaysAppointments = [];
    if (user.role !== 'customer') {
      try {
        const appointments = await Appointment.findTodaysAppointments();
        todaysAppointments = appointments.map(appointment => ({
          id: appointment._id,
          time: appointment.time,
          pet: appointment.pet?.name || 'Unknown Pet',
          owner: appointment.owner ? `${appointment.owner.firstName} ${appointment.owner.lastName}` : 'Unknown Owner',
          type: appointment.type,
          priority: appointment.priority
        }));
      } catch (err) {
        console.error('Error fetching today\'s appointments:', err);
        // Continue with empty appointments array
      }
    }
    
    // Calculate comprehensive statistics
    const stats = {
      // Pet statistics
      pets: {
        total: totalPets,
        recent: recentPets,
        upcomingVaccinations: petsWithUpcomingVaccinations,
        bySpecies: petsBySpecies.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      },
      // User statistics
      users: {
        totalCustomers
      },
      // Sales statistics (admin/staff only)
      sales: salesStats,
      // Inventory statistics (admin/staff only)
      inventory: inventoryStats,
      // Invoice statistics (admin/staff only)
      invoices: invoiceStats,
      // Recent activities
      recentActivities,
      // Today's schedule
      todaysAppointments
    };
    
    return Response.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve dashboard statistics',
        error: error.message
      },
      { status: 500 }
    );
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}
