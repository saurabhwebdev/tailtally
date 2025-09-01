'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Code, 
  Key, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  BookOpen,
  Database,
  Globe
} from 'lucide-react';

export function APIHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="authentication">Authentication</TabsTrigger>
        <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        <TabsTrigger value="examples">Examples</TabsTrigger>
        <TabsTrigger value="errors">Error Handling</TabsTrigger>
        <TabsTrigger value="sdks">SDKs & Tools</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              TailTally API Overview
            </CardTitle>
            <CardDescription>
              RESTful API for integrating with TailTally pet business management system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">API Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    RESTful architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    JSON request/response format
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    JWT-based authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Rate limiting and throttling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Comprehensive error handling
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Available Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Inventory management
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Pet records and profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Owner/customer management
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Sales and transactions
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Invoice generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    User management
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The TailTally API follows REST conventions and returns JSON responses. All endpoints require authentication unless otherwise specified.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">Base URL</h4>
              <div className="p-3 bg-muted rounded font-mono text-sm">
                https://your-domain.com/api
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Authentication Tab */}
      <TabsContent value="authentication" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication
            </CardTitle>
            <CardDescription>
              Securing API access with JWT tokens and role-based permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Authentication Flow</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Login Request</h5>
                      <p className="text-sm text-muted-foreground">
                        Send POST request to /api/auth/login with email and password
                      </p>
                      <div className="p-3 bg-muted rounded font-mono text-sm">
                        POST /api/auth/login<br/>
                        {`{
  "email": "user@example.com",
  "password": "your-password"
}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Receive Token</h5>
                      <p className="text-sm text-muted-foreground">
                        Server responds with JWT token and user information
                      </p>
                      <div className="p-3 bg-muted rounded font-mono text-sm">
                        {`{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "admin"
  }
}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Use Token</h5>
                      <p className="text-sm text-muted-foreground">
                        Include token in Authorization header for all API requests
                      </p>
                      <div className="p-3 bg-muted rounded font-mono text-sm">
                        Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">User Roles and Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Admin
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Full system access</li>
                      <li>• User management</li>
                      <li>• System configuration</li>
                      <li>• All CRUD operations</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Staff
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Inventory management</li>
                      <li>• Customer operations</li>
                      <li>• Sales processing</li>
                      <li>• Report generation</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Veterinarian
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pet medical records</li>
                      <li>• Health data access</li>
                      <li>• Prescription management</li>
                      <li>• Medical reporting</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Customer
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Own pet records (read-only)</li>
                      <li>• Purchase history</li>
                      <li>• Appointment booking</li>
                      <li>• Profile management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Keep your JWT tokens secure and never expose them in client-side code. Tokens expire after 24 hours and need to be refreshed.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Endpoints Tab */}
      <TabsContent value="endpoints" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              API Endpoints
            </CardTitle>
            <CardDescription>
              Complete list of available API endpoints and their usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Inventory Management</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm">/api/inventory</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all inventory items with pagination and filtering</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm">/api/inventory</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Create a new inventory item</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm">/api/inventory/{`{id}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get specific inventory item by ID</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">PUT</Badge>
                      <code className="text-sm">/api/inventory/{`{id}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update inventory item</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">DELETE</Badge>
                      <code className="text-sm">/api/inventory/{`{id}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Delete inventory item</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Pet Management</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm">/api/pets</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all pets with owner information</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm">/api/pets</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Register a new pet</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">PUT</Badge>
                      <code className="text-sm">/api/pets/{`{id}`}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update pet information</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Sales & Invoicing</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm">/api/sales</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Record a new sale transaction</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm">/api/invoices</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get all invoices with filtering options</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">POST</Badge>
                      <code className="text-sm">/api/invoices/{`{id}`}/payment</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Record payment for an invoice</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">GST Management</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">GET</Badge>
                      <code className="text-sm">/api/inventory/gst</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Get GST configuration and statistics</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">PUT</Badge>
                      <code className="text-sm">/api/inventory/gst</code>
                    </div>
                    <p className="text-sm text-muted-foreground">Update GST settings for inventory items</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All endpoints support query parameters for filtering, sorting, and pagination. Check individual endpoint documentation for specific parameters.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Examples Tab */}
      <TabsContent value="examples" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Examples
            </CardTitle>
            <CardDescription>
              Practical examples of API usage in different programming languages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">JavaScript/Node.js Example</h4>
                <div className="p-4 bg-muted rounded">
                  <pre className="text-sm overflow-x-auto">
{`// Login and get token
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const { token } = await loginResponse.json();

// Get inventory items
const inventoryResponse = await fetch('/api/inventory', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});

const inventory = await inventoryResponse.json();
console.log(inventory.data);`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Python Example</h4>
                <div className="p-4 bg-muted rounded">
                  <pre className="text-sm overflow-x-auto">
{`import requests

# Login and get token
login_data = {
    "email": "user@example.com",
    "password": "password"
}

response = requests.post('/api/auth/login', json=login_data)
token = response.json()['token']

# Get inventory items
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

inventory_response = requests.get('/api/inventory', headers=headers)
inventory_data = inventory_response.json()

print(inventory_data['data'])`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">cURL Example</h4>
                <div className="p-4 bg-muted rounded">
                  <pre className="text-sm overflow-x-auto">
{`# Login
curl -X POST /api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password"}'

# Get inventory (replace TOKEN with actual token)
curl -X GET /api/inventory \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json"

# Create new inventory item
curl -X POST /api/inventory \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Premium Dog Food",
    "category": "food",
    "price": 1500,
    "quantity": 50,
    "gst": {
      "gstRate": 18,
      "hsnCode": "2309"
    }
  }'`}
                  </pre>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Replace the base URL and credentials with your actual TailTally instance details when implementing these examples.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Error Handling Tab */}
      <TabsContent value="errors" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Error Handling
            </CardTitle>
            <CardDescription>
              Understanding API error responses and how to handle them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">HTTP Status Codes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">200</Badge>
                      <span className="font-medium">Success</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Request completed successfully</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">201</Badge>
                      <span className="font-medium">Created</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Resource created successfully</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">400</Badge>
                      <span className="font-medium">Bad Request</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Invalid request data or parameters</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">401</Badge>
                      <span className="font-medium">Unauthorized</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Authentication required or invalid</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">403</Badge>
                      <span className="font-medium">Forbidden</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Insufficient permissions</p>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-red-50 text-red-700">404</Badge>
                      <span className="font-medium">Not Found</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Resource not found</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Error Response Format</h4>
                <div className="p-4 bg-muted rounded">
                  <pre className="text-sm">
{`{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Product name is required",
    "Price must be a positive number"
  ],
  "code": "VALIDATION_ERROR"
}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Common Error Scenarios</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Authentication Errors</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Missing or invalid JWT token
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Expired token (refresh required)
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Insufficient role permissions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Error Handling Best Practices</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Always check HTTP status codes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Parse error messages for user feedback
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Implement retry logic for temporary failures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Log errors for debugging and monitoring
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* SDKs Tab */}
      <TabsContent value="sdks" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              SDKs & Development Tools
            </CardTitle>
            <CardDescription>
              Tools and libraries to accelerate TailTally API integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Official SDKs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">JavaScript SDK</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Full-featured SDK for Node.js and browser applications
                    </p>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      npm install @tailtally/sdk
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Python SDK</h5>
                    <p className="text-sm text-muted-foreground mb-2">
                      Python library with async support and type hints
                    </p>
                    <div className="p-2 bg-muted rounded font-mono text-xs">
                      pip install tailtally-python
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Development Tools</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Postman Collection</h5>
                    <p className="text-sm text-muted-foreground">
                      Pre-configured API requests for testing and development
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">OpenAPI Specification</h5>
                    <p className="text-sm text-muted-foreground">
                      Complete API specification for code generation
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Webhook Testing</h5>
                    <p className="text-sm text-muted-foreground">
                      Tools for testing webhook integrations locally
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">API Explorer</h5>
                    <p className="text-sm text-muted-foreground">
                      Interactive API documentation and testing interface
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Community Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GitHub repository with examples and issues
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Developer forum for questions and discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Video tutorials and integration guides
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Sample applications and starter templates
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                SDKs are regularly updated to match API changes. Always use the latest version for best compatibility and features.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}