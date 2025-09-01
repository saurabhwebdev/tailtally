import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import EmailSettings from '@/models/EmailSettings';
import { requireAuth } from '@/lib/auth-middleware';

// GET - Retrieve email settings for the authenticated user
export async function GET(request) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return NextResponse.json({ error: authResult.message }, { status: 401 });
        }

        await connectDB();

        const emailSettings = await EmailSettings.findByUserId(authResult.user._id);

        if (!emailSettings) {
            return NextResponse.json({
                emailSettings: null,
                message: 'No email settings found'
            });
        }

        // Return settings without sensitive data
        const safeSettings = {
            id: emailSettings._id,
            gmail: {
                email: emailSettings.gmail.email,
                displayName: emailSettings.gmail.displayName,
                maskedAppPassword: emailSettings.gmail.maskedAppPassword
            },
            settings: emailSettings.settings,
            createdAt: emailSettings.createdAt,
            updatedAt: emailSettings.updatedAt
        };

        return NextResponse.json({ emailSettings: safeSettings });
    } catch (error) {
        console.error('Error fetching email settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch email settings' },
            { status: 500 }
        );
    }
}

// POST - Create or update email settings
export async function POST(request) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return NextResponse.json({ error: authResult.message }, { status: 401 });
        }

        const body = await request.json();
        const { gmail, settings } = body;

        // Validate required fields
        if (!gmail?.email || !gmail?.appPassword) {
            return NextResponse.json(
                { error: 'Gmail email and app password are required' },
                { status: 400 }
            );
        }

        // Validate Gmail email format
        const gmailRegex = /^[^\s@]+@gmail\.com$/;
        if (!gmailRegex.test(gmail.email)) {
            return NextResponse.json(
                { error: 'Please provide a valid Gmail address' },
                { status: 400 }
            );
        }

        // Trim and validate app password format (16 characters)
        const trimmedAppPassword = gmail.appPassword.trim();
        if (trimmedAppPassword.length !== 16) {
            return NextResponse.json(
                { error: 'Gmail app password must be exactly 16 characters (spaces will be removed)' },
                { status: 400 }
            );
        }

        await connectDB();

        // Find existing settings or create new
        let emailSettings = await EmailSettings.findByUserId(authResult.user._id);

        if (emailSettings) {
            // Update existing settings
            emailSettings.gmail = {
                email: gmail.email.toLowerCase(),
                appPassword: trimmedAppPassword,
                displayName: gmail.displayName || ''
            };

            if (settings) {
                emailSettings.settings = {
                    ...emailSettings.settings,
                    ...settings
                };
            }

            await emailSettings.save();
        } else {
            // Create new settings
            emailSettings = new EmailSettings({
                userId: authResult.user._id,
                gmail: {
                    email: gmail.email.toLowerCase(),
                    appPassword: trimmedAppPassword,
                    displayName: gmail.displayName || ''
                },
                settings: {
                    isEnabled: settings?.isEnabled ?? true,
                    testEmailSent: false,
                    testEmailStatus: 'pending'
                }
            });

            await emailSettings.save();
        }

        // Return safe settings
        const safeSettings = {
            id: emailSettings._id,
            gmail: {
                email: emailSettings.gmail.email,
                displayName: emailSettings.gmail.displayName,
                maskedAppPassword: emailSettings.gmail.maskedAppPassword
            },
            settings: emailSettings.settings,
            createdAt: emailSettings.createdAt,
            updatedAt: emailSettings.updatedAt
        };

        return NextResponse.json({
            emailSettings: safeSettings,
            message: 'Email settings saved successfully'
        });
    } catch (error) {
        console.error('Error saving email settings:', error);
        return NextResponse.json(
            { error: 'Failed to save email settings' },
            { status: 500 }
        );
    }
}

// DELETE - Remove email settings
export async function DELETE(request) {
    try {
        const authResult = await requireAuth(request);
        if (!authResult.success) {
            return NextResponse.json({ error: authResult.message }, { status: 401 });
        }

        await connectDB();

        const emailSettings = await EmailSettings.findByUserId(authResult.user._id);

        if (!emailSettings) {
            return NextResponse.json(
                { error: 'Email settings not found' },
                { status: 404 }
            );
        }

        await EmailSettings.deleteOne({ userId: authResult.user._id });

        return NextResponse.json({
            message: 'Email settings deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting email settings:', error);
        return NextResponse.json(
            { error: 'Failed to delete email settings' },
            { status: 500 }
        );
    }
}