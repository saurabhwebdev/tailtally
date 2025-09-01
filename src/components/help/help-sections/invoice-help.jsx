'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Calculator, 
  CreditCard, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Printer,
  Download,
  Send,
  Shield
} from 'lucide-react';

export function InvoiceHelp() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="generation">Generation</TabsTrigger>
        <TabsTrigger value="management">Management</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Management Overview
            </CardTitle>
            <CardDescription>
              Professional invoicing system with GST compliance and payment tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Core Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GST-compliant invoice generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Professional invoice templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Automatic numbering system
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Payment tracking and reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Multi-format export (PDF, Excel)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Email delivery system
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Recurring invoice automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Partial payment handling
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Credit note generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Multi-currency support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Aging reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Integration with accounting systems
                  </li>
                </ul>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All invoices are automatically GST-compliant and include all required fields for legal and tax purposes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Generation Tab */}
      <TabsContent value="generation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Invoice Generation
            </CardTitle>
            <CardDescription>
              Creating professional invoices for products and services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">1</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Select the customer and verify their billing address and GST details if applicable.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><Badge variant="outline">Name</Badge> Customer name</div>
                    <div><Badge variant="outline">Address</Badge> Billing address</div>
                    <div><Badge variant="outline">GSTIN</Badge> GST number (if applicable)</div>
                    <div><Badge variant="outline">Contact</Badge> Phone/Email</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">2</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Add Items/Services</h4>
                  <p className="text-sm text-muted-foreground">
                    Add products or services with quantities, rates, and applicable discounts.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">3</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">GST Calculation</h4>
                  <p className="text-sm text-muted-foreground">
                    System automatically calculates GST based on item configuration and customer location.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">4</div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Review and Generate</h4>
                  <p className="text-sm text-muted-foreground">
                    Review the invoice details, add any notes, and generate the final invoice.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">Invoice Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded">
                  <h5 className="font-medium mb-2">Tax Invoice</h5>
                  <p className="text-sm text-muted-foreground">
                    Standard GST invoice for registered businesses with full tax details.
                  </p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium mb-2">Bill of Supply</h5>
                  <p className="text-sm text-muted-foreground">
                    For unregistered customers or exempt/zero-rated supplies.
                  </p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium mb-2">Proforma Invoice</h5>
                  <p className="text-sm text-muted-foreground">
                    Preliminary invoice for quotations and advance payments.
                  </p>
                </div>
                <div className="p-3 border rounded">
                  <h5 className="font-medium mb-2">Credit Note</h5>
                  <p className="text-sm text-muted-foreground">
                    For returns, refunds, or invoice corrections.
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                The system automatically selects the appropriate invoice type based on customer details and transaction nature.
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
              Invoice Management
            </CardTitle>
            <CardDescription>
              Managing invoice lifecycle from creation to payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Invoice Status Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Draft Invoices</h5>
                    <p className="text-sm text-muted-foreground">
                      Save incomplete invoices as drafts and complete them later.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Sent Invoices</h5>
                    <p className="text-sm text-muted-foreground">
                      Track invoices sent to customers with delivery confirmation.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Paid Invoices</h5>
                    <p className="text-sm text-muted-foreground">
                      Manage fully paid invoices with payment details and receipts.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Overdue Invoices</h5>
                    <p className="text-sm text-muted-foreground">
                      Track overdue payments with automated reminder systems.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Invoice Operations</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Available Actions</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Download className="h-4 w-4 text-green-600" />
                        Download as PDF or Excel
                      </li>
                      <li className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-green-600" />
                        Email directly to customers
                      </li>
                      <li className="flex items-center gap-2">
                        <Printer className="h-4 w-4 text-green-600" />
                        Print for physical delivery
                      </li>
                      <li className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        Send payment reminders
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        Duplicate for similar transactions
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
                      Search by invoice number, customer name, or amount.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Advanced Filters</h5>
                    <p className="text-sm text-muted-foreground">
                      Filter by date range, status, payment method, or customer type.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Payments Tab */}
      <TabsContent value="payments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Management
            </CardTitle>
            <CardDescription>
              Tracking payments and managing outstanding balances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Payment Recording</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Full Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      Record complete payment of invoice amount with payment method details.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Partial Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      Handle partial payments with automatic balance calculation.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Advance Payments</h5>
                    <p className="text-sm text-muted-foreground">
                      Manage advance payments and apply them to future invoices.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Refunds</h5>
                    <p className="text-sm text-muted-foreground">
                      Process refunds with proper documentation and accounting.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 border rounded text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <h5 className="font-medium mb-1">Cash</h5>
                    <p className="text-xs text-muted-foreground">Cash payments with receipt generation</p>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <h5 className="font-medium mb-1">Bank Transfer</h5>
                    <p className="text-xs text-muted-foreground">NEFT, RTGS, IMPS transfers</p>
                  </div>
                  <div className="p-3 border rounded text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <h5 className="font-medium mb-1">Digital</h5>
                    <p className="text-xs text-muted-foreground">UPI, wallets, online payments</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Payment Reminders</h4>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h5 className="font-semibold mb-3">Automated Reminder System</h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Send reminders before due date
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Escalating reminder sequence
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Customizable reminder templates
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Multiple communication channels
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Payment tracking integrates with bank reconciliation and accounting systems for accurate financial reporting.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Compliance Tab */}
      <TabsContent value="compliance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              GST Compliance
            </CardTitle>
            <CardDescription>
              Ensuring invoices meet all GST and legal requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Mandatory Invoice Fields</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium text-red-600">Required Fields</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Invoice number and date</li>
                      <li>• Supplier GSTIN and details</li>
                      <li>• Customer details and GSTIN (if applicable)</li>
                      <li>• HSN/SAC codes for all items</li>
                      <li>• Taxable value and GST amounts</li>
                      <li>• Place of supply</li>
                      <li>• Signature or digital signature</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium text-green-600">Auto-Generated</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Sequential invoice numbering</li>
                      <li>• GST calculations</li>
                      <li>• Tax breakdowns (CGST/SGST/IGST)</li>
                      <li>• Total amounts in words</li>
                      <li>• Terms and conditions</li>
                      <li>• Company logo and branding</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Compliance Checks</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Automatic Validations</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        GSTIN format validation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        HSN/SAC code verification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        GST rate consistency check
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Place of supply validation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Invoice sequence verification
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Legal Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Invoice Retention:</strong> All invoices must be retained for 6 years as per GST law.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Sequential Numbering:</strong> Invoice numbers must be sequential without gaps.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Non-compliant invoices can result in penalties and rejection of input tax credit claims. Always ensure compliance before finalizing invoices.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Templates Tab */}
      <TabsContent value="templates" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Templates
            </CardTitle>
            <CardDescription>
              Customizing invoice appearance and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">Template Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Standard Template</h5>
                    <p className="text-sm text-muted-foreground">
                      Clean, professional template suitable for most businesses.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Detailed Template</h5>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive template with detailed item descriptions and terms.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Minimal Template</h5>
                    <p className="text-sm text-muted-foreground">
                      Simple, compact template for quick transactions.
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h5 className="font-medium mb-2">Custom Template</h5>
                    <p className="text-sm text-muted-foreground">
                      Fully customizable template with your branding and layout.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Customization Options</h4>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h5 className="font-semibold mb-3">Branding Elements</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Company logo and letterhead
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Custom color schemes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Font selection and sizing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Custom terms and conditions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Footer information and disclaimers
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Template Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Template Library</h5>
                    <p className="text-sm text-muted-foreground">
                      Save and manage multiple templates for different business needs.
                    </p>
                  </div>
                  <div className="p-3 border rounded">
                    <h5 className="font-medium mb-2">Preview System</h5>
                    <p className="text-sm text-muted-foreground">
                      Preview templates before applying to ensure proper formatting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All templates maintain GST compliance requirements while allowing customization of appearance and branding elements.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}