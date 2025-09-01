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
  Calendar, 
  Clock, 
  Users, 
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  RefreshCw,
  FileText,
  Target,
  DollarSign
} from 'lucide-react';

export function AppointmentReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('daily-schedule');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { value: 'daily-schedule', label: 'Daily Appointment Schedule', icon: Calendar },
    { value: 'weekly-summary', label: 'Weekly Appointment Summary', icon: Clock },
    { value: 'monthly-metrics', label: 'Monthly Performance Metrics', icon: BarChart3 },
    { value: 'staff-workload', label: 'Staff Workload Analysis', icon: Users },
    { value: 'type-distribution', label: 'Appointment Type Distribution', icon: PieChart },
    { value: 'cancellation-rate', label: 'Cancellation Rate Analysis', icon: TrendingUp },
    { value: 'revenue-by-type', label: 'Revenue by Appointment Type', icon: DollarSign },
    { value: 'customer-retention', label: 'Customer Retention Metrics', icon: Target }
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

      const response = await fetch(`/api/reports/appointments?${params}`);
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

      const response = await fetch(`/api/reports/appointments/export?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `appointment-report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`;
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
      case 'daily-schedule':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Daily Appointment Schedule
              </CardTitle>
              <CardDescription>
                {new Date(dateRange.startDate).toLocaleDateString()} - {reportData.appointments?.length || 0} appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.appointments?.map((apt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">{apt.time}</div>
                      <div>
                        <div className="font-medium">{apt.pet?.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {apt.owner?.firstName} {apt.owner?.lastName} • {apt.type}
                        </div>
                      </div>
                    </div>
                    <Badge variant={apt.status === 'completed' ? 'success' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>
                )) || <p className="text-muted-foreground">No appointments scheduled</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 'weekly-summary':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Appointments</span>
                    <span className="font-bold">{reportData.summary?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-bold text-green-600">{reportData.summary?.completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cancelled</span>
                    <span className="font-bold text-red-600">{reportData.summary?.cancelled || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>No Shows</span>
                    <span className="font-bold text-orange-600">{reportData.summary?.noShow || 0}</span>
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
                  {reportData.dailyBreakdown?.map((day, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{day.date}</span>
                      <span className="font-medium">{day.count}</span>
                    </div>
                  )) || <p className="text-muted-foreground">No data available</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'monthly-metrics':
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold">{reportData.metrics?.totalAppointments || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Appointments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {reportData.metrics?.completionRate || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {reportData.metrics?.averageDuration || 0}min
                    </div>
                    <div className="text-sm text-muted-foreground">Average Duration</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      +{reportData.growth?.appointmentGrowth || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">vs Previous Month</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">
                      +{reportData.growth?.revenueGrowth || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Revenue Growth</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Peak day: {reportData.insights?.peakDay || 'N/A'}</p>
                  <p>• Most common type: {reportData.insights?.popularType || 'N/A'}</p>
                  <p>• Best performing staff: {reportData.insights?.topStaff || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'staff-workload':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Staff Workload Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.staffWorkload?.map((staff, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-muted-foreground">{staff.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{staff.totalAppointments}</div>
                      <div className="text-sm text-muted-foreground">appointments</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{staff.completionRate}%</div>
                      <div className="text-sm text-muted-foreground">completion</div>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No staff data available</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 'type-distribution':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Appointment Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.typeDistribution?.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span className="capitalize">{type.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{type.count}</div>
                      <div className="text-sm text-muted-foreground">{type.percentage}%</div>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No type data available</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 'cancellation-rate':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cancellation Rate Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold text-red-600">
                      {reportData.cancellationRate?.overall || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Overall Cancellation Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {reportData.cancellationRate?.noShow || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">No-Show Rate</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Reasons for Cancellation</h4>
                  {reportData.cancellationReasons?.map((reason, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{reason.reason}</span>
                      <span className="text-sm font-medium">{reason.count}</span>
                    </div>
                  )) || <p className="text-sm text-muted-foreground">No cancellation data</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'revenue-by-type':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue by Appointment Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.revenueByType?.map((type, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium capitalize">{type.type}</div>
                      <div className="text-sm text-muted-foreground">{type.count} appointments</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${type.revenue}</div>
                      <div className="text-sm text-muted-foreground">${type.averageRevenue}/apt</div>
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No revenue data available</p>}
              </div>
            </CardContent>
          </Card>
        );

      case 'customer-retention':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Customer Retention Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {reportData.retention?.returnRate || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Return Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {reportData.retention?.averageVisits || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Visits/Customer</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {reportData.retention?.newCustomers || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">New Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <p className="text-muted-foreground">Select a report type to view data</p>;
    }
  };

  const selectedReport = reportTypes.find(r => r.value === reportType);
  const Icon = selectedReport?.icon || FileText;

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Appointment Reports
          </CardTitle>
          <CardDescription>
            Generate comprehensive reports for appointment management and analysis
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