import { NextResponse } from 'next/server';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';
import connectDB from '@/lib/mongodb';
import Pet from '@/models/Pet';
import Owner from '@/models/Owner';
import User from '@/models/User';
import petNotificationService from '@/lib/pet-notification-service';

/**
 * POST /api/pets/notifications
 * Send pet-related email notifications
 */
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Check authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has permission to send notifications (staff only)
    if (user.role !== 'staff' && user.role !== 'admin' && user.role !== 'veterinarian') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. Only staff can send notifications.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, petId, ownerEmail, additionalData } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Notification type is required' },
        { status: 400 }
      );
    }

    if (!petId && !ownerEmail) {
      return NextResponse.json(
        { error: 'Either petId or ownerEmail is required' },
        { status: 400 }
      );
    }

    let pet, owner;

    // Get pet and owner data
    if (petId) {
      try {
        pet = await Pet.findById(petId).populate('owner');
        if (!pet) {
          console.log(`Pet not found with ID: ${petId}`);
          return NextResponse.json(
            { error: 'Pet not found' },
            { status: 404 }
          );
        }
        owner = pet.owner;
        if (!owner) {
          console.log(`Pet found but owner not populated for pet ID: ${petId}`);
          return NextResponse.json(
            { error: 'Pet owner information not found' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error while fetching pet:', {
          petId,
          error: dbError.message,
          stack: dbError.stack
        });
        return NextResponse.json(
          { error: 'Database error while fetching pet information' },
          { status: 500 }
        );
      }
    } else if (ownerEmail) {
      try {
        owner = await Owner.findOne({ email: ownerEmail });
        if (!owner) {
          console.log(`Owner not found with email: ${ownerEmail}`);
          return NextResponse.json(
            { error: 'Owner not found' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error while fetching owner:', {
          ownerEmail,
          error: dbError.message,
          stack: dbError.stack
        });
        return NextResponse.json(
          { error: 'Database error while fetching owner information' },
          { status: 500 }
        );
      }
    }

    // Send notification based on type
    let result;
    try {
      switch (type) {
        case 'welcome':
          if (!pet) {
            return NextResponse.json(
              { error: 'Pet ID is required for welcome notifications' },
              { status: 400 }
            );
          }
          console.log(`Sending welcome notification for pet: ${pet.name} (${pet._id}) to owner: ${owner.email}`);
          result = await petNotificationService.sendPetRegistrationWelcome(
            pet.toObject(),
            owner.toObject(),
            user._id.toString()
          );
          break;

        case 'profile_update':
          if (!pet) {
            return NextResponse.json(
              { error: 'Pet ID is required for profile update notifications' },
              { status: 400 }
            );
          }
          const updateType = additionalData?.updateType || 'general';
          console.log(`Sending profile update notification for pet: ${pet.name} (${pet._id}) to owner: ${owner.email}`);
          result = await petNotificationService.sendPetProfileUpdate(
            pet.toObject(),
            owner.toObject(),
            updateType,
            user._id.toString()
          );
          break;

        case 'medical_record':
          if (!pet) {
            return NextResponse.json(
              { error: 'Pet ID is required for medical record notifications' },
              { status: 400 }
            );
          }
          if (!additionalData?.medicalData) {
            return NextResponse.json(
              { error: 'Medical data is required for medical record notifications' },
              { status: 400 }
            );
          }
          console.log(`Sending medical record notification for pet: ${pet.name} (${pet._id}) to owner: ${owner.email}`);
          result = await petNotificationService.sendMedicalRecordUpdate(
            pet.toObject(),
            owner.toObject(),
            additionalData.medicalData,
            user._id.toString()
          );
          break;

        case 'vaccination_reminder':
          if (!pet) {
            return NextResponse.json(
              { error: 'Pet ID is required for vaccination reminders' },
              { status: 400 }
            );
          }
          if (!additionalData?.vaccinationData) {
            return NextResponse.json(
              { error: 'Vaccination data is required for vaccination reminders' },
              { status: 400 }
            );
          }
          console.log(`Sending vaccination reminder for pet: ${pet.name} (${pet._id}) to owner: ${owner.email}`);
          result = await petNotificationService.sendVaccinationReminder(
            pet.toObject(),
            owner.toObject(),
            additionalData.vaccinationData,
            user._id.toString()
          );
          break;

        default:
          return NextResponse.json(
            { error: `Unknown notification type: ${type}` },
            { status: 400 }
          );
      }
    } catch (notificationError) {
      console.error('Error in notification service:', {
        type,
        petId,
        ownerEmail,
        error: notificationError.message,
        stack: notificationError.stack,
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { error: 'Failed to process notification request' },
        { status: 500 }
      );
    }

    // Return result
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || 'Notification sent successfully',
        skipped: result.skipped || false
      });
    } else {
      return NextResponse.json(
        { error: result.message || 'Failed to send notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in pet notifications API:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      requestBody: body,
      timestamp: new Date().toISOString()
    });
    
    // Return more specific error information in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(isDevelopment && {
          details: {
            message: error.message,
            name: error.name,
            stack: error.stack
          }
        })
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pets/notifications/bulk
 * Send bulk pet notifications
 */
export async function PUT(request) {
  try {
    // Connect to database
    await connectDB();

    // Check authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { user } = authResult;

    // Check if user has permission to send notifications (staff only)
    if (user.role !== 'staff' && user.role !== 'admin' && user.role !== 'veterinarian') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. Only staff can send bulk notifications.' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { notifications } = body;

    // Validate notifications array
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return NextResponse.json(
        { error: 'Notifications array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate each notification
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      if (!notification.type || (!notification.petId && !notification.ownerEmail)) {
        return NextResponse.json(
          { error: `Invalid notification at index ${i}: type and (petId or ownerEmail) are required` },
          { status: 400 }
        );
      }
    }

    // Process notifications - get pet and owner data
    const processedNotifications = [];
    
    for (const notification of notifications) {
      try {
        let pet, owner;
        
        if (notification.petId) {
          pet = await Pet.findById(notification.petId).populate('owner');
          if (pet) {
            owner = pet.owner;
          }
        } else if (notification.ownerEmail) {
          owner = await Owner.findOne({ email: notification.ownerEmail });
        }

        if (pet || owner) {
          processedNotifications.push({
            type: notification.type,
            petData: pet ? pet.toObject() : null,
            ownerData: owner ? owner.toObject() : null,
            additionalData: notification.additionalData || {}
          });
        }
      } catch (error) {
        console.error(`Error processing notification for ${notification.petId || notification.ownerEmail}:`, error);
        // Continue with other notifications
      }
    }

    if (processedNotifications.length === 0) {
      return NextResponse.json(
        { error: 'No valid notifications to process' },
        { status: 400 }
      );
    }

    // Send bulk notifications
    const result = await petNotificationService.sendBulkNotifications(
      processedNotifications,
      user._id.toString()
    );

    return NextResponse.json({
      success: true,
      message: result.message,
      results: result.results
    });

  } catch (error) {
    console.error('Error in bulk pet notifications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}