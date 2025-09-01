import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';
import ownerNotificationService from '@/lib/owner-notification-service';
import { requireAuth } from '@/lib/auth-middleware';

/**
 * POST /api/owners/notifications
 * Send owner-related email notifications
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
    const { type, ownerId, ownerEmail, additionalData } = body;

    // Validate required fields
    if (!type) {
      return NextResponse.json(
        { error: 'Notification type is required' },
        { status: 400 }
      );
    }

    if (!ownerId && !ownerEmail) {
      return NextResponse.json(
        { error: 'Either ownerId or ownerEmail is required' },
        { status: 400 }
      );
    }

    let owner;

    // Get owner data
    if (ownerId) {
      try {
        owner = await Owner.findById(ownerId);
        if (!owner) {
          console.log(`Owner not found with ID: ${ownerId}`);
          return NextResponse.json(
            { error: 'Owner not found' },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error(`Error finding owner by ID ${ownerId}:`, error);
        return NextResponse.json(
          { error: 'Invalid owner ID format' },
          { status: 400 }
        );
      }
    } else if (ownerEmail) {
      try {
        owner = await Owner.findByEmail(ownerEmail);
        if (!owner) {
          console.log(`Owner not found with email: ${ownerEmail}`);
          return NextResponse.json(
            { error: 'Owner not found with provided email' },
            { status: 404 }
          );
        }
      } catch (error) {
        console.error(`Error finding owner by email ${ownerEmail}:`, error);
        return NextResponse.json(
          { error: 'Error finding owner by email' },
          { status: 500 }
        );
      }
    }

    // Send notification based on type
    let result;
    try {
      switch (type) {
        case 'welcome':
          result = await ownerNotificationService.sendOwnerRegistrationWelcome(
            owner.toObject(),
            user._id.toString()
          );
          break;

        case 'profile_update':
          const updateType = additionalData?.updateType || 'general';
          result = await ownerNotificationService.sendOwnerProfileUpdate(
            owner.toObject(),
            updateType,
            user._id.toString()
          );
          break;

        case 'appointment_reminder':
          const appointmentData = additionalData?.appointmentData || {};
          result = await ownerNotificationService.sendAppointmentReminder(
            owner.toObject(),
            appointmentData,
            user._id.toString()
          );
          break;

        case 'general':
          const subject = additionalData?.subject || 'Important Information';
          const message = additionalData?.message || '';
          result = await ownerNotificationService.sendGeneralNotification(
            owner.toObject(),
            subject,
            message,
            user._id.toString()
          );
          break;

        default:
          return NextResponse.json(
            { error: `Unsupported notification type: ${type}` },
            { status: 400 }
          );
      }

      return NextResponse.json({
        success: result.success,
        message: result.message,
        skipped: result.skipped || false
      });

    } catch (error) {
      console.error(`Error sending ${type} notification:`, error);
      return NextResponse.json(
        { error: `Failed to send ${type} notification: ${error.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in owner notifications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/owners/notifications/bulk
 * Send bulk owner notifications
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
        { success: false, message: 'Insufficient permissions. Only staff can send notifications.' },
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
    for (const notification of notifications) {
      if (!notification.type) {
        return NextResponse.json(
          { error: 'Each notification must have a type' },
          { status: 400 }
        );
      }
      if (!notification.ownerId && !notification.ownerEmail) {
        return NextResponse.json(
          { error: 'Each notification must have either ownerId or ownerEmail' },
          { status: 400 }
        );
      }
    }

    // Process notifications - get owner data
    const processedNotifications = [];
    
    for (const notification of notifications) {
      try {
        let owner;
        
        if (notification.ownerId) {
          owner = await Owner.findById(notification.ownerId);
        } else if (notification.ownerEmail) {
          owner = await Owner.findByEmail(notification.ownerEmail);
        }

        if (owner) {
          processedNotifications.push({
            type: notification.type,
            ownerData: owner.toObject(),
            additionalData: notification.additionalData || {}
          });
        }
      } catch (error) {
        console.error(`Error processing notification for ${notification.ownerId || notification.ownerEmail}:`, error);
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
    const result = await ownerNotificationService.sendBulkNotifications(
      processedNotifications,
      user._id.toString()
    );

    return NextResponse.json({
      success: true,
      message: result.message,
      results: result.results
    });

  } catch (error) {
    console.error('Error in bulk owner notifications API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}