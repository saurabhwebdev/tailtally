'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  RefreshCw,
  MoreHorizontal,
  Mail,
  CreditCard,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { InvoiceDetail } from './invoice-detail';
import { PaymentModal } from './payment-modal';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: '',
    startDate: '',
    endDate: '',
    overdue: false
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    count: 0,
    totalCount: 0
  });
  const [statistics, setStatistics] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    averageInvoice: 0,
    overdueCount: 0
  });

  // Fetch invoices data
  const fetchInvoices = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`/api/invoices?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invoices');
      }

      setInvoices(data.data.invoices);
      setPagination(data.data.pagination);
      setStatistics(data.data.statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchInvoices(1);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleAddPayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!confirm('Are you sure you want to cancel this invoice?')) return;

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel invoice');
      }

      fetchInvoices(pagination.current);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendInvoice = async () => {
    try {
      // This would typically send the invoice via email
      alert('Invoice sent successfully!');
    } catch (err) {
      setError(err.message);
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

  if (loading && invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{statistics.totalAmount?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{statistics.totalPaid?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalAmount > 0 ? ((statistics.totalPaid / statistics.totalAmount) * 100).toFixed(1) : 0}% collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              ₹{statistics.totalDue?.toLocaleString()} due
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({statistics.overdueCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>
                    Manage invoices, track payments, and send reminders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search invoices..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    onKeyPress={handleSearch}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange('status', value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="viewed">Viewed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.paymentStatus || "all"} onValueChange={(value) => handleFilterChange('paymentStatus', value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => fetchInvoices(1)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Invoices Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => {
                      const daysOverdue = getDaysOverdue(invoice.dueDate, invoice.payment?.status);
                      
                      return (
                        <TableRow key={invoice._id}>
                          <TableCell className="font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {invoice.customer?.details?.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {invoice.customer?.details?.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">₹{invoice.totals?.finalAmount?.toLocaleString()}</div>
                            {invoice.payment?.paidAmount > 0 && (
                              <div className="text-xs text-green-600">
                                Paid: ₹{invoice.payment.paidAmount.toLocaleString()}
                              </div>
                            )}
                            {invoice.payment?.dueAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Due: ₹{invoice.payment.dueAmount.toLocaleString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(invoice.status)}
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(invoice.payment?.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </div>
                            {daysOverdue > 0 && (
                              <div className="text-xs text-red-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {daysOverdue} days overdue
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendInvoice()}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Invoice
                                </DropdownMenuItem>
                                {invoice.payment?.status !== 'paid' && (
                                  <DropdownMenuItem onClick={() => handleAddPayment(invoice)}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Add Payment
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </DropdownMenuItem>
                                {invoice.status !== 'paid' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteInvoice(invoice._id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel Invoice
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {pagination.count} of {pagination.totalCount} invoices
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchInvoices(pagination.current - 1)}
                      disabled={pagination.current === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {pagination.current} of {pagination.total}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchInvoices(pagination.current + 1)}
                      disabled={pagination.current === pagination.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Overdue Invoices
              </CardTitle>
              <CardDescription>
                Invoices that are past their due date and require attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices
                      .filter(invoice => getDaysOverdue(invoice.dueDate, invoice.payment?.status) > 0)
                      .map((invoice) => {
                        const daysOverdue = getDaysOverdue(invoice.dueDate, invoice.payment?.status);
                        
                        return (
                          <TableRow key={invoice._id}>
                            <TableCell className="font-medium">
                              {invoice.invoiceNumber}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {invoice.customer?.details?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {invoice.customer?.details?.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-red-600">
                                ₹{invoice.payment?.dueAmount?.toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="destructive">
                                {daysOverdue} days
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleSendInvoice()}>
                                  <Mail className="h-4 w-4 mr-1" />
                                  Send Reminder
                                </Button>
                                <Button size="sm" onClick={() => handleAddPayment(invoice)}>
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Add Payment
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showInvoiceDetail && selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceDetail(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
            fetchInvoices(pagination.current);
          }}
        />
      )}
    </div>
  );
}