import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
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
    const dateRange = searchParams.get('dateRange') || 'last-30-days';

    // Calculate date filter based on range
    const dateFilter = getDateFilter(dateRange);

    // Fetch pet statistics
    const stats = await generatePetStats(dateFilter);

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Pet report generation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate pet report' },
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

async function generatePetStats(dateFilter) {
  // Get total pets
  const totalPets = await Pet.countDocuments({});
  
  // Get new pets in selected period
  const newPets = await Pet.countDocuments(dateFilter);

  // Get active pets (with appointments in last 90 days)
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  const activePetIds = await Appointment.distinct('pet', {
    appointmentDate: { $gte: threeMonthsAgo }
  });
  const activePets = activePetIds.length;

  // Calculate average age
  const avgAgeResult = await Pet.aggregate([
    {
      $project: {
        age: {
          $divide: [
            { $subtract: [new Date(), '$dateOfBirth'] },
            365 * 24 * 60 * 60 * 1000 // Convert to years
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgAge: { $avg: '$age' }
      }
    }
  ]);
  const avgAge = avgAgeResult[0]?.avgAge || 0;

  // Get species distribution
  const speciesDistribution = await Pet.aggregate([
    { 
      $group: { 
        _id: '$species',
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        name: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'dog'] }, then: 'Dogs' },
              { case: { $eq: ['$_id', 'cat'] }, then: 'Cats' },
              { case: { $eq: ['$_id', 'bird'] }, then: 'Birds' },
              { case: { $eq: ['$_id', 'fish'] }, then: 'Fish' },
              { case: { $eq: ['$_id', 'rabbit'] }, then: 'Rabbits' },
              { case: { $eq: ['$_id', 'hamster'] }, then: 'Hamsters' },
              { case: { $eq: ['$_id', 'other'] }, then: 'Other' }
            ],
            default: 'Unknown'
          }
        },
        value: 1,
        _id: 0
      }
    }
  ]);

  // Get breed distribution (top 10)
  const breedDistribution = await Pet.aggregate([
    { $match: { breed: { $exists: true, $ne: '' } } },
    { 
      $group: { 
        _id: '$breed',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $project: {
        breed: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);

  // Get age distribution
  const ageDistribution = await Pet.aggregate([
    {
      $project: {
        ageGroup: {
          $switch: {
            branches: [
              { 
                case: { 
                  $lt: [
                    { $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] },
                    1
                ] 
                }, 
                then: '< 1 year' 
              },
              { 
                case: { 
                  $lt: [
                    { $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] },
                    3
                ] 
                }, 
                then: '1-3 years' 
              },
              { 
                case: { 
                  $lt: [
                    { $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] },
                    7
                ] 
                }, 
                then: '3-7 years' 
              },
              { 
                case: { 
                  $lt: [
                    { $divide: [{ $subtract: [new Date(), '$dateOfBirth'] }, 365 * 24 * 60 * 60 * 1000] },
                    10
                ] 
                }, 
                then: '7-10 years' 
              }
            ],
            default: '10+ years'
          }
        }
      }
    },
    {
      $group: {
        _id: '$ageGroup',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        ageGroup: '$_id',
        count: 1,
        _id: 0
      }
    },
    {
      $sort: { ageGroup: 1 }
    }
  ]);

  // Get health metrics (common conditions)
  const healthMetrics = await generateHealthMetrics();

  // Get vaccination status
  const vaccinationStatus = await generateVaccinationStatus();

  return {
    totalPets,
    newPets,
    activePets,
    avgAge: avgAge.toFixed(1),
    speciesDistribution,
    breedDistribution,
    ageDistribution,
    healthMetrics,
    vaccinationStatus
  };
}

async function generateHealthMetrics() {
  // This would typically come from a health records collection
  // For now, returning sample data
  return [
    { condition: 'Dental Disease', count: 45 },
    { condition: 'Obesity', count: 38 },
    { condition: 'Ear Infections', count: 32 },
    { condition: 'Skin Allergies', count: 28 },
    { condition: 'Arthritis', count: 22 },
    { condition: 'Diabetes', count: 15 }
  ];
}

async function generateVaccinationStatus() {
  // Generate vaccination compliance data for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyData = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - (5 - i));
    
    // This would typically check actual vaccination records
    // For now, using sample data
    monthlyData.push({
      month: monthNames[monthDate.getMonth()],
      upToDate: Math.floor(Math.random() * 50) + 150,
      overdue: Math.floor(Math.random() * 20) + 10
    });
  }

  return monthlyData;
}
