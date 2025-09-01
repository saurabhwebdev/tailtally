'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Server, 
  User, 
  PawPrint, 
  UserCheck, 
  Shield, 
  BarChart3,
  Heart,
  Copy,
  CheckCircle,
  Globe,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BookOpen,
  Database,
  Zap,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

const API_ENDPOINTS = {
  auth: {
    title: "Authentication",
    icon: User,
    description: "User authentication and authorization endpoints",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/login",
        title: "User Login",
        description: "Authenticate user with email and password",
        auth: false,
        body: {
          email: "user@example.com",
          password: "password123"
        },
        response: {
          success: true,
          message: "Login successful",
          data: {
            user: {
              _id: "user_id",
              firstName: "John",
              lastName: "Doe",
              email: "user@example.com",
              role: "customer",
              permissions: ["read_pets"]
            },
            token: "jwt_token_here"
          }
        }
      },
      {
        method: "POST",
        path: "/api/auth/signup",
        title: "User Registration",
        description: "Create a new user account",
        auth: false,
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "user@example.com",
          password: "password123",
          role: "customer"
        }
      },
      {
        method: "GET",
        path: "/api/auth/me",
        title: "Get Current User",
        description: "Get current authenticated user information",
        auth: true,
        response: {
          success: true,
          data: {
            user: {
              _id: "user_id",
              firstName: "John",
              lastName: "Doe",
              email: "user@example.com",
              role: "customer"
            }
          }
        }
      },
      {
        method: "PUT",
        path: "/api/auth/profile",
        title: "Update Profile",
        description: "Update current user's profile information",
        auth: true,
        body: {
          firstName: "John",
          lastName: "Smith",
          phone: "+1234567890"
        }
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        title: "User Logout",
        description: "Logout and invalidate user session",
        auth: true
      }
    ]
  },
  pets: {
    title: "Pet Management",
    icon: PawPrint,
    description: "Manage pet profiles and information",
    endpoints: [
      {
        method: "GET",
        path: "/api/pets",
        title: "Get Pets",
        description: "Retrieve list of pets with pagination and filtering",
        auth: true,
        params: {
          page: "1",
          limit: "10",
          species: "dog",
          search: "buddy",
          owner: "owner_id"
        },
        response: {
          success: true,
          data: {
            pets: [
              {
                _id: "pet_id",
                name: "Buddy",
                species: "dog",
                breed: "Golden Retriever",
                age: 3,
                owner: {
                  firstName: "John",
                  lastName: "Doe"
                }
              }
            ],
            pagination: {
              current: 1,
              total: 5,
              count: 10,
              totalCount: 45
            }
          }
        }
      },
      {
        method: "POST",
        path: "/api/pets",
        title: "Create Pet",
        description: "Add a new pet profile",
        auth: true,
        permissions: ["write_pets"],
        body: {
          name: "Buddy",
          species: "dog",
          breed: "Golden Retriever",
          dateOfBirth: "2021-01-15",
          gender: "male",
          color: "golden",
          weight: 25.5,
          owner: "owner_id"
        }
      },
      {
        method: "GET",
        path: "/api/pets/[id]",
        title: "Get Pet by ID",
        description: "Retrieve a specific pet's information",
        auth: true
      },
      {
        method: "PUT",
        path: "/api/pets/[id]",
        title: "Update Pet",
        description: "Update pet information",
        auth: true,
        permissions: ["write_pets"]
      },
      {
        method: "DELETE",
        path: "/api/pets/[id]",
        title: "Delete Pet",
        description: "Remove a pet profile",
        auth: true,
        permissions: ["delete_pets"]
      },
      {
        method: "GET",
        path: "/api/pets/[id]/medical",
        title: "Get Medical Records",
        description: "Retrieve pet's medical history",
        auth: true,
        permissions: ["read_medical_records"]
      },
      {
        method: "POST",
        path: "/api/pets/[id]/medical",
        title: "Add Medical Record",
        description: "Add new medical record for pet",
        auth: true,
        permissions: ["write_medical_records"]
      },
      {
        method: "GET",
        path: "/api/pets/[id]/vaccinations",
        title: "Get Vaccinations",
        description: "Retrieve pet's vaccination records",
        auth: true
      },
      {
        method: "POST",
        path: "/api/pets/[id]/vaccinations",
        title: "Add Vaccination",
        description: "Record new vaccination for pet",
        auth: true,
        permissions: ["write_medical_records"]
      }
    ]
  },
  owners: {
    title: "Owner Management",
    icon: UserCheck,
    description: "Manage pet owner profiles and information",
    endpoints: [
      {
        method: "GET",
        path: "/api/owners",
        title: "Get Owners",
        description: "Retrieve list of pet owners",
        auth: true,
        params: {
          page: "1",
          limit: "10",
          search: "john",
          city: "New York"
        }
      },
      {
        method: "POST",
        path: "/api/owners",
        title: "Create Owner",
        description: "Add a new pet owner",
        auth: true,
        permissions: ["write_users"]
      },
      {
        method: "GET",
        path: "/api/owners/[id]",
        title: "Get Owner by ID",
        description: "Retrieve specific owner information",
        auth: true
      },
      {
        method: "PUT",
        path: "/api/owners/[id]",
        title: "Update Owner",
        description: "Update owner information",
        auth: true,
        permissions: ["write_users"]
      },
      {
        method: "DELETE",
        path: "/api/owners/[id]",
        title: "Delete Owner",
        description: "Remove owner profile",
        auth: true,
        permissions: ["delete_users"]
      }
    ]
  },
  users: {
    title: "User Management",
    icon: Shield,
    description: "Manage system users and permissions (Admin only)",
    endpoints: [
      {
        method: "GET",
        path: "/api/users",
        title: "Get Users",
        description: "Retrieve list of system users",
        auth: true,
        permissions: ["read_users"],
        adminOnly: true
      },
      {
        method: "POST",
        path: "/api/users",
        title: "Create User",
        description: "Create new system user",
        auth: true,
        permissions: ["write_users"],
        adminOnly: true
      },
      {
        method: "GET",
        path: "/api/users/[id]",
        title: "Get User by ID",
        description: "Retrieve specific user information",
        auth: true,
        permissions: ["read_users"],
        adminOnly: true
      },
      {
        method: "PUT",
        path: "/api/users/[id]",
        title: "Update User",
        description: "Update user information and permissions",
        auth: true,
        permissions: ["write_users"],
        adminOnly: true
      },
      {
        method: "DELETE",
        path: "/api/users/[id]",
        title: "Delete User",
        description: "Remove user from system",
        auth: true,
        permissions: ["delete_users"],
        adminOnly: true
      }
    ]
  },
  dashboard: {
    title: "Dashboard & Analytics",
    icon: BarChart3,
    description: "Dashboard statistics and analytics",
    endpoints: [
      {
        method: "GET",
        path: "/api/dashboard/stats",
        title: "Get Dashboard Stats",
        description: "Retrieve dashboard statistics and metrics",
        auth: true,
        response: {
          success: true,
          data: {
            totalPets: 245,
            recentPets: 12,
            petsWithUpcomingVaccinations: 8,
            totalCustomers: 156,
            petsBySpecies: {
              dog: 145,
              cat: 89,
              bird: 11
            },
            recentActivities: []
          }
        }
      }
    ]
  },
  inventory: {
    title: "Inventory Management",
    icon: Package,
    description: "Manage pet supplies, medication, and product inventory",
    endpoints: [
      {
        method: "GET",
        path: "/api/inventory",
        title: "Get Inventory Items",
        description: "Retrieve list of inventory items with filtering and pagination",
        auth: true,
        permissions: ["read_inventory"],
        params: {
          page: "1",
          limit: "20",
          category: "food",
          search: "dog food",
          lowStock: "true",
          expiringSoon: "true",
          petSpecies: "dog",
          sortBy: "name",
          sortOrder: "asc"
        },
        response: {
          success: true,
          data: {
            items: [
              {
                _id: "item_id",
                name: "Premium Dog Food",
                category: "food",
                price: 29.99,
                quantity: 15,
                minStockLevel: 5,
                sku: "FOO-ABC123",
                brand: "PetNutrition",
                petSpecies: ["dog"],
                isLowStock: false,
                currentPrice: 29.99
              }
            ],
            pagination: {
              current: 1,
              total: 3,
              count: 20,
              totalCount: 45,
              hasNextPage: true,
              hasPrevPage: false
            }
          }
        }
      },
      {
        method: "POST",
        path: "/api/inventory",
        title: "Create Inventory Item",
        description: "Add a new inventory item to the system",
        auth: true,
        permissions: ["write_inventory"],
        body: {
          name: "Premium Cat Food",
          description: "High-quality nutrition for adult cats",
          category: "food",
          price: 24.99,
          cost: 15.00,
          quantity: 50,
          minStockLevel: 10,
          brand: "FelineHealth",
          petSpecies: ["cat"],
          sku: "FOO-CAT001"
        }
      },
      {
        method: "GET",
        path: "/api/inventory/[id]",
        title: "Get Inventory Item",
        description: "Retrieve a specific inventory item by ID",
        auth: true,
        permissions: ["read_inventory"]
      },
      {
        method: "PUT",
        path: "/api/inventory/[id]",
        title: "Update Inventory Item",
        description: "Update inventory item information",
        auth: true,
        permissions: ["write_inventory"]
      },
      {
        method: "DELETE",
        path: "/api/inventory/[id]",
        title: "Delete Inventory Item",
        description: "Remove inventory item from system",
        auth: true,
        permissions: ["delete_inventory"]
      },
      {
        method: "POST",
        path: "/api/inventory/[id]/sell",
        title: "Sell Inventory Item",
        description: "Record a sale of inventory item to a pet/owner",
        auth: true,
        permissions: ["write_inventory"],
        body: {
          petId: "pet_id",
          ownerId: "owner_id",
          quantity: 2,
          notes: "Monthly supply for Buddy",
          invoiceNumber: "INV-2024-001"
        }
      },
      {
        method: "GET",
        path: "/api/inventory/gst",
        title: "Get GST Settings",
        description: "Retrieve GST configuration and statistics",
        auth: true,
        permissions: ["read_inventory"],
        params: {
          itemId: "item_id"
        },
        response: {
          success: true,
          data: {
            gstRateDistribution: [
              { _id: 18, count: 45, items: [] },
              { _id: 12, count: 23, items: [] }
            ],
            gstTypeDistribution: [
              { _id: "CGST_SGST", count: 68 },
              { _id: "IGST", count: 12 }
            ],
            defaultSettings: {
              gstRate: 18,
              gstType: "CGST_SGST",
              taxCategory: "GOODS",
              isGSTApplicable: true
            }
          }
        }
      },
      {
        method: "PUT",
        path: "/api/inventory/gst",
        title: "Update GST Settings",
        description: "Configure GST settings for inventory items",
        auth: true,
        permissions: ["write_inventory"],
        body: {
          itemIds: ["item_id_1", "item_id_2"],
          gstSettings: {
            isGSTApplicable: true,
            gstRate: 18,
            gstType: "CGST_SGST",
            taxCategory: "GOODS",
            hsnCode: "2309",
            sacCode: "",
            cessRate: 0,
            reverseCharge: false,
            placeOfSupply: {
              stateCode: "27",
              stateName: "Maharashtra"
            }
          },
          bulkUpdate: true
        },
        response: {
          success: true,
          message: "GST settings updated for 2 items",
          data: {
            modifiedCount: 2
          }
        }
      },
      {
        method: "POST",
        path: "/api/inventory/purchase",
        title: "Record Purchase",
        description: "Record inventory purchase by pet/owner with GST compliance",
        auth: true,
        permissions: ["write_inventory"],
        body: {
          items: [
            {
              itemId: "item_id",
              quantity: 2,
              notes: "Monthly supply"
            }
          ],
          petId: "pet_id",
          ownerId: "owner_id",
          paymentMethod: "cash",
          notes: "Regular monthly purchase",
          generateInvoice: true
        },
        response: {
          success: true,
          message: "Purchase recorded successfully - Invoice: INV-1234567890-ABC123",
          data: {
            invoiceNumber: "INV-1234567890-ABC123",
            pet: {
              id: "pet_id",
              name: "Buddy",
              species: "dog",
              breed: "Golden Retriever"
            },
            owner: {
              id: "owner_id",
              name: "John Doe",
              email: "john@example.com",
              phone: "+1234567890"
            },
            items: [
              {
                item: {
                  id: "item_id",
                  name: "Premium Dog Food",
                  sku: "FOO-DOG001",
                  category: "food"
                },
                quantity: 2,
                unitPrice: 29.99,
                basePrice: 25.42,
                gstAmount: 4.57,
                totalPrice: 59.98,
                gstBreakdown: {
                  cgst: 2.29,
                  sgst: 2.29,
                  igst: 0,
                  cess: 0
                }
              }
            ],
            summary: {
              totalItems: 2,
              subtotal: 50.84,
              totalGST: 9.14,
              totalAmount: 59.98,
              paymentMethod: "cash"
            },
            purchaseDate: "2024-01-15T10:30:00Z"
          }
        }
      },
      {
        method: "GET",
        path: "/api/inventory/purchase",
        title: "Get Purchase History",
        description: "Retrieve purchase history with filtering options",
        auth: true,
        permissions: ["read_inventory"],
        params: {
          petId: "pet_id",
          ownerId: "owner_id",
          itemId: "item_id",
          limit: "50",
          page: "1"
        },
        response: {
          success: true,
          data: {
            purchases: [
              {
                name: "Premium Dog Food",
                sku: "FOO-DOG001",
                category: "food",
                price: 29.99,
                purchaseDate: "2024-01-15T10:30:00Z",
                quantity: 2,
                notes: "Monthly supply",
                pet: {
                  name: "Buddy",
                  species: "dog"
                },
                owner: {
                  fullName: "John Doe",
                  email: "john@example.com"
                }
              }
            ],
            pagination: {
              currentPage: 1,
              totalPages: 3,
              totalCount: 45,
              hasNextPage: true,
              hasPrevPage: false
            }
          }
        }
      },
      {
        method: "GET",
        path: "/api/inventory/stats",
        title: "Get Inventory Statistics",
        description: "Retrieve inventory statistics and metrics",
        auth: true,
        permissions: ["read_inventory"],
        response: {
          success: true,
          data: {
            totalItems: 156,
            totalValue: 12450.00,
            lowStockItems: 8,
            expiringSoonItems: 3,
            categoriesBreakdown: {
              food: 45,
              medication: 23,
              toys: 18
            }
          }
        }
      }
    ]
  },
  system: {
    title: "System & Health",
    icon: Heart,
    description: "System health and maintenance endpoints",
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        title: "Health Check",
        description: "Check system and database health status",
        auth: false,
        response: {
          success: true,
          status: "healthy",
          connection: {
            state: "connected",
            environment: "local",
            database: "petdb"
          },
          timestamp: "2024-08-30T12:00:00.000Z"
        }
      },
      {
        method: "POST",
        path: "/api/seed/pets",
        title: "Seed Pet Data",
        description: "Populate database with sample pet data (Development/Admin only)",
        auth: true,
        permissions: ["manage_system"],
        adminOnly: true,
        response: {
          success: true,
          message: "Successfully seeded 50 pets",
          data: { count: 50 }
        }
      },
      {
        method: "POST",
        path: "/api/seed/owners",
        title: "Seed Owner Data",
        description: "Populate database with sample owner data (Development/Admin only)",
        auth: true,
        permissions: ["manage_system"],
        adminOnly: true,
        response: {
          success: true,
          message: "Successfully seeded 25 owners",
          data: { count: 25 }
        }
      }
    ]
  }
};

const METHOD_COLORS = {
  GET: "bg-green-100 text-green-800 border-green-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DELETE: "bg-red-100 text-red-800 border-red-200"
};

export default function ApiDocumentation({ defaultTab = 'overview' }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedText, setCopiedText] = useState('');
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when defaultTab prop changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(`${type}_copied`);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatJson = (obj) => JSON.stringify(obj, null, 2);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-muted-foreground">
              Complete reference for TailTally REST API endpoints
            </p>
          </div>
        </div>
        
        <Alert>
          <Globe className="h-4 w-4" />
          <AlertDescription>
            <strong>Base URL:</strong> <code className="bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="inventory-help">Inventory Help</TabsTrigger>
          <TabsTrigger value="pet-help">Pet Help</TabsTrigger>
          <TabsTrigger value="owner-help">Owner Help</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
              <CardDescription>
                TailTally provides a RESTful API for managing pet care operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(API_ENDPOINTS).map(([key, section]) => {
                  const Icon = section.icon;
                  return (
                    <Card key={key} className="border-l-4 border-l-primary">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {section.description}
                        </p>
                        <Badge variant="outline">
                          {section.endpoints.length} endpoint{section.endpoints.length !== 1 ? 's' : ''}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Most endpoints require authentication. Start by logging in to get a JWT token.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">POST /api/auth/login</code>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">2. Include Token</h4>
                <p className="text-sm text-muted-foreground">
                  Include the JWT token in the Authorization header for protected endpoints.
                </p>
                <div className="bg-muted p-3 rounded-md">
                  <code className="text-sm">Authorization: Bearer YOUR_JWT_TOKEN</code>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Make Requests</h4>
                <p className="text-sm text-muted-foreground">
                  All requests and responses are in JSON format.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          {Object.entries(API_ENDPOINTS).map(([sectionKey, section]) => (
            <Card key={sectionKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <section.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(sectionKey)}
                  >
                    {expandedSections[sectionKey] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              {expandedSections[sectionKey] && (
                <CardContent className="space-y-4">
                  {section.endpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={METHOD_COLORS[endpoint.method]}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                          <div className="flex items-center gap-2">
                            {endpoint.auth ? (
                              <Lock className="h-4 w-4 text-orange-500" title="Authentication required" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-500" title="Public endpoint" />
                            )}
                            {endpoint.adminOnly && (
                              <Shield className="h-4 w-4 text-red-500" title="Admin only" />
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${API_BASE_URL}${endpoint.path}`, `${sectionKey}_${index}`)}
                        >
                          {copiedText === `${sectionKey}_${index}_copied` ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{endpoint.title}</h4>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </div>

                      {endpoint.permissions && (
                        <div>
                          <p className="text-sm font-medium mb-1">Required Permissions:</p>
                          <div className="flex gap-2">
                            {endpoint.permissions.map((permission, pIndex) => (
                              <Badge key={pIndex} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {endpoint.params && (
                        <div>
                          <p className="text-sm font-medium mb-2">Query Parameters:</p>
                          <div className="bg-muted p-3 rounded-md">
                            <pre className="text-xs">
                              {formatJson(endpoint.params)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {endpoint.body && (
                        <div>
                          <p className="text-sm font-medium mb-2">Request Body:</p>
                          <div className="bg-muted p-3 rounded-md">
                            <pre className="text-xs">
                              {formatJson(endpoint.body)}
                            </pre>
                          </div>
                        </div>
                      )}

                      {endpoint.response && (
                        <div>
                          <p className="text-sm font-medium mb-2">Response Example:</p>
                          <div className="bg-muted p-3 rounded-md">
                            <pre className="text-xs">
                              {formatJson(endpoint.response)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Overview</CardTitle>
              <CardDescription>
                TailTally uses JWT (JSON Web Tokens) for authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Authentication Flow</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Send login credentials to <code>/api/auth/login</code></li>
                    <li>Receive JWT token in response</li>
                    <li>Include token in Authorization header for protected endpoints</li>
                    <li>Token is automatically included in HTTP-only cookies</li>
                  </ol>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">User Roles & Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">Customer</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• View own pets</li>
                        <li>• Update own profile</li>
                        <li>• Limited dashboard access</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Staff</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Manage pets and owners</li>
                        <li>• View appointments</li>
                        <li>• Access reports</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Veterinarian</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full pet management</li>
                        <li>• Medical records access</li>
                        <li>• Appointment management</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Admin</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full system access</li>
                        <li>• User management</li>
                        <li>• System configuration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Error Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Standard Error Response</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <pre className="text-xs">
{formatJson({
  success: false,
  message: "Error description",
  error: "Detailed error information"
})}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">HTTP Status Codes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mono">200</span>
                        <span className="text-sm">Success</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">201</span>
                        <span className="text-sm">Created</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">400</span>
                        <span className="text-sm">Bad Request</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-mono">401</span>
                        <span className="text-sm">Unauthorized</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">403</span>
                        <span className="text-sm">Forbidden</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono">500</span>
                        <span className="text-sm">Server Error</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pet Help Tab */}
        <TabsContent value="pet-help" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <PawPrint className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Pet Management Help</CardTitle>
                  <CardDescription>
                    Complete guide to managing pets in TailTally
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started with Pet Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      The Pet Management module allows you to create, view, edit, and manage all pet profiles in the system. 
                      Each pet must be associated with an owner and can include detailed information about medical history, 
                      vaccinations, and photos.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li><strong>Adding a Pet:</strong> Click "Add Pet" button to create a new pet profile</li>
                      <li><strong>Owner Association:</strong> Select an existing owner or create a new one</li>
                      <li><strong>Pet Details:</strong> Fill in species, breed, age, color, weight, and other details</li>
                      <li><strong>Medical Records:</strong> Add vaccination history and medical notes</li>
                      <li><strong>Photos:</strong> Upload pet photos for identification</li>
                    </ol>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Pet Data Structure
                  </h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-xs">
{formatJson({
  name: "Buddy",
  species: "dog",
  breed: "Golden Retriever",
  age: 3,
  color: "golden",
  weight: 25.5,
  gender: "male",
  neutered: true,
  owner: "owner_id",
  ownerInfo: {
    name: "John Smith",
    email: "john@example.com",
    phone: "+1234567890"
  },
  medicalHistory: [],
  vaccinations: [],
  photos: []
})}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Search and Filtering</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Search:</strong> Use the search bar to find pets by name, owner name, or breed</p>
                    <p><strong>Species Filter:</strong> Filter pets by species (dog, cat, bird, fish, etc.)</p>
                    <p><strong>Owner Filter:</strong> Staff can filter pets by specific owners</p>
                    <p><strong>Pagination:</strong> Navigate through multiple pages of pet records</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Role-Based Access</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium text-green-700">Customer</h5>
                      <ul className="text-sm space-y-1">
                        <li>• View own pets only</li>
                        <li>• Add new pets to own account</li>
                        <li>• Update own pet information</li>
                        <li>• View medical records</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium text-blue-700">Staff/Veterinarian</h5>
                      <ul className="text-sm space-y-1">
                        <li>• View all pets in system</li>
                        <li>• Create pets for any owner</li>
                        <li>• Edit all pet information</li>
                        <li>• Manage medical records</li>
                        <li>• Delete pets (veterinarians only)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Common Operations</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Adding Medical Records</h5>
                      <p className="text-sm text-muted-foreground">
                        Click on a pet's "View Details" to access the medical history section. 
                        Add new records with date, type (checkup, treatment, surgery, etc.), 
                        description, and veterinarian notes.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Managing Vaccinations</h5>
                      <p className="text-sm text-muted-foreground">
                        Track vaccination history and set reminder dates for upcoming shots. 
                        The system will highlight pets with upcoming vaccination needs.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Photo Management</h5>
                      <p className="text-sm text-muted-foreground">
                        Upload multiple photos for each pet. Photos help with identification 
                        and provide visual records for medical documentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Help Tab */}
        <TabsContent value="inventory-help" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Inventory Management Help</CardTitle>
                  <CardDescription>
                    Complete guide to managing inventory, supplies, and products in TailTally
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started with Inventory Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      The Inventory Management module allows you to track pet supplies, medication, 
                      food, toys, and other products. Manage stock levels, pricing, sales, and 
                      vendor information all in one place.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li><strong>Adding Items:</strong> Click "Add Item" to create new inventory records</li>
                      <li><strong>Categories:</strong> Organize items by type (food, medication, toys, etc.)</li>
                      <li><strong>Stock Management:</strong> Set minimum/maximum stock levels for alerts</li>
                      <li><strong>Pricing:</strong> Track cost, retail price, and sale pricing</li>
                      <li><strong>Sales Processing:</strong> Sell items directly to pets/owners</li>
                      <li><strong>Reporting:</strong> Monitor inventory levels and sales performance</li>
                    </ol>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Inventory Data Structure
                  </h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-xs">
{formatJson({
  name: "Premium Dog Food",
  description: "High-quality nutrition for adult dogs",
  category: "food",
  subcategory: "dry food",
  price: 29.99,
  cost: 18.50,
  quantity: 25,
  minStockLevel: 5,
  maxStockLevel: 100,
  sku: "FOO-DOG001",
  brand: "PetNutrition",
  petSpecies: ["dog"],
  ageGroup: "adult",
  size: "medium",
  isPerishable: true,
  expirationDate: "2025-06-15",
  supplier: {
    name: "Pet Supply Co",
    contactInfo: {
      email: "orders@petsupply.com",
      phone: "(555) 123-4567"
    }
  }
})}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Product Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <h5 className="font-medium">Food & Nutrition</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Dry food</li>
                        <li>• Wet food</li>
                        <li>• Treats</li>
                        <li>• Supplements</li>
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-medium">Healthcare</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Medications</li>
                        <li>• Vitamins</li>
                        <li>• First aid</li>
                        <li>• Dental care</li>
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-medium">Supplies</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Toys</li>
                        <li>• Grooming tools</li>
                        <li>• Accessories</li>
                        <li>• Cleaning products</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Inventory Operations</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Stock Management</h5>
                      <p className="text-sm text-muted-foreground">
                        Monitor stock levels with automatic low-stock alerts. Set minimum and 
                        maximum stock levels to maintain optimal inventory. Track stock movements 
                        including purchases, sales, adjustments, and damaged items.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Sales Processing</h5>
                      <p className="text-sm text-muted-foreground">
                        Sell inventory items directly to customers through the "Sell Item" action. 
                        Select the pet/owner, specify quantity, and add sale notes. The system 
                        automatically updates stock levels and tracks sales history.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Expiration Tracking</h5>
                      <p className="text-sm text-muted-foreground">
                        Track expiration dates for perishable items like food and medications. 
                        The system highlights items expiring within 30 days and provides 
                        "Expiring Soon" alerts to prevent waste and ensure safety.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Search and Filtering</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Search:</strong> Find items by name, SKU, brand, or description</p>
                    <p><strong>Category Filter:</strong> Filter by product category (food, medication, toys, etc.)</p>
                    <p><strong>Pet Species Filter:</strong> Show items suitable for specific species</p>
                    <p><strong>Stock Status:</strong> View all items, low stock items, or expiring items</p>
                    <p><strong>Sorting:</strong> Sort by name, price, quantity, or other fields</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Best Practices</h4>
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <div>
                        <h5 className="font-medium">✅ Recommended Practices</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Set appropriate minimum stock levels to avoid stockouts</li>
                          <li>• Use descriptive names and SKUs for easy identification</li>
                          <li>• Track expiration dates for all perishable items</li>
                          <li>• Regularly review and update pricing information</li>
                          <li>• Use the pet species filter to ensure compatibility</li>
                          <li>• Maintain accurate supplier contact information</li>
                        </ul>
                      </div>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <h5 className="font-medium">⚠️ Common Pitfalls</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Don't ignore low stock alerts - maintain adequate inventory</li>
                          <li>• Avoid selling expired or near-expired items</li>
                          <li>• Don't forget to verify pet species compatibility before sales</li>
                          <li>• Remember to update stock after receiving shipments</li>
                          <li>• Check prescription requirements for medications</li>
                        </ul>
                      </div>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Owner Help Tab */}
        <TabsContent value="owner-help" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Owner Management Help</CardTitle>
                  <CardDescription>
                    Complete guide to managing pet owners in TailTally
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Getting Started with Owner Management
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      The Owner Management module handles all pet owner information, contact details, 
                      preferences, and relationship tracking with their pets. Owners can have multiple pets 
                      and comprehensive profiles.
                    </p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li><strong>Adding an Owner:</strong> Create new owner profiles with contact information</li>
                      <li><strong>Contact Management:</strong> Store primary and alternate phone numbers, email, and address</li>
                      <li><strong>Emergency Contacts:</strong> Maintain emergency contact information</li>
                      <li><strong>Preferences:</strong> Track communication preferences and appointment settings</li>
                      <li><strong>Financial Tracking:</strong> Monitor total visits and spending history</li>
                    </ol>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Owner Data Structure
                  </h4>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-xs">
{formatJson({
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "(555) 123-4567",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001"
  },
  emergencyContact: {
    name: "Jane Smith",
    relationship: "Spouse",
    phone: "(555) 123-4568"
  },
  preferences: {
    communicationMethod: "email",
    appointmentReminders: true,
    vaccinationReminders: true
  },
  source: "walk_in",
  tags: ["premium", "regular"],
  totalVisits: 5,
  totalSpent: 1250.00
})}
                    </pre>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Search and Filtering</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Search:</strong> Find owners by name, email, phone, or city</p>
                    <p><strong>City Filter:</strong> Filter owners by their city location</p>
                    <p><strong>Source Filter:</strong> Filter by how the owner was acquired (walk-in, referral, online, etc.)</p>
                    <p><strong>Tag System:</strong> Use tags to categorize owners (premium, regular, VIP, etc.)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Help Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Pet-Owner Integration Guide</CardTitle>
                  <CardDescription>
                    Understanding the relationship between pets and owners in TailTally
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Database Relationship
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      TailTally uses a robust relationship model where each pet is linked to an owner 
                      through a MongoDB ObjectId reference. This ensures data consistency and enables 
                      efficient queries.
                    </p>
                    <div className="bg-muted p-4 rounded-md">
                      <pre className="text-xs">
{`Pet Schema:
{
  owner: ObjectId -> Owner._id
  ownerInfo: {
    name: String (cached for performance)
    email: String (cached for performance)
    phone: String (cached for performance)
  }
}

Owner Schema:
{
  _id: ObjectId
  petsCount: Virtual (calculated)
  activePetsCount: Virtual (calculated)
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Data Synchronization</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Owner Information Caching</h5>
                      <p className="text-sm text-muted-foreground">
                        Pet records cache owner information (name, email, phone) for performance. 
                        This cached data is automatically updated when owner information changes.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h5 className="font-medium mb-1">Pet Count Calculations</h5>
                      <p className="text-sm text-muted-foreground">
                        Owner records show total pet counts and active pet counts using MongoDB virtuals. 
                        These are calculated in real-time from the Pet collection.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">UI Integration Features</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-medium">Pet Management UI</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Shows owner name and contact in pet list</li>
                          <li>• Owner selection dropdown for staff</li>
                          <li>• Auto-fills owner info for customers</li>
                          <li>• Quick owner contact access</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium">Owner Management UI</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Displays pet count for each owner</li>
                          <li>• Links to owner's pets from detail view</li>
                          <li>• Shows total pets in stats cards</li>
                          <li>• Pet ownership history tracking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Best Practices</h4>
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <div>
                        <h5 className="font-medium">✅ Recommended Practices</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Always create owners before adding pets</li>
                          <li>• Use the owner selection dropdown for staff</li>
                          <li>• Verify owner information before saving pets</li>
                          <li>• Update owner contact info to sync to all pets</li>
                        </ul>
                      </div>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <div>
                        <h5 className="font-medium">⚠️ Common Pitfalls</h5>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>• Don't delete owners with active pets</li>
                          <li>• Avoid duplicate owner creation</li>
                          <li>• Don't modify owner ObjectId references directly</li>
                          <li>• Remember to handle owner-pet cascading deletes</li>
                        </ul>
                      </div>
                    </Alert>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}