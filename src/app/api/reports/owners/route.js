import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import Appointment from '@/models/Appointment';
import Sale from '@/models/Sale';
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
    const dateRange = searchParams.get('dateRange') || 'last-30-days';

    // Calculate date filter based on range
    const dateFilter = getDateFilter(dateRange);

    // Fetch owner statistics
    const stats = await generateOwnerStats(dateFilter);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Owner report generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate owner report' },
      { status: 500 }
    );
  }
}

function getDateFilter(dateRange) {
  const now = new Date();
  let startDate = new Date();

  switch (dateRange) {
    case 'last-7-days':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'last-30-days':
      startDate.setDate(now.getDate() - 30);
      break;
    case 'last-90-days':
      startDate.setDate(now.getDate() - 90);
      break;
    case 'last-year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all-time':
      return {}; // No date filter
    default:
      startDate.setDate(now.getDate() - 30);
  }

  return { createdAt: { $gte: startDate } };
}

async function generateOwnerStats(dateFilter) {
  // Get total owners
  const totalOwners = await Owner.countDocuments({});
  
  // Get new owners in selected period
  const newOwners = await Owner.countDocuments(dateFilter);

  // Get active owners (with appointments in last 90 days)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const activeOwnerIds = await Appointment.distinct('owner', {
    appointmentDate: { $gte: threeMonthsAgo }
  });
  const activeOwners = activeOwnerIds.length;

  // Calculate retention rate
  const retentionRate = totalOwners > 0 ? ((activeOwners / totalOwners) * 100).toFixed(1) : 0;

  // Get source distribution
  const sourceDistribution = await Owner.aggregate([
    { $match: dateFilter },
    { 
      $group: { 
        _id: '$source',
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        name: { 
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'walk_in'] }, then: 'Walk-in' },
              { case: { $eq: ['$_id', 'referral'] }, then: 'Referral' },
              { case: { $eq: ['$_id', 'online'] }, then: 'Online' },
              { case: { $eq: ['$_id', 'advertisement'] }, then: 'Advertisement' },
              { case: { $eq: ['$_id', 'social_media'] }, then: 'Social Media' },
              { case: { $eq: ['$_id', 'other'] }, then: 'Other' }
            ],
            default: 'Unknown'
          }
        },
        value: 1
      }
    }
  ]);

  // Get top cities
  const topCities = await Owner.aggregate([
    { $match: { city: { $exists: true, $ne: '' } } },
    { 
      $group: { 
        _id: '$city',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        city: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  // Get registration trend (last 12 months)
  const registrationTrend = await generateRegistrationTrend();

  // Get revenue by owner
  const revenueByOwner = await generateRevenueByOwner();

  return {
    totalOwners,
    newOwners,
    activeOwners,
    retentionRate: parseFloat(retentionRate),
    sourceDistribution,
    topCities,
    registrationTrend,
    revenueByOwner
  };
}

async function generateRegistrationTrend() {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const registrations = await Owner.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: {
                if: { $lt: ['$_id.month', 10] },
                then: { $concat: ['0', { $toString: '$_id.month' }] },
                else: { $toString: '$_id.month' }
              }
            }
          ]
        },
        count: 1,
        _id: 0
      }
    }
  ]);

  return registrations;
}

async function generateRevenueByOwner() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const revenueData = await Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalRevenue: { $sum: '$totals.grandTotal' },
        ownerCount: { $addToSet: '$customer.owner' }
      }
    },
    {
      $project: {
        month: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: {
                if: { $lt: ['$_id.month', 10] },
                then: { $concat: ['0', { $toString: '$_id.month' }] },
                else: { $toString: '$_id.month' }
              }
            }
          ]
        },
        averageRevenue: {
          $cond: {
            if: { $gt: [{ $size: '$ownerCount' }, 0] },
            then: { $divide: ['$totalRevenue', { $size: '$ownerCount' }] },
            else: 0
          }
        },
        _id: 0
      }
    },
    {
      $sort: { month: 1 }
    }
  ]);

  return revenueData;
}
