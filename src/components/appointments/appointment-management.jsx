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
  Calendar, 
  Clock, 
  Users, 
  CheckCircle,
  RefreshCw,
  MoreHorizontal,
  Stethoscope,
  PawPrint
} from 'lucide-react';
import { AppointmentForm } from './appointment-form';
import { AppointmentDetail } from './appointment-detail';
import { AppointmentStats } from './appointment-stats';
import { AppointmentCalendar } from './appointment-calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showAppointmentDetail, setShowAppointmentDetail] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    startDate: '',
    endDate: '',
    assignedTo: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    count: 0,
    totalCount: 0
  });
  const [statistics, setStatistics] = useState({
    totalAppointments: 0,
    scheduledCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0
  });

  // Fetch appointments data
  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await fetch(`/api/appointments?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      setAppointments(data.data.appointments);
      setPagination(data.data.pagination);
      setStatistics(data.data.statistics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchAppointments(1);
    }
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetail(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to cancel appointment');
      }

      fetchAppointments(pagination.current);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completionNotes: 'Appointment completed successfully'
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to complete appointment');
      }

      alert('Appointment completed successfully!');
      fetchAppointments(pagination.current);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      scheduled: { variant: 'secondary', label: 'Scheduled' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      'in-progress': { variant: 'warning', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
      'no-show': { variant: 'outline', label: 'No Show' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { variant: 'outline', label: 'Low' },
      normal: { variant: 'secondary', label: 'Normal' },
      high: { variant: 'destructive', label: 'High' }
    };

    const config = priorityConfig[priority] || { variant: 'secondary', label: priority };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      checkup: <Stethoscope className="h-4 w-4" />,
      vaccination: <PawPrint className="h-4 w-4" />,
      surgery: <Stethoscope className="h-4 w-4" />,
      grooming: <PawPrint className="h-4 w-4" />,
      emergency: <Stethoscope className="h-4 w-4" />,
      other: <Calendar className="h-4 w-4" />
    };

    return typeIcons[type] || <Calendar className="h-4 w-4" />;
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.confirmedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.cancelledCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="appointments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Appointment Management</CardTitle>
                  <CardDescription>
                    Schedule and manage pet appointments
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAppointmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search appointments..."
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange('type', value === "all" ? "" : value)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => fetchAppointments(1)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {error && (
                <Alert className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Appointments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appointment #</TableHead>
                      <TableHead>Pet & Owner</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell className="font-medium">
                          {appointment.appointmentNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {getTypeIcon(appointment.type)}
                              {appointment.pet?.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {appointment.pet?.species} • {appointment.owner?.firstName} {appointment.owner?.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="capitalize">{appointment.type}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {appointment.time} ({appointment.duration}min)
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(appointment.priority)}
                        </TableCell>
                        <TableCell>
                          {appointment.assignedTo ? (
                            <div className="text-sm">
                              {appointment.assignedTo.firstName} {appointment.assignedTo.lastName}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewAppointment(appointment)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              {appointment.status === 'confirmed' && (
                                <DropdownMenuItem onClick={() => handleCompleteAppointment(appointment._id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete
                                </DropdownMenuItem>
                              )}
                              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                <DropdownMenuItem 
                                  onClick={() => handleCancelAppointment(appointment._id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancel
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
                    Showing {pagination.count} of {pagination.totalCount} appointments
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAppointments(pagination.current - 1)}
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
                      onClick={() => fetchAppointments(pagination.current + 1)}
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

        <TabsContent value="calendar">
          <AppointmentCalendar />
        </TabsContent>

        <TabsContent value="analytics">
          <AppointmentStats />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showAppointmentForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onClose={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(null);
          }}
          onSuccess={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(null);
            fetchAppointments(pagination.current);
          }}
        />
      )}

      {showAppointmentDetail && selectedAppointment && (
        <AppointmentDetail
          appointment={selectedAppointment}
          onClose={() => {
            setShowAppointmentDetail(false);
            setSelectedAppointment(null);
          }}
          onUpdate={() => {
            fetchAppointments(pagination.current);
          }}
        />
      )}
    </div>
  );
}