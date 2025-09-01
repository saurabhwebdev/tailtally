'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Globe, 
  Settings,
  Key,
  Send,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Users,
  Shield,
  Link,
  MessageSquare,
  Bell,
  Zap,
  HelpCircle,
  ExternalLink,
  Copy,
  BookOpen,
  FileText,
  Lock
} from 'lucide-react';

export function SettingsHelp() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Settings className="h-12 w-12 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">System Settings Guide</h2>
        <p className="text-muted-foreground">
          Complete guide to configuring email integration and public booking system
        </p>
      </div>

      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="booking">Public Booking</TabsTrigger>
        </TabsList>

        {/* Email Configuration Help */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Integration Setup
              </CardTitle>
              <CardDescription>
                Configure Gmail integration for sending system emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overview */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Quick Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  The email integration allows your system to send automated emails for:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Appointment confirmations and reminders</li>
                  <li>Low stock alerts and notifications</li>
                  <li>Invoice delivery to customers</li>
                  <li>System notifications and alerts</li>
                  <li>Public booking confirmations</li>
                </ul>
              </div>

              {/* Setup Steps */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-500" />
                  Setup Steps
                </h3>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-4 space-y-3">
                    <div>
                      <h4 className="font-medium">Step 1: Enable 2-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Go to your Google Account settings and enable 2-factor authentication.
                        This is required to generate app passwords.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Step 2: Generate App Password</h4>
                      <p className="text-sm text-muted-foreground">
                        Visit <a 
                          href="https://myaccount.google.com/apppasswords" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          Google App Passwords
                          <ExternalLink className="h-3 w-3" />
                        </a> and generate a new app password for "Mail".
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Step 3: Configure in Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Enter your Gmail address and the 16-character app password in the email settings.
                        Optionally set a display name for your emails.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Step 4: Test Configuration</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the "Send Test Email" feature to verify your configuration is working correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Note:</strong> App passwords are stored securely and encrypted. 
                  Never share your app password with anyone. Each app password can be revoked from 
                  your Google Account settings at any time.
                </AlertDescription>
              </Alert>

              {/* Common Issues */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  Troubleshooting
                </h3>
                <div className="space-y-2">
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">Email sending fails</h4>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Verify the app password is correct (16 characters, no spaces)</li>
                      <li>• Ensure 2-factor authentication is enabled</li>
                      <li>• Check that the email address is a valid Gmail account</li>
                      <li>• Try generating a new app password</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">Test email not received</h4>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Check spam/junk folder</li>
                      <li>• Verify recipient email address</li>
                      <li>• Wait a few minutes for delivery</li>
                      <li>• Check Gmail sending limits (500 emails/day)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Email Features & Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex gap-3">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Automatic Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      System automatically sends emails for important events like appointment bookings,
                      low stock alerts, and invoice generation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Custom Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Emails use professional HTML templates with your business information
                      and branding automatically included.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Delivery Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor email delivery status and get notified if any emails fail to send.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Booking Help */}
        <TabsContent value="booking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Public Booking System
              </CardTitle>
              <CardDescription>
                Allow customers to book appointments online without logging in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overview */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  System Overview
                </h3>
                <p className="text-sm text-muted-foreground">
                  The public booking system provides a customer-facing appointment booking interface that:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>Works without requiring customer login</li>
                  <li>Automatically creates owner and pet records</li>
                  <li>Validates availability in real-time</li>
                  <li>Sends confirmation emails automatically</li>
                  <li>Integrates seamlessly with your appointment system</li>
                </ul>
              </div>

              {/* Configuration Guide */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Settings className="h-4 w-4 text-blue-500" />
                  Configuration Options
                </h3>
                <div className="space-y-3">
                  <div className="grid gap-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">General Settings</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">Title</Badge>
                          <span>Customize the booking page title</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">Description</Badge>
                          <span>Set a welcome message for customers</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="mt-0.5">Confirmation</Badge>
                          <span>Custom message shown after booking</span>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Booking Rules</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5" />
                          <div>
                            <strong>Advance Booking:</strong> Set minimum hours and maximum days for advance booking
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 mt-0.5" />
                          <div>
                            <strong>Daily Limits:</strong> Control maximum bookings per day
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5" />
                          <div>
                            <strong>Auto-Confirm:</strong> Choose manual review or automatic confirmation
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Services Configuration</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Configure which services are available for public booking:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>General Checkup (30 min)</li>
                          <li>Vaccination (20 min)</li>
                          <li>Grooming (60 min)</li>
                          <li>Consultation (30 min)</li>
                        </ul>
                        <p className="italic">Enable/disable services and set durations as needed</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Working Hours</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Set available days and time slots:</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Enable/disable specific weekdays</li>
                          <li>Configure time slots (e.g., 9:00, 9:30, 10:00)</li>
                          <li>Block specific dates for holidays</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sharing the Booking URL */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Link className="h-4 w-4 text-purple-500" />
                  Sharing Your Booking Page
                </h3>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <p className="text-sm font-medium">Public Booking URL</p>
                      <code className="block text-xs bg-background px-3 py-2 rounded border">
                        https://yourdomain.com/book-appointment
                      </code>
                      <p className="text-sm text-muted-foreground">
                        Share this URL on your website, social media, or business cards.
                        Customers can access it directly without needing an account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security:</strong> Public bookings are validated against your availability 
                  and business rules. Spam protection and rate limiting are automatically applied.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Booking Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Customer Journey</h3>
                <div className="border-l-2 border-green-500 pl-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>1</Badge>
                      Customer visits booking page
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      No login required - accessible to everyone
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>2</Badge>
                      Fills out booking form
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Owner info, pet details, service selection, date/time
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>3</Badge>
                      System validates availability
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Checks conflicts, working hours, and booking limits
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>4</Badge>
                      Booking confirmed or pending
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on auto-confirm setting
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>5</Badge>
                      Email confirmation sent
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      If email integration is configured
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Badge>6</Badge>
                      Appears in appointments
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Staff can manage like any other appointment
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips & Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Optimization Tips
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Set realistic advance booking limits (e.g., 24-48 hours minimum)</li>
                  <li>• Keep service descriptions clear and concise</li>
                  <li>• Update blocked dates for holidays in advance</li>
                  <li>• Test the booking flow regularly as a customer would</li>
                  <li>• Monitor booking patterns to optimize time slots</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Security Recommendations
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  <li>• Review bookings regularly if auto-confirm is disabled</li>
                  <li>• Set appropriate daily booking limits</li>
                  <li>• Keep confirmation messages professional</li>
                  <li>• Enable email confirmation for verification</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
