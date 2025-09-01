import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import notificationService from '@/lib/notification-service';

/**
 * GET /api/notifications/count
 * Get unread notification count and summary for the authenticated user
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

    // Get notifications summary
    const result = await notificationService.getNotificationsForUser(user._id, {
      limit: 0, // Don't return notifications, just metadata
      includeRead: false
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      unreadCount: result.unreadCount,
      summary: result.summary,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in notifications count API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
