import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { requireAuth } from '@/lib/auth-middleware';
// Removed hasPermission import as it doesn't exist
import inventoryNotificationService from '@/lib/inventory-notification-service';
import Inventory from '@/models/Inventory';

/**
 * POST /api/inventory/notifications
 * Send individual inventory notification
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

    // Check if user has permission to send notifications (staff only)
    if (user.role !== 'staff' && user.role !== 'admin' && user.role !== 'veterinarian') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. Only staff can send notifications.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, itemId, itemData, additionalData = {} } = body;

    // Validate required fields
    if (!type || !itemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, itemId' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = ['low_stock', 'expiry_alert', 'stock_update', 'general'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid notification type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the inventory item
    const item = await Inventory.findById(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    // Send notification based on type
    let result;
    switch (type) {
      case 'lowStock':
      case 'low_stock':
        result = await inventoryNotificationService.sendLowStockAlert(
          itemData || item,
          user._id
        );
        break;
      case 'expiry_alert':
        result = await inventoryNotificationService.sendExpiryAlert(
          itemData || item,
          user._id
        );
        break;
      case 'stock_update':
        result = await inventoryNotificationService.sendStockUpdate(
          itemData || item,
          user._id
        );
        break;
      case 'general':
        result = await inventoryNotificationService.sendGeneralNotification(
          itemData || item,
          user._id
        );
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown notification type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.skipped ? 'Notification skipped' : 'Notification sent successfully',
        skipped: result.skipped || false,
        reason: result.reason || null
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in inventory notifications API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/inventory/notifications
 * Send bulk inventory notifications
 */
export async function PUT(request) {
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

    // Check if user has permission to send notifications (staff only)
    if (user.role !== 'staff' && user.role !== 'admin' && user.role !== 'veterinarian') {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions. Only staff can send bulk notifications.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, itemIds, recipientEmail, additionalData = {} } = body;

    // Validate required fields
    if (!type || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0 || !recipientEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, itemIds (array), recipientEmail' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = ['low_stock', 'expiry_alert', 'stock_update', 'general'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid notification type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the inventory items
    const items = await Inventory.find({ _id: { $in: itemIds } });
    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No inventory items found' },
        { status: 404 }
      );
    }

    // Send bulk notifications
    const result = await inventoryNotificationService.sendBulkNotifications(
      user._id,
      items,
      recipientEmail,
      type,
      additionalData
    );

    return NextResponse.json({
      success: true,
      message: 'Bulk notifications processed',
      results: {
        sent: result.sent,
        skipped: result.skipped,
        failed: result.failed,
        total: items.length
      },
      errors: result.errors.length > 0 ? result.errors : null
    });

  } catch (error) {
    console.error('Error in bulk inventory notifications API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}