import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import notificationService from '@/lib/notification-service';

/**
 * GET /api/notifications
 * Get notifications for the authenticated user
 */
export async function GET(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = parseInt(searchParams.get('skip')) || 0;
    const includeRead = searchParams.get('includeRead') !== 'false';
    const category = searchParams.get('category') || null;
    const priority = searchParams.get('priority') || null;

    // Get notifications
    const result = await notificationService.getNotificationsForUser(user._id, {
      limit,
      skip,
      includeRead,
      category,
      priority
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: result.notifications,
      unreadCount: result.unreadCount,
      summary: result.summary,
      pagination: {
        limit,
        skip,
        total: result.total,
        hasMore: result.total === limit
      }
    });

  } catch (error) {
    console.error('Error in notifications GET API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification (admin/staff only)
 */
export async function POST(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { user } = authResult;
    
    // Check permissions - only staff/admin/veterinarian can create notifications
    if (!['staff', 'admin', 'veterinarian'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      message,
      type,
      category,
      userId: targetUserId,
      priority,
      relatedData,
      actionUrl,
      actionLabel,
      scheduledFor
    } = body;

    // Validate required fields
    if (!title || !message || !type || !category || !targetUserId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, message, type, category, userId' },
        { status: 400 }
      );
    }

    // Create notification
    const result = await notificationService.createNotification({
      title,
      message,
      type,
      category,
      userId: targetUserId,
      priority,
      relatedData,
      actionUrl,
      actionLabel,
      scheduledFor,
      createdBy: user._id
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: result.notification,
      message: result.message
    }, { status: 201 });

  } catch (error) {
    console.error('Error in notifications POST API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const body = await request.json();
    const { notificationIds, markAllAsRead } = body;

    let result;
    
    if (markAllAsRead) {
      // Mark all notifications as read
      result = await notificationService.markAllAsRead(user._id);
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      result = await notificationService.markAsRead(notificationIds, user._id);
    } else {
      return NextResponse.json(
        { success: false, error: 'Either notificationIds array or markAllAsRead flag is required' },
        { status: 400 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: result.message
    });

  } catch (error) {
    console.error('Error in notifications PATCH API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Delete a notification
 */
export async function DELETE(request) {
  try {
    // Authenticate user
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Delete notification
    const result = await notificationService.deleteNotification(notificationId, user._id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error === 'Notification not found' ? 404 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error in notifications DELETE API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
