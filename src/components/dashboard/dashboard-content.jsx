'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Calendar, 
  PawPrint, 
  Users, 
  DollarSign, 
  BarChart3, 
  Plus, 
  FileText, 
  Package,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Receipt,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getModernAvatarUrl, getUserInitials, generateModernAvatarHttpUrl } from '@/lib/modern-avatar'

// Chart colors for consistent theming
const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// Utility functions for formatting
const formatCurrencyUtil = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

const formatNumberUtil = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0)
}

// Removed old static stats array - now using dynamic data from API

const quickActions = [
  { title: "Schedule Appointment", icon: Calendar, color: "bg-blue-500", href: "/appointments/new" },
  { title: "Add New Pet", icon: PawPrint, color: "bg-green-500", href: "/pets/new" },
  { title: "View Reports", icon: BarChart3, color: "bg-purple-500", href: "/reports" },
  { title: "Manage Inventory", icon: Package, color: "bg-orange-500", href: "/inventory" }
]

const recentActivities = [
  {
    id: 1,
    action: "New appointment scheduled",
    pet: "Luna (Golden Retriever)",
    time: "2 minutes ago",
    user: "Dr. Sarah Johnson",
    userEmail: "sarah.johnson@example.com",
    type: "appointment"
  },
  {
    id: 2,
    action: "Vaccination completed",
    pet: "Max (Labrador)",
    time: "15 minutes ago",
    user: "Dr. Mike Chen",
    userEmail: "mike.chen@example.com",
    type: "treatment"
  },
  {
    id: 3,
    action: "New pet registered",
    pet: "Bella (Persian Cat)",
    time: "1 hour ago",
    user: "Reception",
    userEmail: "reception@example.com",
    type: "registration"
  },
  {
    id: 4,
    action: "Invoice payment received",
    pet: "Charlie (Beagle)",
    time: "2 hours ago",
    user: "Billing System",
    userEmail: "billing@example.com",
    type: "payment"
  }
]

// Appointments will come from the API

export default function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pets: { total: 0, recent: 0, upcomingVaccinations: 0, bySpecies: [] },
    users: { totalCustomers: 0 },
    sales: null,
    inventory: null,
    invoices: null,
    recentActivities: [],
    todaysAppointments: [],
    topProducts: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading dashboard: {error}
            <Button onClick={fetchStats} className="mt-2 ml-2" size="sm">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate growth percentages
  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Minimal Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Link href="/reports">
            <Button size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              View Reports
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics - Modern Minimal Design */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              {stats.sales?.growthPercent > 0 ? (
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+{stats.sales?.growthPercent || 12}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>{stats.sales?.growthPercent || -5}%</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Revenue</p>
              <p className="text-2xl font-semibold">
                {formatCurrencyUtil(stats.sales?.monthlyRevenue || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary" className="text-xs">
                Today
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Appointments</p>
              <p className="text-2xl font-semibold">
                {stats.todaysAppointments?.length || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Pets Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <PawPrint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center text-green-600 text-sm">
                <Plus className="h-4 w-4 mr-1" />
                <span>{stats.pets?.recent || 0}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Pets</p>
              <p className="text-2xl font-semibold">
                {formatNumberUtil(stats.pets?.total || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert Card */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              {(stats.inventory?.lowStockItems || 0) > 0 && (
                <Badge variant="destructive" className="text-xs">
                  Alert
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Low Stock Items</p>
              <p className="text-2xl font-semibold">
                {stats.inventory?.lowStockItems || 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Revenue Overview</CardTitle>
              <CardDescription>Last 7 days performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart 
                  data={stats.sales?.dailyTrend?.map(item => ({
                    date: `${item._id.month}/${item._id.day}`,
                    revenue: item.revenue
                  })) || []}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    formatter={(value) => [formatCurrencyUtil(value), 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                  <CardDescription>Latest sales and payments</CardDescription>
                </div>
                <Link href="/sales">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { customer: 'John Doe', service: 'Pet Grooming', date: 'Today, 2:30 PM', amount: 2500 },
                    { customer: 'Sarah Smith', service: 'Vaccination', date: 'Today, 11:00 AM', amount: 1200 },
                    { customer: 'Mike Johnson', service: 'Health Checkup', date: 'Yesterday', amount: 3000 },
                    { customer: 'Emma Wilson', service: 'Pet Boarding', date: 'Yesterday', amount: 5000 },
                    { customer: 'David Brown', service: 'Surgery', date: '2 days ago', amount: 15000 }
                  ].map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{transaction.customer}</TableCell>
                      <TableCell>{transaction.service}</TableCell>
                      <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrencyUtil(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {[
                { title: 'New Appointment', icon: Calendar, href: '/appointments/new', color: 'text-blue-600' },
                { title: 'Add Pet', icon: PawPrint, href: '/pets/new', color: 'text-green-600' },
                { title: 'Create Invoice', icon: FileText, href: '/invoices/new', color: 'text-purple-600' },
                { title: 'Add Inventory', icon: Package, href: '/inventory/new', color: 'text-orange-600' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Icon className={`h-4 w-4 mr-2 ${action.color}`} />
                      {action.title}
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Today's Schedule</CardTitle>
                <Badge variant="secondary">
                  {stats.todaysAppointments?.length || 0}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.todaysAppointments?.length > 0 ? (
                  stats.todaysAppointments.slice(0, 5).map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{apt.time}</p>
                        <p className="text-xs text-muted-foreground">{apt.pet} • {apt.owner}</p>
                      </div>
                      <Badge variant={apt.type === 'Emergency' ? 'destructive' : 'default'} className="text-xs">
                        {apt.type}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No appointments today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Inventory Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { item: 'Rabies Vaccine', stock: 5, status: 'critical' },
                  { item: 'Pet Shampoo', stock: 12, status: 'low' },
                  { item: 'Flea Treatment', stock: 8, status: 'low' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.stock} units left</p>
                    </div>
                    <Badge 
                      variant={item.status === 'critical' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>
              Latest updates from your clinic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              // Generate avatar URL using modern avatar system
              const avatarUrl = generateModernAvatarHttpUrl(activity.userEmail || activity.user, 'lorelei', 40);
              return (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.pet}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>
              Upcoming appointments for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.todaysAppointments && stats.todaysAppointments.length > 0 ? (
              stats.todaysAppointments.map((appointment, index) => (
                <div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold">{appointment.time}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {appointment.pet}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.owner}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={
                      appointment.priority === 'high' ? 'destructive' : 
                      appointment.priority === 'low' ? 'secondary' : 'default'
                    }
                    className="text-xs"
                  >
                    {appointment.type}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover-lift">
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No appointments scheduled for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Trend Chart */}
          {stats.sales && stats.sales?.dailyTrend && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart 
                    data={stats.sales?.dailyTrend.map(item => ({
                      date: `${item._id.month}/${item._id.day}`,
                      revenue: item.revenue
                    })) || []}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrencyUtil(value), 'Revenue']} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

        {/* Inventory Categories Chart */}
          {stats.inventory && stats.inventory?.categoryBreakdown && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.inventory?.categoryBreakdown.map(item => ({
                        name: item._id,
                        value: item.totalValue
                      })) || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {(stats.inventory?.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatCurrencyUtil(value), 'Value']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pet Species Distribution */}
          {stats.pets && stats.pets?.bySpecies && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5" />
                  Pet Species Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={Object.entries(stats.pets?.bySpecies || {}).map(([species, count]) => ({
                      species,
                      count
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="species" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

        {/* Invoice Status Overview */}
        {stats.invoices && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Invoices</span>
                    <span className="text-lg font-bold">{formatNumberUtil(stats.invoices?.totalInvoices || 0)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Paid</span>
                      <span>{formatNumberUtil(stats.invoices?.paidInvoices || 0)}</span>
                    </div>
                    <Progress value={((stats.invoices?.paidInvoices || 0) / (stats.invoices?.totalInvoices || 1)) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-yellow-600">Pending</span>
                      <span>{formatNumberUtil(stats.invoices?.pendingInvoices || 0)}</span>
                    </div>
                    <Progress value={((stats.invoices?.pendingInvoices || 0) / (stats.invoices?.totalInvoices || 1)) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-600">Overdue</span>
                      <span>{formatNumberUtil(stats.invoices?.overdueInvoices || 0)}</span>
                    </div>
                    <Progress value={((stats.invoices?.overdueInvoices || 0) / (stats.invoices?.totalInvoices || 1)) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Collection Rate</span>
                      <span className="font-medium text-green-600">
                        {stats.invoices?.collectionRate || 0}%
                      </span>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export { DashboardContent }