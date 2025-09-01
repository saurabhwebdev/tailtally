import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PublicBookingSettings from '@/models/PublicBookingSettings';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/settings/public-booking - Get public booking settings
export async function GET(request) {
  try {
    await connectDB();
    
    // Check if request is from authenticated user or public
    const authHeader = request.headers.get('authorization');
    const isAuthenticated = !!authHeader;
    
    // Get settings
    const settings = await PublicBookingSettings.getSettings();
    
    // If public request, only send enabled status and basic info
    if (!isAuthenticated) {
      if (!settings.enabled) {
        return NextResponse.json({
          success: false,
          message: 'Public booking is not available'
        }, { status: 403 });
      }
      
      return NextResponse.json({
        success: true,
        data: {
          enabled: settings.enabled,
          title: settings.title,
          description: settings.description,
          availableServices: settings.availableServices.filter(s => s.enabled),
          workingDays: settings.workingDays,
          requiredFields: settings.requiredFields,
          maxAdvanceBookingDays: settings.maxAdvanceBookingDays,
          minAdvanceBookingHours: settings.minAdvanceBookingHours,
          confirmationMessage: settings.confirmationMessage,
          termsAndConditions: settings.termsAndConditions,
          blockedDates: settings.blockedDates
        }
      });
    }
    
    // For authenticated users, check permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    // Return full settings for authenticated users
    return NextResponse.json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    console.error('Get public booking settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/settings/public-booking - Update public booking settings
export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication and permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_SETTINGS]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to manage settings' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Get existing settings or create new
    let settings = await PublicBookingSettings.findOne();
    if (!settings) {
      settings = new PublicBookingSettings(body);
    } else {
      // Update settings
      Object.keys(body).forEach(key => {
        if (body[key] !== undefined) {
          settings[key] = body[key];
        }
      });
    }
    
    // Save settings
    await settings.save();
    
    return NextResponse.json({
      success: true,
      message: 'Public booking settings updated successfully',
      data: settings
    });
    
  } catch (error) {
    console.error('Update public booking settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/settings/public-booking - Toggle public booking status
export async function PUT(request) {
  try {
    await connectDB();
    
    // Check authentication and permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_SETTINGS]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to manage settings' },
        { status: 403 }
      );
    }
    
    const { enabled } = await request.json();
    
    // Get settings
    const settings = await PublicBookingSettings.getSettings();
    settings.enabled = enabled;
    await settings.save();
    
    return NextResponse.json({
      success: true,
      message: `Public booking ${enabled ? 'enabled' : 'disabled'} successfully`,
      data: { enabled: settings.enabled }
    });
    
  } catch (error) {
    console.error('Toggle public booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to toggle public booking', error: error.message },
      { status: 500 }
    );
  }
}
