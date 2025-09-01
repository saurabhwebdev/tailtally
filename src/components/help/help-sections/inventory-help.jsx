'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ShoppingCart,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export function InventoryHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
        <TabsTrigger value="gst">GST Setup</TabsTrigger>
        <TabsTrigger value="purchasing">Purchasing</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Inventory Management Overview
            </CardTitle>
            <CardDescription>
              Complete inventory management system for pet businesses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Key Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Product catalog management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Stock level tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GST compliance automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Purchase order management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Sales tracking and reporting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Low stock alerts
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Pet-Specific Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Species-specific categorization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Age group targeting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Size-based inventory
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Expiration date tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Prescription requirements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Pet usage history
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The inventory system is designed specifically for pet businesses, with features tailored to manage pet food, medications, toys, and accessories efficiently.
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
              <Package className="h-5 w-5" />
              Inventory Management
            </CardTitle>
            <CardDescription>
              How to add, edit, and manage your inventory items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Adding New Items</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "Add Item" to create new inventory entries. Fill in basic information like name, category, price, and stock quantity.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><Badge variant="outline">Name</Badge> Product name</div>
                    <div><Badge variant="outline">Category</Badge> Product type</div>
                    <div><Badge variant="outline">Price</Badge> Selling price</div>
                    <div><Badge variant="outline">Stock</Badge> Current quantity</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Pet-Specific Configuration</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure pet-specific attributes like species compatibility, age groups, and size requirements.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><Badge variant="outline">Species</Badge> Dog, Cat, Bird, etc.</div>
                    <div><Badge variant="outline">Age Group</Badge> Puppy, Adult, Senior</div>
                    <div><Badge variant="outline">Size</Badge> Small, Medium, Large</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Stock Management</h4>
                  <p className="text-sm text-muted-foreground">
                    Set minimum and maximum stock levels to receive automatic alerts when inventory runs low.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Bulk Operations</h4>
                  <p className="text-sm text-muted-foreground">
                    Use checkboxes to select multiple items for bulk operations like GST configuration, price updates, or category changes.
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Use the search and filter options to quickly find specific items in large inventories.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* GST Tab */}
      <TabsContent value="gst" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              GST Configuration
            </CardTitle>
            <CardDescription>
              Setting up GST compliance for your inventory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">GST Setup Process</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">1. Select Items</h5>
                    <p className="text-sm text-muted-foreground">
                      Choose items using checkboxes or individual item actions to configure GST settings.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">2. Configure Rates</h5>
                    <p className="text-sm text-muted-foreground">
                      Set appropriate GST rates (0%, 5%, 12%, 18%, 28%) based on product category.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">3. Add HSN/SAC Codes</h5>
                    <p className="text-sm text-muted-foreground">
                      Enter HSN codes for goods or SAC codes for services as required by GST law.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">4. Set Place of Supply</h5>
                    <p className="text-sm text-muted-foreground">
                      Configure business location to determine CGST+SGST vs IGST application.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Common Pet Product GST Rates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Pet Food</span>
                      <Badge>18%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Pet Medicines</span>
                      <Badge>12%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Pet Toys</span>
                      <Badge>18%</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Grooming Services</span>
                      <Badge>18%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Veterinary Services</span>
                      <Badge>18%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Pet Accessories</span>
                      <Badge>18%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Always verify current GST rates with official sources as rates may change based on government notifications.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Purchasing Tab */}
      <TabsContent value="purchasing" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase Management
            </CardTitle>
            <CardDescription>
              Recording customer purchases and managing sales transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Purchase Recording Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Select Customer</h5>
                      <p className="text-sm text-muted-foreground">
                        Choose between Owner-only purchase or Pet+Owner purchase. Search existing customers or add new ones.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Configure Items</h5>
                      <p className="text-sm text-muted-foreground">
                        Set quantities, add special notes, and review pricing with GST breakdown.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Payment & Invoice</h5>
                      <p className="text-sm text-muted-foreground">
                        Select payment method, generate GST-compliant invoice, and complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Purchase Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Customer Integration</h5>
                    <p className="text-sm text-muted-foreground">
                      Link purchases to specific pets and owners for complete purchase history tracking.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">GST Compliance</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatic GST calculation and compliant invoice generation with all required details.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Stock Updates</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatic inventory reduction and stock movement tracking for all sales.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Payment Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Support for multiple payment methods with complete transaction records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Sales Tab */}
      <TabsContent value="sales" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Tracking
            </CardTitle>
            <CardDescription>
              Monitor sales performance and customer purchase patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Sales Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Revenue Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Monitor daily, weekly, and monthly sales revenue with GST breakdown.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Product Performance</h5>
                    <p className="text-sm text-muted-foreground">
                      Track which products sell best and identify slow-moving inventory.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Customer Insights</h5>
                    <p className="text-sm text-muted-foreground">
                      Analyze customer purchase patterns and spending behavior.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Profit Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Calculate profit margins and identify most profitable products.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Sales Reports</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Daily sales summary with GST details
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Product-wise sales performance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customer purchase history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Pet-specific purchase tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GST collection reports
                  </li>
                </ul>
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
              <BarChart3 className="h-5 w-5" />
              Inventory Reports
            </CardTitle>
            <CardDescription>
              Comprehensive reporting and analytics for inventory management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Available Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Stock Level Report</h5>
                    <p className="text-sm text-muted-foreground">
                      Current stock levels, low stock alerts, and reorder recommendations.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Sales Performance</h5>
                    <p className="text-sm text-muted-foreground">
                      Product sales analysis, revenue trends, and profit margins.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">GST Summary</h5>
                    <p className="text-sm text-muted-foreground">
                      GST collection summary, rate-wise breakdown, and compliance status.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Expiry Tracking</h5>
                    <p className="text-sm text-muted-foreground">
                      Products nearing expiry, expired items, and disposal tracking.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Purchase History</h5>
                    <p className="text-sm text-muted-foreground">
                      Customer purchase patterns, pet-specific buying behavior.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Supplier Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Supplier performance, cost analysis, and procurement insights.
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
                    Export to PDF, Excel, and CSV formats
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customizable date ranges and filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automated report scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Visual charts and graphs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Email report delivery
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Reports are generated in real-time based on current data and can be customized based on your specific business needs.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}