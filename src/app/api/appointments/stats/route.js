import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Sale from '@/models/Sale';
import { requireAuth } from '@/lib/auth-middleware';

// GET /api/appointments/stats - Get appointment statistics
export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Default to current month if no dates provided
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const queryStartDate = startDate ? new Date(startDate) : defaultStartDate;
    const queryEndDate = endDate ? new Date(endDate) : defaultEndDate;

    // Today's appointments
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const todaysAppointments = await Appointment.find({
      date: { $gte: startOfToday, $lte: endOfToday },
      isActive: true
    })
      .populate('owner', 'firstName lastName')
      .populate('pet', 'name species')
      .populate('assignedTo', 'firstName lastName')
      .sort({ time: 1 });

    // Upcoming appointments (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingAppointments = await Appointment.find({
      date: { $gt: endOfToday, $lte: nextWeek },
      status: { $nin: ['cancelled', 'no-show'] },
      isActive: true
    })
      .populate('owner', 'firstName lastName')
      .populate('pet', 'name species')
      .sort({ date: 1, time: 1 })
      .limit(10);

    // General statistics
    const generalStats = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: queryStartDate, $lte: queryEndDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          scheduledCount: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
          confirmedCount: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          noShowCount: { $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] } }
        }
      }
    ]);

    // Appointment types breakdown
    const typeStats = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: queryStartDate, $lte: queryEndDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Daily appointment counts for the period
    const dailyStats = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: queryStartDate, $lte: queryEndDate },
          isActive: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue from appointment-related sales
    const appointmentSales = await Sale.aggregate([
      {
        $match: {
          saleDate: { $gte: queryStartDate, $lte: queryEndDate },
          notes: { $regex: 'appointment', $options: 'i' },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totals.grandTotal' },
          totalSales: { $sum: 1 },
          averageSale: { $avg: '$totals.grandTotal' }
        }
      }
    ]);

    // Staff performance
    const staffStats = await Appointment.aggregate([
      {
        $match: {
          date: { $gte: queryStartDate, $lte: queryEndDate },
          assignedTo: { $ne: null },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          totalAppointments: { $sum: 1 },
          completedAppointments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'staff'
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ['$completedAppointments', '$totalAppointments'] },
              100
            ]
          }
        }
      },
      { $sort: { totalAppointments: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        todaysAppointments,
        upcomingAppointments,
        statistics: {
          general: generalStats[0] || {
            totalAppointments: 0,
            scheduledCount: 0,
            confirmedCount: 0,
            completedCount: 0,
            cancelledCount: 0,
            noShowCount: 0
          },
          byType: typeStats,
          daily: dailyStats,
          revenue: appointmentSales[0] || {
            totalRevenue: 0,
            totalSales: 0,
            averageSale: 0
          },
          staff: staffStats
        }
      }
    });

  } catch (error) {
    console.error('Get appointment stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointment statistics', error: error.message },
      { status: 500 }
    );
  }
}