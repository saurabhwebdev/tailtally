'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  PawPrint, 
  Stethoscope,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  Bell
} from 'lucide-react';

export function AppointmentHelp() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Appointment Management Help
        </h2>
        <p className="text-muted-foreground">
          Complete guide to scheduling and managing pet appointments
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment System Overview
              </CardTitle>
              <CardDescription>
                Comprehensive appointment management for your pet business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Key Features
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Schedule appointments for pets and owners</li>
                    <li>• Multiple appointment types (checkup, vaccination, surgery, etc.)</li>
                    <li>• Staff assignment and workload management</li>
                    <li>• Calendar view with drag-and-drop scheduling</li>
                    <li>• Automated reminders and notifications</li>
                    <li>• Status tracking from scheduled to completed</li>
                    <li>• Priority levels for urgent appointments</li>
                    <li>• Comprehensive reporting and analytics</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-blue-600" />
                    Appointment Types
                  </h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Stethoscope className="h-3 w-3" />
                      Checkup
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <PawPrint className="h-3 w-3" />
                      Vaccination
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <Stethoscope className="h-3 w-3" />
                      Surgery
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      <PawPrint className="h-3 w-3" />
                      Grooming
                    </Badge>
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                      <AlertTriangle className="h-3 w-3" />
                      Emergency
                    </Badge>
                  </div>
                </div>
              </div>

              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  The appointment system integrates seamlessly with pet profiles, owner information, 
                  and staff schedules to provide a complete scheduling solution.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Scheduling Appointments
              </CardTitle>
              <CardDescription>
                Step-by-step guide to creating new appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">1. Access Appointment Form</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "New Appointment" button from the appointments dashboard
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">2. Select Owner and Pet</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose the pet owner first, then select the specific pet for the appointment
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">3. Choose Appointment Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Select appointment type (checkup, vaccination, etc.)</li>
                    <li>• Set priority level (low, normal, high)</li>
                    <li>• Choose date and time slot</li>
                    <li>• Set duration (default 30 minutes)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">4. Assign Staff and Add Notes</h4>
                  <p className="text-sm text-muted-foreground">
                    Optionally assign a staff member and add any special notes or instructions
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">5. Save Appointment</h4>
                  <p className="text-sm text-muted-foreground">
                    Review details and save. The appointment will be created with "Scheduled" status
                  </p>
                </div>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Available time slots are from 9:00 AM to 6:00 PM in 30-minute intervals. 
                  You can adjust the duration as needed for different appointment types.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Managing Appointments
              </CardTitle>
              <CardDescription>
                Track and update appointment status throughout the process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Appointment Status Flow</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Scheduled</Badge>
                      <span className="text-sm">→ Initial status when created</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Confirmed</Badge>
                      <span className="text-sm">→ Owner confirms attendance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">In Progress</Badge>
                      <span className="text-sm">→ Appointment has started</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Completed</Badge>
                      <span className="text-sm">→ Service finished</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Cancelled</Badge>
                      <span className="text-sm">→ Appointment cancelled</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Available Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>View Details:</strong> See complete appointment information</li>
                    <li>• <strong>Edit:</strong> Modify appointment details</li>
                    <li>• <strong>Confirm:</strong> Change status from scheduled to confirmed</li>
                    <li>• <strong>Start:</strong> Begin the appointment (in-progress status)</li>
                    <li>• <strong>Complete:</strong> Finish appointment with notes</li>
                    <li>• <strong>Cancel:</strong> Cancel appointment if needed</li>
                    <li>• <strong>Send Reminder:</strong> Email/SMS reminder to owner</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  When completing an appointment, you'll be prompted to add completion notes 
                  that will be saved to the pet's medical history.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar View
              </CardTitle>
              <CardDescription>
                Visual scheduling and appointment overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Calendar Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Monthly view with appointment indicators</li>
                      <li>• Color-coded appointments by status</li>
                      <li>• Click dates to view daily appointments</li>
                      <li>• Navigate between months easily</li>
                      <li>• Today's date highlighted</li>
                      <li>• Appointment count per day</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Daily View</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Detailed appointment list for selected date</li>
                      <li>• Time-ordered appointment display</li>
                      <li>• Pet and owner information</li>
                      <li>• Appointment type and status</li>
                      <li>• Quick access to appointment details</li>
                      <li>• Schedule new appointments for the day</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Status Color Coding</h4>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-yellow-500"></div>
                      <span className="text-sm">Scheduled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-sm">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gray-500"></div>
                      <span className="text-sm">No Show</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications & Reminders
              </CardTitle>
              <CardDescription>
                Automated communication with pet owners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Appointment confirmation emails</li>
                    <li>• Reminder emails (24 hours before)</li>
                    <li>• Appointment completion notifications</li>
                    <li>• Cancellation notifications</li>
                    <li>• Rescheduling confirmations</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    SMS Reminders
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Text message reminders</li>
                    <li>• Appointment confirmations via SMS</li>
                    <li>• Last-minute changes notifications</li>
                    <li>• Emergency appointment alerts</li>
                    <li>• Follow-up care reminders</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Reminder Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium">Default Timing</h5>
                    <ul className="text-sm text-muted-foreground mt-1">
                      <li>• 24 hours before appointment</li>
                      <li>• 2 hours before (for same-day)</li>
                      <li>• Immediate confirmation</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium">Customization</h5>
                    <ul className="text-sm text-muted-foreground mt-1">
                      <li>• Adjust reminder timing</li>
                      <li>• Choose notification methods</li>
                      <li>• Custom message templates</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Notification settings can be configured in the Settings section. 
                  Ensure email and SMS services are properly configured for automated reminders.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>
                Track appointment metrics and business performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Available Reports</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Daily appointment schedule</li>
                    <li>• Weekly appointment summary</li>
                    <li>• Monthly performance metrics</li>
                    <li>• Staff workload analysis</li>
                    <li>• Appointment type distribution</li>
                    <li>• Cancellation rate analysis</li>
                    <li>• Revenue by appointment type</li>
                    <li>• Customer retention metrics</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium text-sm">Appointment Volume</div>
                      <div className="text-xs text-muted-foreground">Total appointments per period</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium text-sm">Completion Rate</div>
                      <div className="text-xs text-muted-foreground">% of appointments completed</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium text-sm">No-Show Rate</div>
                      <div className="text-xs text-muted-foreground">% of missed appointments</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="font-medium text-sm">Average Duration</div>
                      <div className="text-xs text-muted-foreground">Mean appointment length</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Analytics Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  The analytics tab provides visual charts and graphs showing:
                </p>
                <ul className="space-y-1 text-sm ml-4">
                  <li>• Appointment trends over time</li>
                  <li>• Status distribution pie charts</li>
                  <li>• Staff performance comparisons</li>
                  <li>• Peak appointment times</li>
                  <li>• Seasonal booking patterns</li>
                </ul>
              </div>

              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Reports can be exported to PDF or Excel format for external analysis 
                  or sharing with stakeholders.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}