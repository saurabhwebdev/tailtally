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
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Receipt, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  RefreshCw,
  MoreHorizontal,
  Settings
} from 'lucide-react';
import { SaleForm } from './sale-form';
import { SaleDetail } from './sale-detail';
import { SalesStats } from './sales-stats';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { InvoiceSettingsModal } from '@/components/invoices/invoice-settings-modal';

export function SalesManagement() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showSaleDetail, setShowSaleDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    count: 0,
    totalCount: 0
  });
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalItems: 0,
    averageSale: 0
  });
  const [showInvoiceSettings, setShowInvoiceSettings] = useState(false);

  // Fetch sales data
  const fetchSales = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`/api/sales?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sales');
      }

      setSales(data.data.sales);
      setPagination(data.data.pagination);
      setStatistics(data.data.statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchSales(1);
    }
  };

  const handleInvoiceSettings = () => {
    setShowInvoiceSettings(true);
  };

  const handleViewSale = (sale) => {
    setSelectedSale(sale);
    setShowSaleDetail(true);
  };

  const handleEditSale = (sale) => {
    setSelectedSale(sale);
    setShowSaleForm(true);
  };

  const handleDeleteSale = async (saleId) => {
    if (!confirm('Are you sure you want to cancel this sale?')) return;

    try {
      const response = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel sale');
      }

      fetchSales(pagination.current);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateInvoice = async (saleId) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ saleId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create invoice');
      }

      await response.json();
      alert('Invoice created successfully!');
      fetchSales(pagination.current);
    } catch (err) {
      setError(err.message);
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

  if (loading && sales.length === 0) {
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
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{statistics.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{statistics.averageSale?.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              +3% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sales Transactions</CardTitle>
                  <CardDescription>
                    Manage and track all sales transactions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleInvoiceSettings}>
                    <Settings className="h-4 w-4 mr-2" />
                    Invoice Settings
                  </Button>
                  <Button onClick={() => setShowSaleForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Sale
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search sales..."
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
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
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
                <Button variant="outline" onClick={() => fetchSales(1)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Sales Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Pet</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">
                          {sale.saleNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {sale.customer?.owner?.firstName} {sale.customer?.owner?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sale.customer?.owner?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sale.customer?.pet ? (
                            <div>
                              <div className="font-medium">{sale.customer.pet.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {sale.customer.pet.species} • {sale.customer.pet.breed}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {sale.items?.length} items
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {sale.totalItems} qty
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">₹{sale.totals?.grandTotal?.toLocaleString()}</div>
                          {sale.totals?.totalDiscount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              -₹{sale.totals.totalDiscount} discount
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sale.status)}
                        </TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(sale.payment?.status)}
                          {sale.payment?.dueAmount > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Due: ₹{sale.payment.dueAmount}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(sale.saleDate).toLocaleTimeString()}
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
                              <DropdownMenuItem onClick={() => handleViewSale(sale)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditSale(sale)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Sale
                              </DropdownMenuItem>
                              {!sale.invoice && sale.status !== 'cancelled' && (
                                <DropdownMenuItem onClick={() => handleCreateInvoice(sale._id)}>
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Create Invoice
                                </DropdownMenuItem>
                              )}
                              {sale.status !== 'delivered' && sale.status !== 'cancelled' && (
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteSale(sale._id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancel Sale
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.total > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {pagination.count} of {pagination.totalCount} sales
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchSales(pagination.current - 1)}
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
                      onClick={() => fetchSales(pagination.current + 1)}
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

        <TabsContent value="analytics">
          <SalesStats />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showSaleForm && (
        <SaleForm
          sale={selectedSale}
          onClose={() => {
            setShowSaleForm(false);
            setSelectedSale(null);
          }}
          onSuccess={() => {
            setShowSaleForm(false);
            setSelectedSale(null);
            fetchSales(pagination.current);
          }}
        />
      )}

      {showSaleDetail && selectedSale && (
        <SaleDetail
          sale={selectedSale}
          onClose={() => {
            setShowSaleDetail(false);
            setSelectedSale(null);
          }}
        />
      )}

      {/* Invoice Settings Modal */}
      <InvoiceSettingsModal 
        open={showInvoiceSettings} 
        onClose={() => setShowInvoiceSettings(false)} 
      />
    </div>
  );
}