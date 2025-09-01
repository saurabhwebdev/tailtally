'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/dashboard/layout';
import EmailSettingsForm from '@/components/settings/email-settings-form';
import PublicBookingSettings from '@/components/settings/public-booking-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Mail, Globe, Sparkles } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'email';

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
                <Sparkles className="h-10 w-10 text-blue-600" />
              </div>
              System Settings
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Configure your system settings and preferences. Manage email integration, public booking, and more.
            </p>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue={defaultTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2 h-auto p-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <TabsTrigger 
                  value="email" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-blue-700"
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-medium">Email Configuration</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="booking" 
                  className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-blue-700"
                >
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-medium">Public Booking</span>
                </TabsTrigger>
              </TabsList>

              {/* Email Settings Tab */}
              <TabsContent value="email" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Mail className="h-6 w-6 text-blue-600" />
                    Email Configuration
                  </h2>
                  <p className="text-muted-foreground">
                    Configure Gmail integration for sending system emails and notifications
                  </p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-card shadow-lg rounded-lg border">
                    <div className="p-6">
                      <EmailSettingsForm />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Public Booking Tab */}
              <TabsContent value="booking" className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Globe className="h-6 w-6 text-blue-600" />
                    Public Appointment Booking
                  </h2>
                  <p className="text-muted-foreground">
                    Manage public-facing appointment booking system for customers
                  </p>
                </div>
                <div className="max-w-6xl mx-auto">
                  <div className="bg-card shadow-lg rounded-lg border">
                    <div className="p-6">
                      <PublicBookingSettings />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
