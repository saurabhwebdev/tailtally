'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/layout';
import AdminDashboard from '@/components/admin/admin-dashboard';
import UserManagement from '@/components/admin/user-management';
import RoleManagement from '@/components/admin/role-management';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Crown,
  UserCog,
  Shield,
  Sparkles
} from 'lucide-react';
import AuthLoading from '@/components/auth/auth-loading';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'dashboard';

  // Show loading state
  if (isLoading) {
    return <AuthLoading />;
  }

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Access denied. You must be an administrator to view this page.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl">
              <Sparkles className="h-10 w-10 text-amber-600" />
            </div>
            Administration Panel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive system administration tools. Manage users, roles, permissions, and monitor system performance.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue={defaultTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 h-auto p-1 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <TabsTrigger 
                value="dashboard" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-700"
              >
                <Crown className="h-5 w-5" />
                <span className="text-sm font-medium">Admin Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-700"
              >
                <UserCog className="h-5 w-5" />
                <span className="text-sm font-medium">User Management</span>
              </TabsTrigger>
              <TabsTrigger 
                value="roles" 
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-700"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Role Management</span>
              </TabsTrigger>
            </TabsList>

            {/* Admin Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Crown className="h-6 w-6 text-amber-600" />
                  System Overview
                </h2>
                <p className="text-muted-foreground">
                  Monitor system performance, user activity, and key metrics
                </p>
              </div>
              <AdminDashboard />
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <UserCog className="h-6 w-6 text-amber-600" />
                  User Management
                </h2>
                <p className="text-muted-foreground">
                  Manage user accounts, permissions, and user activity
                </p>
              </div>
              <UserManagement />
            </TabsContent>

            {/* Role Management Tab */}
            <TabsContent value="roles" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Shield className="h-6 w-6 text-amber-600" />
                  Role Management
                </h2>
                <p className="text-muted-foreground">
                  Configure roles, permissions, and access control
                </p>
              </div>
              <RoleManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
