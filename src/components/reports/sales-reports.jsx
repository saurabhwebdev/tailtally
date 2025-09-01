'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Package,
  Users,
  CreditCard,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  Receipt,
  Target,
  Activity,
  Calendar
} from 'lucide-react';

// Modular report display components
const DailySalesReport = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Daily Sales Summary
      </CardTitle>
      <CardDescription>
        Sales performance for {data?.date || 'selected date'}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <p className="text-2xl font-bold">${data?.totalRevenue || '0'}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{data?.transactionCount || '0'}</p>
          <p className="text-sm text-muted-foreground">Transactions</p>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">${data?.averageOrderValue || '0'}</p>
          <p className="text-sm text-muted-foreground">Average Order</p>
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold">{data?.uniqueCustomers || '0'}</p>
          <p className="text-sm text-muted-foreground">Customers</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const WeeklySalesReport = ({ data }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Revenue</span>
            <span className="font-bold">${data?.totalRevenue || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Orders</span>
            <span className="font-bold">{data?.totalOrders || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Daily Sales</span>
            <span className="font-bold">${data?.avgDailySales || '0'}</span>
          </div>
          <div className="flex justify-between">
            <span>Growth vs Last Week</span>
            <span className={`font-bold ${data?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data?.growth || '0'}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Daily Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.dailyBreakdown?.map((day, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{day.date}</span>
              <span className="font-medium">${day.revenue}</span>
            </div>
          )) || <p className="text-muted-foreground">No data available</p>}
        </div>
      </CardContent>
    </Card>
  </div>
);

const MonthlyRevenueReport = ({ data }) => (
  <div className="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Revenue Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold">${data?.totalRevenue || '0'}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">+{data?.growth || '0'}%</p>
            <p className="text-sm text-muted-foreground">vs Previous Month</p>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data?.topCategories?.map((cat, idx) => (
            <div key={idx} className="flex justify-between">
              <span className="text-sm">{cat.name}</span>
              <span className="font-medium">${cat.revenue}</span>
            </div>
          )) || <p className="text-muted-foreground">No data</p>}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <p>• Best day: {data?.bestDay || 'N/A'}</p>
          <p>• Peak hour: {data?.peakHour || 'N/A'}</p>
          <p>• Top product: {data?.topProduct || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ProductPerformanceReport = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        Product Performance Analysis
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data?.products?.map((product, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">{product.category}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{product.unitsSold}</div>
              <div className="text-sm text-muted-foreground">units</div>
            </div>
            <div className="text-right">
              <div className="font-bold">${product.revenue}</div>
              <div className="text-sm text-muted-foreground">revenue</div>
            </div>
          </div>
        )) || <p className="text-muted-foreground">No product data available</p>}
      </div>
    </CardContent>
  </Card>
);

const CustomerPurchaseReport = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        Customer Purchase Analysis
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data?.customers?.map((customer, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">{customer.name}</div>
              <div className="text-sm text-muted-foreground">{customer.petCount} pets</div>
            </div>
            <div className="text-right">
              <div className="font-bold">${customer.totalSpent}</div>
              <div className="text-sm text-muted-foreground">{customer.orderCount} orders</div>
            </div>
            <Badge variant={customer.loyaltyTier === 'gold' ? 'default' : 'secondary'}>
              {customer.loyaltyTier}
            </Badge>
          </div>
        )) || <p className="text-muted-foreground">No customer data available</p>}
      </div>
    </CardContent>
  </Card>
);

const PaymentMethodReport = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Method Distribution
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {data?.methods?.map((method, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span>{method.type}</span>
            </div>
            <div className="text-right">
              <div className="font-bold">{method.count}</div>
              <div className="text-sm text-muted-foreground">{method.percentage}%</div>
            </div>
          </div>
        )) || <p className="text-muted-foreground">No payment data available</p>}
      </div>
    </CardContent>
  </Card>
);

export function SalesReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('daily-sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { value: 'daily-sales', label: 'Daily Sales Summary', icon: Calendar },
    { value: 'weekly-sales', label: 'Weekly Sales Analysis', icon: BarChart3 },
    { value: 'monthly-revenue', label: 'Monthly Revenue Report', icon: TrendingUp },
    { value: 'product-performance', label: 'Product Performance', icon: Package },
    { value: 'customer-purchases', label: 'Customer Purchase History', icon: Users },
    { value: 'payment-methods', label: 'Payment Method Analysis', icon: CreditCard },
    { value: 'sales-trends', label: 'Sales Trends & Forecasting', icon: Activity },
    { value: 'discount-analysis', label: 'Discount & Promotion Impact', icon: Target }
  ];

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      const response = await fetch(`/api/reports/sales?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate report');
      }

      setReportData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format = 'pdf') => {
    try {
      const params = new URLSearchParams({
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format
      });

      const response = await fetch(`/api/reports/sales/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (reportType) {
      case 'daily-sales':
        return <DailySalesReport data={reportData} />;
      case 'weekly-sales':
        return <WeeklySalesReport data={reportData} />;
      case 'monthly-revenue':
        return <MonthlyRevenueReport data={reportData} />;
      case 'product-performance':
        return <ProductPerformanceReport data={reportData} />;
      case 'customer-purchases':
        return <CustomerPurchaseReport data={reportData} />;
      case 'payment-methods':
        return <PaymentMethodReport data={reportData} />;
      default:
        return <p className="text-muted-foreground">Select a report type to view data</p>;
    }
  };

  const selectedReport = reportTypes.find(r => r.value === reportType);
  const Icon = selectedReport?.icon || DollarSign;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Sales Reports
          </CardTitle>
          <CardDescription>
            Generate comprehensive sales analytics and performance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="flex gap-2">
                <Button onClick={generateReport} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                </Button>
                <Button variant="outline" onClick={() => exportReport('pdf')} disabled={!reportData}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        renderReportContent()
      )}
    </div>
  );
}
