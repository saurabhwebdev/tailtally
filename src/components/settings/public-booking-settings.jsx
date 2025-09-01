'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, Settings2, Users, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PublicBookingSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    enabled: false,
    title: 'Book an Appointment',
    description: 'Schedule your pet appointment online',
    requireOwnerRegistration: false,
    autoConfirm: false,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 24,
    maxBookingsPerDay: 20,
    availableServices: [],
    workingDays: [],
    requiredFields: {
      ownerName: true,
      ownerEmail: true,
      ownerPhone: true,
      petName: true,
      petSpecies: true,
      petBreed: false,
      petAge: false,
      reason: true
    },
    notifications: {
      sendConfirmationEmail: true,
      sendReminderEmail: true,
      reminderHoursBefore: 24
    },
    confirmationMessage: 'Thank you for booking! We will contact you shortly to confirm your appointment.',
    termsAndConditions: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/public-booking', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to load public booking settings', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/public-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('Public booking settings saved successfully', 'success');
        }
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to save settings', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/settings/public-booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabled: !settings.enabled })
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(`Public booking ${!settings.enabled ? 'enabled' : 'disabled'}`, 'success');
        }
      }
    } catch (error) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('Failed to toggle public booking', 'error');
      }
    }
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...settings.availableServices];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setSettings(prev => ({ ...prev, availableServices: updatedServices }));
  };

  const updateWorkingDay = (index, field, value) => {
    const updatedDays = [...settings.workingDays];
    updatedDays[index] = { ...updatedDays[index], [field]: value };
    setSettings(prev => ({ ...prev, workingDays: updatedDays }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Enable/Disable Toggle */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Public Booking System</h3>
            <p className="text-sm text-muted-foreground">
              Allow customers to book appointments online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            settings.enabled 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {settings.enabled ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Active
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Inactive
              </>
            )}
          </span>
          <Switch
            checked={settings.enabled}
            onCheckedChange={toggleEnabled}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
      </div>

      {/* Public Booking URL */}
      {settings.enabled && (
        <Card className="border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Public Booking URL</p>
                <p className="text-xs text-muted-foreground mt-1">Share this link with your customers</p>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1 bg-background rounded text-sm">
                  {typeof window !== 'undefined' ? `${window.location.origin}/book-appointment` : '/book-appointment'}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `${window.location.origin}/book-appointment`;
                    navigator.clipboard.writeText(url);
                    if (typeof window !== 'undefined' && window.showToast) {
                      window.showToast('URL copied to clipboard', 'success');
                    }
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="form">Form Fields</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Booking Page Title</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Book an Appointment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Schedule your pet appointment online"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmationMessage">Confirmation Message</Label>
                <Textarea
                  id="confirmationMessage"
                  value={settings.confirmationMessage}
                  onChange={(e) => setSettings(prev => ({ ...prev, confirmationMessage: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBookingDays">Max Advance Booking (days)</Label>
                  <Input
                    id="maxAdvanceBookingDays"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.maxAdvanceBookingDays}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceBookingDays: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minAdvanceBookingHours">Min Advance Booking (hours)</Label>
                  <Input
                    id="minAdvanceBookingHours"
                    type="number"
                    min="0"
                    value={settings.minAdvanceBookingHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, minAdvanceBookingHours: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBookingsPerDay">Max Bookings Per Day</Label>
                <Input
                  id="maxBookingsPerDay"
                  type="number"
                  min="1"
                  value={settings.maxBookingsPerDay}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxBookingsPerDay: parseInt(e.target.value) }))}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Confirm Bookings</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically confirm appointments without manual review
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoConfirm}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoConfirm: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Owner Registration</Label>
                    <p className="text-xs text-muted-foreground">
                      Require owners to be registered before booking
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireOwnerRegistration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireOwnerRegistration: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Settings */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Available Services</h4>
                {settings.availableServices?.map((service, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={(checked) => updateService(index, 'enabled', checked)}
                    />
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                      />
                      <Input
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                      <Input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateService(index, 'duration', parseInt(e.target.value))}
                        placeholder="Duration (min)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Settings */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Working Days & Hours</h4>
                {settings.workingDays?.map((day, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <Switch
                      checked={day.enabled}
                      onCheckedChange={(checked) => updateWorkingDay(index, 'enabled', checked)}
                    />
                    <div className="w-32 font-medium">{day.day}</div>
                    {day.enabled && (
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Available time slots: {day.timeSlots?.filter(t => t.available).length || 0}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Fields Settings */}
        <TabsContent value="form" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Required Fields</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.requiredFields || {}).map(([field, required]) => (
                    <div key={field} className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <Switch
                        checked={required}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            requiredFields: { ...prev.requiredFields, [field]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Send Confirmation Email</Label>
                    <Switch
                      checked={settings.notifications?.sendConfirmationEmail}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sendConfirmationEmail: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Send Reminder Email</Label>
                    <Switch
                      checked={settings.notifications?.sendReminderEmail}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sendReminderEmail: checked }
                        }))
                      }
                    />
                  </div>
                  {settings.notifications?.sendReminderEmail && (
                    <div className="space-y-2">
                      <Label>Reminder Hours Before</Label>
                      <Input
                        type="number"
                        min="1"
                        value={settings.notifications?.reminderHoursBefore}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, reminderHoursBefore: parseInt(e.target.value) }
                          }))
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
