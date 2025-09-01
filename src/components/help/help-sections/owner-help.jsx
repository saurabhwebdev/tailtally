'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCheck, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  CreditCard,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';

export function OwnerHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="registration">Registration</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
        <TabsTrigger value="communication">Communication</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Owner Management Overview
            </CardTitle>
            <CardDescription>
              Comprehensive customer relationship management for pet owners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Core Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Owner profile management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Contact information tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Pet ownership relationships
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Communication history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Billing and payment tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Service preferences
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Emergency contact management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Insurance information tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Purchase history analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Loyalty program integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automated reminders and notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customer satisfaction tracking
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The owner management system helps build strong customer relationships by maintaining comprehensive records and enabling personalized service delivery.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Registration Tab */}
      <TabsContent value="registration" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Owner Registration
            </CardTitle>
            <CardDescription>
              How to register new pet owners and create customer profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Basic Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by collecting essential contact information including name, phone number, and email address.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><Badge variant="outline">First Name</Badge> Required</div>
                    <div><Badge variant="outline">Last Name</Badge> Required</div>
                    <div><Badge variant="outline">Email</Badge> Required</div>
                    <div><Badge variant="outline">Phone</Badge> Required</div>
                    <div><Badge variant="outline">Address</Badge> Optional</div>
                    <div><Badge variant="outline">City</Badge> Optional</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Contact Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    Set communication preferences including preferred contact method, best times to call, and notification settings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Emergency Contacts</h4>
                  <p className="text-sm text-muted-foreground">
                    Add emergency contact information for situations when the primary owner cannot be reached.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Account Linking</h4>
                  <p className="text-sm text-muted-foreground">
                    Optionally link the owner profile to a user account for online access and self-service features.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Data Validation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-green-600">Automatic Checks</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Email format validation</li>
                    <li>• Phone number format checking</li>
                    <li>• Duplicate contact detection</li>
                    <li>• Required field validation</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-blue-600">Data Quality</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Address standardization</li>
                    <li>• Contact information verification</li>
                    <li>• Duplicate record prevention</li>
                    <li>• Data completeness scoring</li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Complete owner profiles enable better customer service and help build stronger relationships with pet owners.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Management Tab */}
      <TabsContent value="management" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Owner Profile Management
            </CardTitle>
            <CardDescription>
              Managing and updating owner information and relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Profile Management Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Updates
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Update phone numbers, email addresses, and physical addresses as they change.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address Management
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Maintain current and historical addresses for delivery and service purposes.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Communication Preferences
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Set preferences for email, SMS, phone calls, and notification timing.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes and Tags
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Add custom notes, tags, and categories for better customer segmentation.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Pet Relationship Management</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Multi-Pet Households</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Link multiple pets to a single owner
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Track individual pet preferences and needs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Manage separate medical records for each pet
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Consolidated billing for all pets
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Search and Filtering</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Quick Search</h5>
                    <p className="text-sm text-muted-foreground">
                      Search by name, phone, email, or pet name for quick access to owner records.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Advanced Filters</h5>
                    <p className="text-sm text-muted-foreground">
                      Filter by location, pet species, service history, or custom tags.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Regular profile updates ensure accurate communication and help maintain strong customer relationships.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Communication Tab */}
      <TabsContent value="communication" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Customer Communication
            </CardTitle>
            <CardDescription>
              Managing communication with pet owners and maintaining interaction history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Communication Channels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Email Communication</h5>
                    <p className="text-sm text-muted-foreground">
                      Send appointment reminders, health updates, and promotional messages via email.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">SMS Notifications</h5>
                    <p className="text-sm text-muted-foreground">
                      Quick notifications for appointment confirmations and urgent updates.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Phone Calls</h5>
                    <p className="text-sm text-muted-foreground">
                      Direct phone communication with call logging and follow-up tracking.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">In-Person Visits</h5>
                    <p className="text-sm text-muted-foreground">
                      Record face-to-face interactions and visit summaries.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Automated Communications</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Automated Reminders</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Appointment reminders (24 hours and 2 hours before)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Vaccination due date notifications
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Annual check-up reminders
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Birthday greetings for pets
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Follow-up messages after visits
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Communication History</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Interaction Logging</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatic logging of all communications with timestamps and content.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Response Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Track response rates and engagement levels for different communication types.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Consistent communication helps build trust and ensures pet owners stay informed about their pet's care and health.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Billing Tab */}
      <TabsContent value="billing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing and Payment Management
            </CardTitle>
            <CardDescription>
              Managing customer billing, payments, and financial relationships
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Billing Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Invoice Generation</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatic GST-compliant invoice generation for all services and products.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Payment Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Track payments across multiple methods including cash, card, and digital payments.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Outstanding Balances</h5>
                    <p className="text-sm text-muted-foreground">
                      Monitor unpaid invoices and send automated payment reminders.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Payment Plans</h5>
                    <p className="text-sm text-muted-foreground">
                      Set up installment plans for expensive treatments or procedures.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Financial Analytics</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Customer Value Metrics</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Total customer lifetime value
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Average transaction value
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Purchase frequency analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Seasonal spending patterns
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Service preference trends
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 border rounded text-center">
                    <h5 className="font-medium mb-2">Cash Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      Traditional cash transactions with receipt generation.
                    </p>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <h5 className="font-medium mb-2">Card Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      Credit and debit card processing with secure handling.
                    </p>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <h5 className="font-medium mb-2">Digital Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      UPI, mobile wallets, and online payment integration.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Ensure all payment processing complies with PCI DSS standards and local financial regulations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reports Tab */}
      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Owner Reports and Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive reporting and insights about customer relationships and business performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Customer Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Customer Directory</h5>
                    <p className="text-sm text-muted-foreground">
                      Complete list of all customers with contact information and pet details.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Customer Activity</h5>
                    <p className="text-sm text-muted-foreground">
                      Recent customer interactions, appointments, and service history.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Spending Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Customer spending patterns, top customers, and revenue analysis.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Communication Log</h5>
                    <p className="text-sm text-muted-foreground">
                      History of all communications with customers across all channels.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Customer Satisfaction</h5>
                    <p className="text-sm text-muted-foreground">
                      Feedback scores, reviews, and satisfaction metrics.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Retention Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Customer retention rates, churn analysis, and loyalty metrics.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Business Intelligence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Customer Segmentation</h5>
                    <p className="text-sm text-muted-foreground">
                      Group customers by spending, frequency, pet type, and service preferences.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Trend Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Identify trends in customer behavior, seasonal patterns, and growth opportunities.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Geographic Distribution</h5>
                    <p className="text-sm text-muted-foreground">
                      Map customer locations to identify service areas and expansion opportunities.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Service Utilization</h5>
                    <p className="text-sm text-muted-foreground">
                      Analyze which services are most popular and identify cross-selling opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Export and Sharing</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Export customer data to Excel or CSV formats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Generate PDF reports for stakeholders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Schedule automated report delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Create custom dashboards for different user roles
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Regular analysis of customer data helps improve service quality and identify opportunities for business growth.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}