'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Users,
  Shield,
  BarChart3,
  TrendingUp,
  UserPlus,
  Activity,
  Database,
  Clock,
  AlertTriangle,
  CheckCircle,
  Crown,
  UserCog,
  Briefcase,
  ShoppingCart
} from 'lucide-react';
import UserManagement from './user-management';
import RoleManagement from './role-management';

const ADMIN_TABS = [
  {
    id: 'overview',
    name: 'Overview',
    icon: BarChart3,
    description: 'System statistics and quick actions'
  },
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    description: 'Manage users, accounts, and profiles'
  },
  {
    id: 'roles',
    name: 'Role & Permissions',
    icon: Shield,
    description: 'Configure roles and permission matrices'
  },
  {
    id: 'system',
    name: 'System Settings',
    icon: Settings,
    description: 'Application configuration and preferences'
  }
];

const ROLE_ICONS = {
  admin: Crown,
  veterinarian: UserCog,
  staff: Briefcase,
  customer: ShoppingCart
};

const ROLE_COLORS = {
  admin: 'bg-red-500',
  veterinarian: 'bg-blue-500',
  staff: 'bg-green-500',
  customer: 'bg-gray-500'
};

export default function AdminDashboard() {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPets: 0,
    totalAppointments: 0,
    usersByRole: {},
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is admin
  if (!hasRole('admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You must be an administrator to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      setLoading(true);

      // Fetch users data using auth context's apiRequest
      const usersData = await apiRequest('/api/users');

      if (usersData.success) {
        const users = usersData.data.users || [];
        const activeUsers = users.filter(user => user.isActive).length;
        
        // Count users by role
        const usersByRole = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        setSystemStats(prev => ({
          ...prev,
          totalUsers: users.length,
          activeUsers: activeUsers,
          usersByRole: usersByRole
        }));
      }

      // You can add more API calls here for pets, appointments, etc.
      // For now, we'll use placeholder data

      setSystemStats(prev => ({
        ...prev,
        totalPets: 245, // Placeholder
        totalAppointments: 89, // Placeholder
        recentActivity: [
          { id: 1, action: 'New user registered', user: 'john.doe@example.com', time: '2 minutes ago', type: 'user' },
          { id: 2, action: 'Pet profile updated', user: 'sarah.smith@example.com', time: '15 minutes ago', type: 'pet' },
          { id: 3, action: 'Appointment scheduled', user: 'mike.wilson@example.com', time: '1 hour ago', type: 'appointment' },
          { id: 4, action: 'Role permissions updated', user: 'admin@tailtally.com', time: '2 hours ago', type: 'admin' }
        ]
      }));

    } catch (err) {
      setError('Failed to fetch system statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStats();
  }, []);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={systemStats} loading={loading} />;
      case 'users':
        return <UserManagement />;
      case 'roles':
        return <RoleManagement />;
      case 'system':
        return <SystemSettingsTab />;
      default:
        return <OverviewTab stats={systemStats} loading={loading} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border rounded-lg shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Settings className="h-7 w-7 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage your TailTally system</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-red-700 border-red-300">
                <Crown className="h-3 w-3 mr-1" />
                Administrator
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t">
          <div className="px-6">
            <nav className="flex space-x-8">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.name}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {renderTabContent()}
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pets</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPets}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  15 new this week
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  12 today
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">Healthy</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  All systems operational
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Database className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.usersByRole).map(([role, count]) => {
                const Icon = ROLE_ICONS[role] || Users;
                const percentage = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0;
                
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${ROLE_COLORS[role]} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{role}</p>
                        <p className="text-sm text-gray-500">{percentage}% of users</p>
                      </div>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className={`p-1 rounded-full flex-shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-100' :
                    activity.type === 'pet' ? 'bg-purple-100' :
                    activity.type === 'appointment' ? 'bg-green-100' :
                    'bg-red-100'
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      activity.type === 'user' ? 'bg-blue-600' :
                      activity.type === 'pet' ? 'bg-purple-600' :
                      activity.type === 'appointment' ? 'bg-green-600' :
                      'bg-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.user}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <UserPlus className="h-5 w-5" />
              <span className="text-sm">Add User</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Manage Roles</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Settings className="h-5 w-5" />
              <span className="text-sm">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// System Settings Tab Component
function SystemSettingsTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure application preferences and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600">System configuration panel coming soon...</p>
            <p className="text-sm text-gray-500 mt-2">
              This section will include application settings, email configuration, 
              security policies, and other system-wide preferences.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}