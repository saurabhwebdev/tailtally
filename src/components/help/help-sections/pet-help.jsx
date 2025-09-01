'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PawPrint, 
  Heart, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Camera,
  Stethoscope,
  Shield
} from 'lucide-react';

export function PetHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="registration">Registration</TabsTrigger>
        <TabsTrigger value="medical">Medical Records</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="tracking">Tracking</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5" />
              Pet Management Overview
            </CardTitle>
            <CardDescription>
              Comprehensive pet care and management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Core Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Pet registration and profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Medical history tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Vaccination schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Appointment management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Photo galleries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Owner relationship tracking
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Behavioral notes and tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Dietary requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Emergency contact information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Insurance details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Microchip information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Purchase history integration
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The pet management system is designed to maintain comprehensive records for each pet, ensuring continuity of care and easy access to important information.
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
              <PawPrint className="h-5 w-5" />
              Pet Registration
            </CardTitle>
            <CardDescription>
              How to register new pets and manage their profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Basic Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Start by entering the pet's basic details including name, species, breed, age, and gender.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><Badge variant="outline">Name</Badge> Pet's name</div>
                    <div><Badge variant="outline">Species</Badge> Dog, Cat, Bird, etc.</div>
                    <div><Badge variant="outline">Breed</Badge> Specific breed</div>
                    <div><Badge variant="outline">Age</Badge> Current age</div>
                    <div><Badge variant="outline">Gender</Badge> Male/Female</div>
                    <div><Badge variant="outline">Color</Badge> Primary color</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Owner Association</h4>
                  <p className="text-sm text-muted-foreground">
                    Link the pet to an existing owner or create a new owner profile. Multiple pets can be associated with the same owner.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Physical Characteristics</h4>
                  <p className="text-sm text-muted-foreground">
                    Record physical details like weight, height, distinctive markings, and any special characteristics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Photos and Documentation</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload photos of the pet and any relevant documents like registration papers or previous medical records.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Required vs Optional Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600">Required Fields</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Pet name</li>
                    <li>• Species</li>
                    <li>• Owner information</li>
                    <li>• Basic contact details</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-green-600">Optional Fields</h5>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Breed details</li>
                    <li>• Physical measurements</li>
                    <li>• Photos and documents</li>
                    <li>• Behavioral notes</li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Complete profiles help provide better care and make it easier to track the pet's health and history over time.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Medical Records Tab */}
      <TabsContent value="medical" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Medical Records Management
            </CardTitle>
            <CardDescription>
              Maintaining comprehensive medical histories and health records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Medical History Components</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Vaccinations
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Track vaccination history, due dates, and maintain vaccination schedules.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Health Conditions
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Record ongoing health conditions, allergies, and chronic issues.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Treatment History
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Document all treatments, procedures, and medical interventions.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Medication Schedule
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      Manage current medications, dosages, and administration schedules.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Vaccination Management</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Common Pet Vaccinations</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <h6 className="font-medium">Dogs</h6>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)</li>
                          <li>• Rabies</li>
                          <li>• Bordetella (Kennel Cough)</li>
                          <li>• Lyme Disease</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h6 className="font-medium">Cats</h6>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)</li>
                          <li>• Rabies</li>
                          <li>• FeLV (Feline Leukemia)</li>
                          <li>• FIV (Feline Immunodeficiency Virus)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Medical Record Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automatic vaccination reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Medical document storage
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Treatment timeline tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Veterinarian notes and recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Emergency medical information
                  </li>
                </ul>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Always consult with a qualified veterinarian for medical decisions. This system is for record-keeping purposes only.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Appointments Tab */}
      <TabsContent value="appointments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Management
            </CardTitle>
            <CardDescription>
              Scheduling and managing pet appointments and visits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Appointment Types</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Routine Check-ups</h5>
                    <p className="text-sm text-muted-foreground">
                      Regular health examinations and wellness visits.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Vaccinations</h5>
                    <p className="text-sm text-muted-foreground">
                      Scheduled vaccination appointments and boosters.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Emergency Visits</h5>
                    <p className="text-sm text-muted-foreground">
                      Urgent medical care and emergency treatments.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Grooming Services</h5>
                    <p className="text-sm text-muted-foreground">
                      Professional grooming and hygiene services.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Appointment Scheduling Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Select Pet and Service</h5>
                      <p className="text-sm text-muted-foreground">
                        Choose the pet and type of service or appointment needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Choose Date and Time</h5>
                      <p className="text-sm text-muted-foreground">
                        Select available appointment slots based on service provider availability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Add Notes and Requirements</h5>
                      <p className="text-sm text-muted-foreground">
                        Include any special instructions, concerns, or preparation requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Confirm and Notify</h5>
                      <p className="text-sm text-muted-foreground">
                        Confirm the appointment and send notifications to relevant parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Appointment Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automated reminder notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Calendar integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Recurring appointment scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Appointment history tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    No-show and cancellation tracking
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tracking Tab */}
      <TabsContent value="tracking" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Pet Tracking and Monitoring
            </CardTitle>
            <CardDescription>
              Comprehensive tracking of pet activities, behavior, and development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Tracking Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Growth Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Monitor weight, height, and physical development over time.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Behavioral Notes</h5>
                    <p className="text-sm text-muted-foreground">
                      Record behavioral changes, training progress, and temperament.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Activity Levels</h5>
                    <p className="text-sm text-muted-foreground">
                      Track exercise routines, play time, and activity preferences.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Dietary Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Monitor food preferences, dietary restrictions, and feeding schedules.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Photo and Media Management</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Photo Gallery Features</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Upload and organize pet photos by date
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Tag photos with events and milestones
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Create photo timelines showing growth
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Share photos with pet owners
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Purchase and Service History</h4>
                <p className="text-sm text-muted-foreground">
                  Track all purchases, services, and interactions related to each pet, providing a complete history of care and spending.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Product Purchases</h5>
                    <p className="text-sm text-muted-foreground">
                      Food, toys, medications, and accessories purchased for the pet.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Service History</h5>
                    <p className="text-sm text-muted-foreground">
                      Grooming, training, boarding, and other services received.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reports Tab */}
      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pet Reports and Analytics
            </CardTitle>
            <CardDescription>
              Generate comprehensive reports and insights about pet care and management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Available Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Health Summary</h5>
                    <p className="text-sm text-muted-foreground">
                      Complete health overview including vaccinations, treatments, and medical history.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Growth Chart</h5>
                    <p className="text-sm text-muted-foreground">
                      Visual representation of pet's growth and development over time.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Vaccination Schedule</h5>
                    <p className="text-sm text-muted-foreground">
                      Upcoming and overdue vaccinations with reminder notifications.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Care Timeline</h5>
                    <p className="text-sm text-muted-foreground">
                      Chronological view of all care activities, appointments, and treatments.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Spending Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Breakdown of expenses for food, medical care, and services.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Behavioral Trends</h5>
                    <p className="text-sm text-muted-foreground">
                      Analysis of behavioral patterns and training progress.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Report Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Export to PDF for sharing with veterinarians
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Email reports directly to pet owners
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customizable date ranges and filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Visual charts and graphs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automated report scheduling
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Reports can be customized based on specific needs and shared with pet owners to keep them informed about their pet's care and progress.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}