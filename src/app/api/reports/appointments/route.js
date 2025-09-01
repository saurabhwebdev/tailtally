import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
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
    const type = searchParams.get('type') || 'daily-schedule';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter.$lte = end;
    }

    const filter = dateFilter.$gte || dateFilter.$lte ? { date: dateFilter } : {};

    let reportData = {};

    switch (type) {
      case 'daily-schedule':
        const appointments = await Appointment.find(filter)
          .populate('pet', 'name species breed')
          .populate('owner', 'firstName lastName email phone')
          .populate('assignedTo', 'firstName lastName')
          .sort({ date: 1, time: 1 })
          .limit(50);

        reportData = { appointments };
        break;

      case 'weekly-summary':
        const weeklyAppointments = await Appointment.find(filter);
        const summary = {
          total: weeklyAppointments.length,
          completed: weeklyAppointments.filter(apt => apt.status === 'completed').length,
          cancelled: weeklyAppointments.filter(apt => apt.status === 'cancelled').length,
          noShow: weeklyAppointments.filter(apt => apt.status === 'no-show').length
        };

        // Group by day
        const dailyBreakdown = {};
        weeklyAppointments.forEach(apt => {
          const day = apt.date.toISOString().split('T')[0];
          dailyBreakdown[day] = (dailyBreakdown[day] || 0) + 1;
        });

        reportData = {
          summary,
          dailyBreakdown: Object.entries(dailyBreakdown).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            count
          }))
        };
        break;

      case 'monthly-metrics':
        const monthlyAppointments = await Appointment.find(filter);
        const totalAppointments = monthlyAppointments.length;
        const completedAppointments = monthlyAppointments.filter(apt => apt.status === 'completed').length;
        const completionRate = totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0;
        const averageDuration = monthlyAppointments.length > 0 
          ? Math.round(monthlyAppointments.reduce((sum, apt) => sum + (apt.duration || 30), 0) / monthlyAppointments.length)
          : 0;

        // Get previous month for comparison
        const prevMonthStart = new Date(startDate);
        prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
        const prevMonthEnd = new Date(endDate);
        prevMonthEnd.setMonth(prevMonthEnd.getMonth() - 1);

        const prevMonthAppointments = await Appointment.find({
          date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        });

        const appointmentGrowth = prevMonthAppointments.length > 0 
          ? Math.round(((totalAppointments - prevMonthAppointments.length) / prevMonthAppointments.length) * 100)
          : 0;

        // Get insights
        const typeCount = {};
        monthlyAppointments.forEach(apt => {
          typeCount[apt.type] = (typeCount[apt.type] || 0) + 1;
        });
        const popularType = Object.entries(typeCount).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

        reportData = {
          metrics: {
            totalAppointments,
            completionRate,
            averageDuration
          },
          growth: {
            appointmentGrowth,
            revenueGrowth: Math.floor(Math.random() * 20) // Placeholder
          },
          insights: {
            peakDay: 'Monday', // Placeholder
            popularType,
            topStaff: 'Dr. Smith' // Placeholder
          }
        };
        break;

      case 'staff-workload':
        const staffAppointments = await Appointment.find(filter)
          .populate('assignedTo', 'firstName lastName role');

        const staffWorkload = {};
        staffAppointments.forEach(apt => {
          if (apt.assignedTo) {
            const staffId = apt.assignedTo._id.toString();
            if (!staffWorkload[staffId]) {
              staffWorkload[staffId] = {
                name: `${apt.assignedTo.firstName} ${apt.assignedTo.lastName}`,
                role: apt.assignedTo.role || 'Staff',
                totalAppointments: 0,
                completedAppointments: 0
              };
            }
            staffWorkload[staffId].totalAppointments++;
            if (apt.status === 'completed') {
              staffWorkload[staffId].completedAppointments++;
            }
          }
        });

        const staffWorkloadArray = Object.values(staffWorkload).map(staff => ({
          ...staff,
          completionRate: staff.totalAppointments > 0 
            ? Math.round((staff.completedAppointments / staff.totalAppointments) * 100)
            : 0
        }));

        reportData = { staffWorkload: staffWorkloadArray };
        break;

      case 'type-distribution':
        const typeAppointments = await Appointment.find(filter);
        const typeDistribution = {};
        typeAppointments.forEach(apt => {
          typeDistribution[apt.type] = (typeDistribution[apt.type] || 0) + 1;
        });

        const total = typeAppointments.length;
        const typeDistributionArray = Object.entries(typeDistribution).map(([name, count]) => ({
          name,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0
        }));

        reportData = { typeDistribution: typeDistributionArray };
        break;

      case 'cancellation-rate':
        const cancellationAppointments = await Appointment.find(filter);
        const totalCancellations = cancellationAppointments.filter(apt => apt.status === 'cancelled').length;
        const totalNoShows = cancellationAppointments.filter(apt => apt.status === 'no-show').length;
        const totalAppts = cancellationAppointments.length;

        const cancellationRate = {
          overall: totalAppts > 0 ? Math.round((totalCancellations / totalAppts) * 100) : 0,
          noShow: totalAppts > 0 ? Math.round((totalNoShows / totalAppts) * 100) : 0
        };

        // Placeholder cancellation reasons
        const cancellationReasons = [
          { reason: 'Pet illness', count: Math.floor(totalCancellations * 0.3) },
          { reason: 'Schedule conflict', count: Math.floor(totalCancellations * 0.4) },
          { reason: 'Emergency', count: Math.floor(totalCancellations * 0.2) },
          { reason: 'Other', count: Math.floor(totalCancellations * 0.1) }
        ];

        reportData = { cancellationRate, cancellationReasons };
        break;

      case 'revenue-by-type':
        const revenueAppointments = await Appointment.find(filter);
        const revenueByType = {};
        
        // Placeholder revenue calculation (would integrate with actual pricing)
        const typePricing = {
          checkup: 50,
          vaccination: 75,
          surgery: 300,
          grooming: 40,
          emergency: 150,
          other: 60
        };

        revenueAppointments.forEach(apt => {
          if (!revenueByType[apt.type]) {
            revenueByType[apt.type] = { count: 0, revenue: 0 };
          }
          revenueByType[apt.type].count++;
          revenueByType[apt.type].revenue += typePricing[apt.type] || 50;
        });

        const revenueByTypeArray = Object.entries(revenueByType).map(([type, data]) => ({
          type,
          count: data.count,
          revenue: data.revenue,
          averageRevenue: data.count > 0 ? Math.round(data.revenue / data.count) : 0
        }));

        reportData = { revenueByType: revenueByTypeArray };
        break;

      case 'customer-retention':
        const retentionAppointments = await Appointment.find(filter)
          .populate('owner', 'firstName lastName');

        const customerVisits = {};
        retentionAppointments.forEach(apt => {
          if (apt.owner) {
            const ownerId = apt.owner._id.toString();
            customerVisits[ownerId] = (customerVisits[ownerId] || 0) + 1;
          }
        });

        const totalCustomers = Object.keys(customerVisits).length;
        const returningCustomers = Object.values(customerVisits).filter(visits => visits > 1).length;
        const returnRate = totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0;
        const averageVisits = totalCustomers > 0 
          ? Math.round(Object.values(customerVisits).reduce((sum, visits) => sum + visits, 0) / totalCustomers)
          : 0;

        // Count new customers (first appointment in date range)
        const newCustomers = Object.keys(customerVisits).length; // Simplified

        reportData = {
          retention: {
            returnRate,
            averageVisits,
            newCustomers
          }
        };
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