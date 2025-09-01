'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  TrendingUp, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  CreditCard,
  BarChart3,
  Users,
  Package
} from 'lucide-react';

export function SalesHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="recording">Recording Sales</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="integration">Integration</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Sales Management Overview
            </CardTitle>
            <CardDescription>
              Comprehensive sales tracking and management system for pet businesses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Core Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Complete sales transaction recording
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customer and pet association
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GST-compliant invoicing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Multiple payment methods
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Inventory integration
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Real-time analytics
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Sales performance tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Customer purchase history
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Product performance analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Profit margin calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Sales forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Commission tracking
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The sales system is fully integrated with inventory management, customer records, and GST compliance to provide a complete business solution.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Recording Sales Tab */}
      <TabsContent value="recording" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recording Sales Transactions
            </CardTitle>
            <CardDescription>
              Step-by-step guide to recording sales and processing payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Select Products/Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose the items or services being sold. The system will automatically pull pricing and GST information from inventory.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><Badge variant="outline">Products</Badge> Physical items</div>
                    <div><Badge variant="outline">Services</Badge> Grooming, training, etc.</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Customer Selection</h4>
                  <p className="text-sm text-muted-foreground">
                    Associate the sale with a customer and optionally with specific pets. This helps track purchase history and preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Quantity and Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    Set quantities, apply discounts if needed, and review the total with GST breakdown.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Payment Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Select payment method, process payment, and generate receipt/invoice.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Payment Methods Supported</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 border rounded text-center">
                  <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h5 className="font-medium mb-1">Cash</h5>
                  <p className="text-xs text-muted-foreground">Traditional cash payments</p>
                </div>
                <div className="p-3 border rounded text-center">
                  <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h5 className="font-medium mb-1">Card</h5>
                  <p className="text-xs text-muted-foreground">Credit/Debit cards</p>
                </div>
                <div className="p-3 border rounded text-center">
                  <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h5 className="font-medium mb-1">Digital</h5>
                  <p className="text-xs text-muted-foreground">UPI, wallets, online</p>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All sales automatically update inventory levels and generate GST-compliant invoices.
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
              <FileText className="h-5 w-5" />
              Sales Management
            </CardTitle>
            <CardDescription>
              Managing sales records, returns, and customer interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Sales Record Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">View Sales History</h5>
                    <p className="text-sm text-muted-foreground">
                      Access complete sales history with search and filter options by date, customer, or product.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Edit Sales Records</h5>
                    <p className="text-sm text-muted-foreground">
                      Modify sales records for corrections, with full audit trail maintained.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Process Returns</h5>
                    <p className="text-sm text-muted-foreground">
                      Handle product returns and refunds with inventory adjustments.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Void Transactions</h5>
                    <p className="text-sm text-muted-foreground">
                      Cancel transactions with proper authorization and documentation.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Customer Interaction Tracking</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Purchase History Features</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Complete purchase timeline for each customer
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Pet-specific purchase tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Spending pattern analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Loyalty program integration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Personalized recommendations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Bulk Operations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Batch Processing</h5>
                    <p className="text-sm text-muted-foreground">
                      Process multiple sales transactions simultaneously for efficiency.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Export Data</h5>
                    <p className="text-sm text-muted-foreground">
                      Export sales data for accounting, tax filing, or analysis purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Analytics
            </CardTitle>
            <CardDescription>
              Comprehensive analytics and insights for sales performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Key Performance Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Revenue Metrics
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Daily, weekly, monthly revenue</li>
                      <li>• Year-over-year growth</li>
                      <li>• Revenue per customer</li>
                      <li>• Average transaction value</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Performance
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Best-selling products</li>
                      <li>• Profit margin analysis</li>
                      <li>• Inventory turnover</li>
                      <li>• Seasonal trends</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Customer Analytics
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Customer acquisition rate</li>
                      <li>• Customer lifetime value</li>
                      <li>• Repeat purchase rate</li>
                      <li>• Customer segmentation</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Financial Analysis
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Gross profit margins</li>
                      <li>• GST collection summary</li>
                      <li>• Payment method breakdown</li>
                      <li>• Cost of goods sold</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Visual Analytics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Charts and Graphs</h5>
                    <p className="text-sm text-muted-foreground">
                      Interactive charts showing sales trends, product performance, and customer behavior.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Dashboard Views</h5>
                    <p className="text-sm text-muted-foreground">
                      Customizable dashboards with real-time metrics and key performance indicators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Analytics are updated in real-time and can be filtered by date ranges, product categories, or customer segments.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Integration Tab */}
      <TabsContent value="integration" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              System Integration
            </CardTitle>
            <CardDescription>
              How sales integrates with other TailTally modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Module Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Inventory Integration</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Automatic stock level updates</li>
                      <li>• Real-time pricing synchronization</li>
                      <li>• Low stock alerts</li>
                      <li>• Product availability checking</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Customer Management</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Purchase history tracking</li>
                      <li>• Customer preference analysis</li>
                      <li>• Loyalty program updates</li>
                      <li>• Communication triggers</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Pet Records</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Pet-specific purchase tracking</li>
                      <li>• Health product recommendations</li>
                      <li>• Age-appropriate product suggestions</li>
                      <li>• Dietary requirement matching</li>
                    </ul>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Financial Management</h5>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• GST calculation and reporting</li>
                      <li>• Invoice generation</li>
                      <li>• Payment tracking</li>
                      <li>• Accounting system sync</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Data Flow</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h5 className="font-semibold mb-3">Sales Transaction Flow</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Sale recorded → Inventory updated → Customer history updated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>GST calculated → Invoice generated → Payment processed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Analytics updated → Reports refreshed → Notifications sent</span>
                    </div>
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
              Sales Reports
            </CardTitle>
            <CardDescription>
              Comprehensive reporting for sales analysis and business insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Standard Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Daily Sales Summary</h5>
                    <p className="text-sm text-muted-foreground">
                      Complete daily sales breakdown with totals, GST, and payment methods.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Product Sales Report</h5>
                    <p className="text-sm text-muted-foreground">
                      Product-wise sales performance with quantities and revenue.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Customer Sales Report</h5>
                    <p className="text-sm text-muted-foreground">
                      Customer purchase history and spending analysis.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">GST Sales Report</h5>
                    <p className="text-sm text-muted-foreground">
                      GST collection summary for tax filing and compliance.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Profit Analysis</h5>
                    <p className="text-sm text-muted-foreground">
                      Profit margin analysis by product, category, and time period.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Payment Method Report</h5>
                    <p className="text-sm text-muted-foreground">
                      Breakdown of sales by payment method and reconciliation.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Custom Reports</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Report Builder</h5>
                    <p className="text-sm text-muted-foreground">
                      Create custom reports with specific fields, filters, and date ranges.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Scheduled Reports</h5>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate and email reports on a schedule.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Export Options</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    PDF reports for professional presentation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Excel/CSV for data analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Email delivery to stakeholders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    API access for third-party integration
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All reports can be filtered by date range, customer, product category, or any other relevant criteria to provide targeted insights.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}