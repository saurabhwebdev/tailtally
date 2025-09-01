'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  PawPrint, 
  Package, 
  CreditCard, 
  Calendar, 
  FileText, 
  Receipt,
  Download,
  Mail,
  Phone,
  MapPin,
  Settings,
  Eye
} from 'lucide-react';
import { downloadInvoice, generateInvoiceHTML } from '@/lib/invoice-generator';
import { InvoiceSettingsModal } from '@/components/invoices/invoice-settings-modal';

export function SaleDetail({ sale, onClose }) {
  const [, setLoading] = useState(false);
  const [saleData, setSaleData] = useState(sale);
  const [showInvoiceSettings, setShowInvoiceSettings] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [invoiceHTML, setInvoiceHTML] = useState('');

  // Fetch complete sale details if needed
  useEffect(() => {
    if (sale && !sale.items?.[0]?.inventory?.name) {
      fetchSaleDetails();
    }
  }, [sale]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales/${sale._id}`);
      const data = await response.json();
      
      if (response.ok) {
        setSaleData(data.data.sale);
      }
    } catch (err) {
      console.error('Failed to fetch sale details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { variant: 'secondary', label: 'Draft' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      delivered: { variant: 'success', label: 'Delivered' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      returned: { variant: 'warning', label: 'Returned' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      partial: { variant: 'secondary', label: 'Partial' },
      paid: { variant: 'success', label: 'Paid' },
      refunded: { variant: 'destructive', label: 'Refunded' },
      cancelled: { variant: 'outline', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);
      
      // Validate sale data before generating PDF
      if (!saleData) {
        throw new Error('No sale data available');
      }

      if (!saleData.items || saleData.items.length === 0) {
        throw new Error('No items found in sale');
      }

      console.log('Generating invoice for sale:', saleData.saleNumber);
      console.log('Sale data:', saleData);
      
      const success = await downloadInvoice(saleData);
      if (success) {
        // Show success toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Invoice downloaded successfully!', 'success');
        }
        console.log('Invoice downloaded successfully');
      } else {
        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Failed to download invoice. Please try again.', 'error');
        }
        console.error('Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`Error downloading invoice: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewInvoice = () => {
    const html = generateInvoiceHTML(saleData);
    setInvoiceHTML(html);
    setShowInvoicePreview(true);
  };

  const handleInvoiceSettings = () => {
    setShowInvoiceSettings(true);
  };

  if (!saleData) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Sale Details - {saleData.saleNumber}
          </DialogTitle>
          <DialogDescription>
            Complete information about this sale transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sale Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{saleData.saleNumber}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(saleData.saleDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {saleData.salesPerson?.firstName} {saleData.salesPerson?.lastName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(saleData.status)}
              {getPaymentStatusBadge(saleData.payment?.status)}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{saleData.customer?.owner?.firstName} {saleData.customer?.owner?.lastName}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {saleData.customer?.owner?.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {saleData.customer?.owner?.phone}
                      </div>
                      {saleData.customer?.owner?.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {saleData.customer.owner.address.street}, {saleData.customer.owner.address.city}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {saleData.customer?.pet && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-5 w-5" />
                      <h4 className="font-medium">Pet Information</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{saleData.customer.pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {saleData.customer.pet.species} • {saleData.customer.pet.breed}
                      </p>
                      {saleData.customer.pet.age && (
                        <p className="text-sm text-muted-foreground">
                          Age: {saleData.customer.pet.age} years
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items ({saleData.items?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>GST</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {saleData.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.notes && (
                              <div className="text-sm text-muted-foreground">{item.notes}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.unitPrice?.toFixed(2)}</TableCell>
                        <TableCell>
                          {item.discount > 0 && (
                            <span className="text-green-600">
                              {item.discountType === 'percentage' ? `${item.discount}%` : `₹${item.discount}`}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {item.gst?.isApplicable && (
                            <Badge variant="outline">{item.gst?.rate || 0}%</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{item.total?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Sale Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{saleData.totals?.subtotal?.toFixed(2)}</span>
                </div>
                {saleData.totals?.totalDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Discount:</span>
                    <span>-₹{saleData.totals.totalDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxable Amount:</span>
                  <span>₹{saleData.totals?.totalTaxable?.toFixed(2)}</span>
                </div>
                {saleData.totals?.totalGST > 0 && (
                  <div className="flex justify-between">
                    <span>Total GST:</span>
                    <span>₹{saleData.totals.totalGST.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span>₹{saleData.totals?.grandTotal?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Method:</span>
                    <p className="font-medium capitalize">{saleData.payment?.method?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Payment Status:</span>
                    <div className="mt-1">
                      {getPaymentStatusBadge(saleData.payment?.status)}
                    </div>
                  </div>
                  {saleData.payment?.transactionId && (
                    <div>
                      <span className="text-sm text-muted-foreground">Transaction ID:</span>
                      <p className="font-mono text-sm">{saleData.payment.transactionId}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Paid Amount:</span>
                    <p className="font-medium text-green-600">₹{saleData.payment?.paidAmount?.toFixed(2)}</p>
                  </div>
                  {saleData.payment?.dueAmount > 0 && (
                    <div>
                      <span className="text-sm text-muted-foreground">Due Amount:</span>
                      <p className="font-medium text-red-600">₹{saleData.payment.dueAmount.toFixed(2)}</p>
                    </div>
                  )}
                  {saleData.payment?.paymentDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">Payment Date:</span>
                      <p className="font-medium">{new Date(saleData.payment.paymentDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {saleData.payment?.dueDate && (
                    <div>
                      <span className="text-sm text-muted-foreground">Due Date:</span>
                      <p className="font-medium">{new Date(saleData.payment.dueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(saleData.notes || saleData.deliveryDate) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {saleData.deliveryDate && (
                  <div>
                    <span className="text-sm text-muted-foreground">Delivery Date:</span>
                    <p className="font-medium">{new Date(saleData.deliveryDate).toLocaleDateString()}</p>
                  </div>
                )}
                {saleData.notes && (
                  <div>
                    <span className="text-sm text-muted-foreground">Notes:</span>
                    <p className="mt-1">{saleData.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invoice Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Invoice Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Generate Professional Invoice</p>
                  <p className="text-sm text-muted-foreground">
                    Download or preview your invoice with custom settings
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleInvoiceSettings}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePreviewInvoice}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="default" size="sm" onClick={handleDownloadInvoice}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Invoice Settings Modal */}
      <InvoiceSettingsModal 
        open={showInvoiceSettings} 
        onClose={() => setShowInvoiceSettings(false)} 
      />

      {/* Invoice Preview Modal */}
      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Invoice Preview
            </DialogTitle>
            <DialogDescription>
              Preview your invoice before downloading
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <iframe
              srcDoc={invoiceHTML}
              className="w-full h-[70vh] border rounded"
              title="Invoice Preview"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowInvoicePreview(false)}>
              Close
            </Button>
            <Button onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}