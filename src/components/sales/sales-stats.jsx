'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  CreditCard,
  Target,
  Award,
  RefreshCw
} from 'lucide-react';

export function SalesStats() {
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [period, setPeriod] = useState('30');
  const [stats, setStats] = useState({
    sales: {
      totalSales: 0,
      totalRevenue: 0,
      totalItems: 0,
      averageSale: 0,
      totalDiscount: 0,
      totalGST: 0
    },
    salesByStatus: {},
    paymentStats: {},
    topItems: [],
    paymentMethods: {},
    dailyTrend: [],
    customers: {
      uniqueCustomers: 0,
      totalCustomerSpending: 0,
      averageCustomerValue: 0,
      repeatCustomers: 0
    },
    invoices: {
      totalInvoices: 0,
      totalInvoiceAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      paidInvoices: 0,
      overdueInvoices: 0
    },
    conversionRate: 0,
    paymentCollectionRate: 0,
    averageItemsPerSale: 0
  });

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/sales/stats?period=${period}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }

      setStats(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-blue-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
      returned: 'bg-yellow-500',
      draft: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPaymentColor = (status) => {
    const colors = {
      paid: 'bg-green-500',
      pending: 'bg-yellow-500',
      partial: 'bg-orange-500',
      refunded: 'bg-red-500',
      cancelled: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sales Analytics</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.sales.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sales.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.sales.averageSale)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Status</CardTitle>
            <CardDescription>Breakdown of sales by their current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.salesByStatus).map(([status, data]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.count}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(data.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Payment collection overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.paymentStats).map(([status, data]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getPaymentColor(status)}`} />
                  <span className="capitalize">{status}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{data.count}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(data.amount)}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Collection Rate:</span>
                <span className="font-medium">{stats.paymentCollectionRate}%</span>
              </div>
              <Progress value={parseFloat(stats.paymentCollectionRate)} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Top Selling Items
          </CardTitle>
          <CardDescription>Best performing products by quantity sold</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topItems.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.quantity} sold</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>Revenue breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.paymentMethods).map(([method, data]) => {
              const percentage = stats.sales.totalRevenue > 0 
                ? (data.amount / stats.sales.totalRevenue * 100).toFixed(1)
                : 0;
              
              return (
                <div key={method} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{method.replace('_', ' ')}</span>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(data.amount)}</div>
                      <div className="text-sm text-muted-foreground">{data.count} transactions</div>
                    </div>
                  </div>
                  <Progress value={parseFloat(percentage)} className="h-2" />
                  <div className="text-xs text-muted-foreground text-right">
                    {percentage}% of total revenue
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
            <CardDescription>Customer behavior and loyalty metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Customers:</span>
              <span className="font-medium">{stats.customers.uniqueCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span>Repeat Customers:</span>
              <span className="font-medium">{stats.customers.repeatCustomers}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Retention:</span>
              <span className="font-medium">{stats.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. Customer Value:</span>
              <span className="font-medium">{formatCurrency(stats.customers.averageCustomerValue)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Retention Rate:</span>
                <span className="font-medium">{stats.conversionRate}%</span>
              </div>
              <Progress value={parseFloat(stats.conversionRate)} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Summary</CardTitle>
            <CardDescription>Invoice and payment collection overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Invoices:</span>
              <span className="font-medium">{stats.invoices.totalInvoices}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid Invoices:</span>
              <span className="font-medium text-green-600">{stats.invoices.paidInvoices}</span>
            </div>
            <div className="flex justify-between">
              <span>Overdue Invoices:</span>
              <span className="font-medium text-red-600">{stats.invoices.overdueInvoices}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Due:</span>
              <span className="font-medium text-red-600">{formatCurrency(stats.invoices.totalDue)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span>Collection Rate:</span>
                <span className="font-medium">{stats.paymentCollectionRate}%</span>
              </div>
              <Progress value={parseFloat(stats.paymentCollectionRate)} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Discounts Given</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.sales.totalDiscount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.sales.totalRevenue > 0 
                ? ((stats.sales.totalDiscount / stats.sales.totalRevenue) * 100).toFixed(1)
                : 0}% of total revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total GST Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.sales.totalGST)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tax component of sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Items per Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageItemsPerSale}
            </div>
            <p className="text-xs text-muted-foreground">
              Items sold per transaction
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}