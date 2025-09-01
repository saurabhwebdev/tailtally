'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    Receipt,
    Download,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    FileText,
    Building,
    User,
    Package,
    Calculator,
    Printer,
    Send,
    Clock,
    AlertTriangle
} from 'lucide-react';

export function InvoiceDetail({ invoice, onClose }) {
    const [loading, setLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState(invoice);

    // Fetch complete invoice details if needed
    useEffect(() => {
        if (invoice && !invoice.items?.[0]?.name) {
            fetchInvoiceDetails();
        }
    }, [invoice]);

    const fetchInvoiceDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/invoices/${invoice._id}`);
            const data = await response.json();

            if (response.ok) {
                setInvoiceData(data.data.invoice);
            }
        } catch (err) {
            console.error('Failed to fetch invoice details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { variant: 'secondary', label: 'Draft' },
            sent: { variant: 'default', label: 'Sent' },
            viewed: { variant: 'info', label: 'Viewed' },
            paid: { variant: 'success', label: 'Paid' },
            overdue: { variant: 'destructive', label: 'Overdue' },
            cancelled: { variant: 'outline', label: 'Cancelled' }
        };

        const config = statusConfig[status] || { variant: 'secondary', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { variant: 'warning', label: 'Pending' },
            partial: { variant: 'secondary', label: 'Partial' },
            paid: { variant: 'success', label: 'Paid' },
            refunded: { variant: 'destructive', label: 'Refunded' }
        };

        const config = statusConfig[status] || { variant: 'secondary', label: status };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    const getDaysOverdue = (dueDate, paymentStatus) => {
        if (paymentStatus === 'paid' || !dueDate) return 0;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = today - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            
            // Import the PDF generator
            const { downloadInvoice } = await import('@/lib/invoice-generator');
            
            // Convert invoice data to sale data format for the PDF generator
            const customerName = invoiceData.customer?.details?.name || 'Unknown Customer';
            const nameParts = customerName.split(' ');
            
            const saleData = {
                saleNumber: invoiceData.invoiceNumber || `INV-${Date.now()}`,
                saleDate: invoiceData.invoiceDate || new Date().toISOString(),
                customer: {
                    owner: {
                        firstName: nameParts[0] || 'Unknown',
                        lastName: nameParts.slice(1).join(' ') || '',
                        address: invoiceData.customer?.details?.address ? {
                            street: invoiceData.customer.details.address,
                            city: '',
                            state: '',
                            postalCode: ''
                        } : {
                            street: 'Address not provided',
                            city: '',
                            state: '',
                            postalCode: ''
                        },
                        phone: invoiceData.customer?.details?.phone || 'N/A',
                        email: invoiceData.customer?.details?.email || 'N/A'
                    }
                },
                items: invoiceData.items?.length > 0 ? invoiceData.items.map(item => ({
                    name: item.name || 'Unnamed Item',
                    sku: item.hsnCode || item.sacCode || 'N/A',
                    quantity: item.quantity || 1,
                    unitPrice: item.rate || 0,
                    discount: item.discount || 0,
                    discountType: 'amount',
                    gst: {
                        isApplicable: (item.gstRate || 0) > 0,
                        rate: item.gstRate || 0
                    },
                    total: item.totalAmount || 0
                })) : [{
                    name: 'Service Charge',
                    sku: 'SVC001',
                    quantity: 1,
                    unitPrice: invoiceData.totals?.finalAmount || 0,
                    discount: 0,
                    discountType: 'amount',
                    gst: {
                        isApplicable: false,
                        rate: 0
                    },
                    total: invoiceData.totals?.finalAmount || 0
                }],
                totals: {
                    subtotal: invoiceData.totals?.subtotal || invoiceData.totals?.finalAmount || 0,
                    totalDiscount: invoiceData.totals?.totalDiscount || 0,
                    totalTaxable: invoiceData.totals?.taxableAmount || invoiceData.totals?.finalAmount || 0,
                    totalGST: invoiceData.totals?.totalGST || 0,
                    grandTotal: invoiceData.totals?.finalAmount || 0
                },
                payment: {
                    method: invoiceData.payment?.method || 'cash',
                    status: invoiceData.payment?.status || 'pending',
                    paidAmount: invoiceData.payment?.paidAmount || 0,
                    dueAmount: invoiceData.payment?.dueAmount || invoiceData.totals?.finalAmount || 0
                }
            };
            
            console.log('Formatted sale data for PDF:', saleData);
            
            const success = await downloadInvoice(saleData);
            if (success) {
                // Show success message
                if (typeof window !== 'undefined' && window.showToast) {
                    window.showToast('PDF downloaded successfully!', 'success');
                }
                console.log('PDF downloaded successfully');
            } else {
                if (typeof window !== 'undefined' && window.showToast) {
                    window.showToast('Failed to generate PDF. Please try again.', 'error');
                } else {
                    alert('Failed to generate PDF. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            if (typeof window !== 'undefined' && window.showToast) {
                window.showToast('Error generating PDF. Please try again.', 'error');
            } else {
                alert('Error generating PDF. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = () => {
        // This would typically send the invoice via email
        alert('Email sending functionality would be implemented here');
    };

    const handlePrint = () => {
        // This would typically open print dialog
        window.print();
    };

    if (!invoiceData) return null;

    const daysOverdue = getDaysOverdue(invoiceData.dueDate, invoiceData.payment?.status);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        Invoice Details - {invoiceData.invoiceNumber}
                    </DialogTitle>
                    <DialogDescription>
                        Complete invoice information and payment details
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Invoice Header */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold">{invoiceData.invoiceNumber}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Invoice Date: {new Date(invoiceData.invoiceDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Due Date: {new Date(invoiceData.dueDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(invoiceData.status)}
                            {getPaymentStatusBadge(invoiceData.payment?.status)}
                            {daysOverdue > 0 && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {daysOverdue} days overdue
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Business and Customer Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="h-5 w-5" />
                                    From
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="font-semibold">{invoiceData.business?.name || 'TailTally Pet Care'}</div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <div>{invoiceData.business?.address || '123 Pet Street, Pet City'}</div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {invoiceData.business?.phone || '+91 98765 43210'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {invoiceData.business?.email || 'info@tailtally.com'}
                                    </div>
                                    {invoiceData.business?.gstin && (
                                        <div>GSTIN: {invoiceData.business.gstin}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Bill To
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="font-semibold">{invoiceData.customer?.details?.name}</div>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    {invoiceData.customer?.details?.address && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 mt-0.5" />
                                            <div>{invoiceData.customer.details.address}</div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {invoiceData.customer?.details?.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {invoiceData.customer?.details?.email}
                                    </div>
                                    {invoiceData.customer?.details?.gstin && (
                                        <div>GSTIN: {invoiceData.customer.details.gstin}</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Items Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Items ({invoiceData.items?.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead>HSN/SAC</TableHead>
                                            <TableHead className="text-center">Qty</TableHead>
                                            <TableHead className="text-right">Rate</TableHead>
                                            <TableHead className="text-right">Discount</TableHead>
                                            <TableHead className="text-right">Taxable</TableHead>
                                            <TableHead className="text-center">GST%</TableHead>
                                            <TableHead className="text-right">GST Amount</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoiceData.items?.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{item.name}</div>
                                                        {item.description && (
                                                            <div className="text-sm text-muted-foreground">{item.description}</div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {item.hsnCode || item.sacCode || '-'}
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">₹{item.rate?.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.discount > 0 ? (
                                                        <span className="text-green-600">
                                                            ₹{item.discount.toFixed(2)}
                                                        </span>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">₹{item.taxableAmount?.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">
                                                    {item.gstRate > 0 ? `${item.gstRate}%` : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">₹{item.gstAmount?.toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-medium">
                                                    ₹{item.totalAmount?.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Totals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div></div> {/* Empty space for layout */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Invoice Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>₹{invoiceData.totals?.subtotal?.toFixed(2)}</span>
                                    </div>
                                    {invoiceData.totals?.totalDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Total Discount:</span>
                                            <span>-₹{invoiceData.totals.totalDiscount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>Taxable Amount:</span>
                                        <span>₹{invoiceData.totals?.taxableAmount?.toFixed(2)}</span>
                                    </div>
                                    {invoiceData.totals?.cgstAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>CGST:</span>
                                            <span>₹{invoiceData.totals.cgstAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {invoiceData.totals?.sgstAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>SGST:</span>
                                            <span>₹{invoiceData.totals.sgstAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {invoiceData.totals?.igstAmount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span>IGST:</span>
                                            <span>₹{invoiceData.totals.igstAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {invoiceData.totals?.totalGST > 0 && (
                                        <div className="flex justify-between">
                                            <span>Total GST:</span>
                                            <span>₹{invoiceData.totals.totalGST.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {invoiceData.totals?.cessAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span>Cess:</span>
                                            <span>₹{invoiceData.totals.cessAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Final Amount:</span>
                                        <span>₹{invoiceData.totals?.finalAmount?.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Amount in words: {invoiceData.totals?.amountInWords || 'N/A'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Payment Status</div>
                                    <div>{getPaymentStatusBadge(invoiceData.payment?.status)}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Amount Paid</div>
                                    <div className="font-medium text-green-600">
                                        ₹{invoiceData.payment?.paidAmount?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Amount Due</div>
                                    <div className="font-medium text-red-600">
                                        ₹{invoiceData.payment?.dueAmount?.toFixed(2) || '0.00'}
                                    </div>
                                </div>
                            </div>

                            {invoiceData.payment?.payments?.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="font-medium mb-3">Payment History</h4>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Method</TableHead>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {invoiceData.payment.payments.map((payment, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {new Date(payment.date).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="capitalize">
                                                            {payment.method.replace('_', ' ')}
                                                        </TableCell>
                                                        <TableCell className="font-mono text-sm">
                                                            {payment.transactionId || '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            ₹{payment.amount.toFixed(2)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    {(invoiceData.notes || invoiceData.terms) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Additional Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {invoiceData.notes && (
                                    <div>
                                        <h4 className="font-medium mb-2">Notes</h4>
                                        <p className="text-sm text-muted-foreground">{invoiceData.notes}</p>
                                    </div>
                                )}
                                {invoiceData.terms && (
                                    <div>
                                        <h4 className="font-medium mb-2">Terms & Conditions</h4>
                                        <p className="text-sm text-muted-foreground">{invoiceData.terms}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Overdue Alert */}
                    {daysOverdue > 0 && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-medium">
                                        This invoice is {daysOverdue} days overdue
                                    </span>
                                </div>
                                <p className="text-sm text-red-600 mt-1">
                                    Please follow up with the customer for payment collection.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={handleSendEmail}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Email
                        </Button>
                        <Button onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}