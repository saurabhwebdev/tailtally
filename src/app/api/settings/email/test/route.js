import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailSettings from '@/models/EmailSettings';
import emailService from '@/lib/email-service';
import { requireAuth } from '@/lib/auth-middleware';

// POST - Send test email
export async function POST(request) {
  try {
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      console.error('Auth failed:', authResult.message);
      return NextResponse.json({ error: authResult.message }, { status: 401 });
    }

    console.log('Test email request from user:', authResult.user._id);

    const body = await request.json();
    const { recipientEmail } = body;

    console.log('Recipient email:', recipientEmail);

    // Validate recipient email
    if (!recipientEmail) {
      console.error('No recipient email provided');
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      console.error('Invalid recipient email format:', recipientEmail);
      return NextResponse.json(
        { error: 'Please provide a valid recipient email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user's email settings
    const emailSettings = await EmailSettings.findByUserId(authResult.user._id);
    console.log('Email settings found:', !!emailSettings);
    
    if (!emailSettings) {
      console.error('No email settings found for user:', authResult.user._id);
      return NextResponse.json(
        { error: 'Email settings not found. Please configure your email settings first.' },
        { status: 404 }
      );
    }

    console.log('Email settings enabled:', emailSettings.settings.isEnabled);
    if (!emailSettings.settings.isEnabled) {
      console.error('Email is disabled for user:', authResult.user._id);
      return NextResponse.json(
        { error: 'Email is disabled. Please enable email in settings first.' },
        { status: 400 }
      );
    }

    console.log('Testing email connection...');
    // Test email configuration first
    const connectionTest = await emailService.testConnection(emailSettings.gmail);
    console.log('Connection test result:', connectionTest);
    
    if (!connectionTest.success) {
      // Update settings with failed status
      emailSettings.settings.testEmailStatus = 'failed';
      emailSettings.settings.testEmailError = connectionTest.message;
      emailSettings.settings.lastTestDate = new Date();
      
      try {
        await emailSettings.save();
      } catch (saveError) {
        console.error('Error saving email settings after connection test:', saveError);
      }

      return NextResponse.json(
        { error: connectionTest.message },
        { status: 400 }
      );
    }

    // Send test email
    const testResult = await emailService.sendTestEmail(
      emailSettings.gmail, 
      recipientEmail
    );

    // Update settings with test result
    emailSettings.settings.testEmailSent = testResult.success;
    emailSettings.settings.testEmailStatus = testResult.success ? 'success' : 'failed';
    emailSettings.settings.testEmailError = testResult.success ? null : testResult.message;
    emailSettings.settings.lastTestDate = new Date();
    
    try {
      await emailSettings.save();
    } catch (saveError) {
      console.error('Error saving email settings after test:', saveError);
      // Don't fail the test if email was sent successfully but save failed
      if (testResult.success) {
        console.log('Email sent successfully despite save error');
        // If it's a validation error, suggest resetting email settings
        if (saveError.name === 'ValidationError') {
          console.log('Validation error detected - user may need to reset email settings');
        }
      }
    }

    if (testResult.success) {
      return NextResponse.json({
        message: 'Test email sent successfully!',
        messageId: testResult.messageId,
        recipientEmail
      });
    } else {
      return NextResponse.json(
        { error: testResult.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}