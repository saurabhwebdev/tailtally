'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Shield,
  Settings,
  Users,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Check,
  X,
  AlertTriangle,
  Crown,
  UserCog,
  Briefcase,
  ShoppingCart,
  Lock,
  Unlock,
  Calendar,
  Package,
  FileText,
  Bell,
  CreditCard
} from 'lucide-react';

const ROLE_DEFINITIONS = {
  admin: {
    name: 'Administrator',
    description: 'Full system access with all permissions including user management and system configuration',
    icon: Crown,
    color: 'bg-red-500',
    textColor: 'text-red-700',
    borderColor: 'border-red-300',
    defaultPermissions: [
      'read_pets', 'write_pets', 'delete_pets',
      'read_users', 'write_users', 'delete_users',
      'read_owners', 'write_owners', 'delete_owners',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records', 'delete_medical_records',
      'read_inventory', 'write_inventory', 'delete_inventory', 'manage_stock',
      'read_sales', 'write_sales', 'delete_sales', 'process_payments',
      'read_invoices', 'write_invoices', 'delete_invoices',
      'manage_notifications', 'send_notifications',
      'manage_system', 'view_reports', 'manage_billing', 'access_admin'
    ]
  },
  veterinarian: {
    name: 'Veterinarian',
    description: 'Medical professional with full patient care access, medical records, and billing capabilities',
    icon: UserCog,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-300',
    defaultPermissions: [
      'read_pets', 'write_pets',
      'read_owners', 'write_owners',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records',
      'read_inventory', 'write_inventory',
      'read_sales', 'write_sales', 'process_payments',
      'read_invoices', 'write_invoices',
      'send_notifications',
      'view_reports', 'manage_billing'
    ]
  },
  staff: {
    name: 'Staff',
    description: 'Front desk and support staff with appointment scheduling, inventory, and sales access',
    icon: Briefcase,
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    defaultPermissions: [
      'read_pets', 'write_pets',
      'read_owners', 'write_owners',
      'read_appointments', 'write_appointments',
      'read_medical_records',
      'read_inventory', 'write_inventory', 'manage_stock',
      'read_sales', 'write_sales', 'process_payments',
      'read_invoices', 'write_invoices',
      'manage_billing'
    ]
  },
  customer: {
    name: 'Customer',
    description: 'Pet owners with access to their own pet information, appointments, and owner details',
    icon: ShoppingCart,
    color: 'bg-gray-500',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
    defaultPermissions: [
      'read_pets', 'read_owners', 'read_appointments'
    ]
  }
};

const PERMISSION_DEFINITIONS = {
  read_pets: { name: 'View Pets', category: 'pets', description: 'View pet information and profiles' },
  write_pets: { name: 'Manage Pets', category: 'pets', description: 'Create and edit pet information' },
  delete_pets: { name: 'Delete Pets', category: 'pets', description: 'Remove pet records from system' },
  
  read_users: { name: 'View Users', category: 'users', description: 'View user accounts and profiles' },
  write_users: { name: 'Manage Users', category: 'users', description: 'Create and edit user accounts' },
  delete_users: { name: 'Delete Users', category: 'users', description: 'Remove user accounts from system' },
  
  read_owners: { name: 'View Owners', category: 'owners', description: 'View pet owner information' },
  write_owners: { name: 'Manage Owners', category: 'owners', description: 'Create and edit owner profiles' },
  delete_owners: { name: 'Delete Owners', category: 'owners', description: 'Remove owner records from system' },
  
  read_appointments: { name: 'View Appointments', category: 'appointments', description: 'View appointment schedules' },
  write_appointments: { name: 'Manage Appointments', category: 'appointments', description: 'Create and edit appointments' },
  delete_appointments: { name: 'Cancel Appointments', category: 'appointments', description: 'Cancel and remove appointments' },
  
  read_medical_records: { name: 'View Medical Records', category: 'medical', description: 'Access patient medical histories' },
  write_medical_records: { name: 'Update Medical Records', category: 'medical', description: 'Create and edit medical records' },
  delete_medical_records: { name: 'Delete Medical Records', category: 'medical', description: 'Remove medical records' },
  
  read_inventory: { name: 'View Inventory', category: 'inventory', description: 'View product inventory and stock levels' },
  write_inventory: { name: 'Manage Inventory', category: 'inventory', description: 'Add and edit inventory items' },
  delete_inventory: { name: 'Delete Inventory', category: 'inventory', description: 'Remove inventory items' },
  manage_stock: { name: 'Stock Management', category: 'inventory', description: 'Adjust stock levels and manage purchases' },
  
  read_sales: { name: 'View Sales', category: 'sales', description: 'View sales transactions and history' },
  write_sales: { name: 'Process Sales', category: 'sales', description: 'Create and manage sales transactions' },
  delete_sales: { name: 'Cancel Sales', category: 'sales', description: 'Cancel and refund sales transactions' },
  process_payments: { name: 'Process Payments', category: 'sales', description: 'Handle payment processing and refunds' },
  
  read_invoices: { name: 'View Invoices', category: 'invoices', description: 'View invoices and billing information' },
  write_invoices: { name: 'Manage Invoices', category: 'invoices', description: 'Create and edit invoices' },
  delete_invoices: { name: 'Delete Invoices', category: 'invoices', description: 'Remove invoices from system' },
  
  manage_notifications: { name: 'Notification Management', category: 'notifications', description: 'Manage system notifications and alerts' },
  send_notifications: { name: 'Send Notifications', category: 'notifications', description: 'Send notifications to users and customers' },
  
  manage_system: { name: 'System Management', category: 'system', description: 'Configure system settings and preferences' },
  view_reports: { name: 'View Reports', category: 'reports', description: 'Access analytics and business reports' },
  manage_billing: { name: 'Billing Management', category: 'billing', description: 'Handle payments and billing operations' },
  access_admin: { name: 'Admin Access', category: 'system', description: 'Access administrative functions and controls' }
};

const PERMISSION_CATEGORIES = {
  pets: { name: 'Pet Management', icon: Users, color: 'bg-purple-500 text-white' },
  users: { name: 'User Management', icon: UserCog, color: 'bg-blue-500 text-white' },
  owners: { name: 'Owner Management', icon: Users, color: 'bg-cyan-500 text-white' },
  appointments: { name: 'Appointments', icon: Calendar, color: 'bg-green-500 text-white' },
  medical: { name: 'Medical Records', icon: Briefcase, color: 'bg-red-500 text-white' },
  inventory: { name: 'Inventory', icon: Package, color: 'bg-orange-500 text-white' },
  sales: { name: 'Sales & POS', icon: ShoppingCart, color: 'bg-emerald-500 text-white' },
  invoices: { name: 'Invoicing', icon: FileText, color: 'bg-violet-500 text-white' },
  notifications: { name: 'Notifications', icon: Bell, color: 'bg-amber-500 text-white' },
  system: { name: 'System', icon: Settings, color: 'bg-yellow-500 text-white' },
  reports: { name: 'Reports', icon: Eye, color: 'bg-indigo-500 text-white' },
  billing: { name: 'Billing', icon: CreditCard, color: 'bg-pink-500 text-white' }
};

export default function RoleManagement() {
  const { user: currentUser, hasRole } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleStats, setRoleStats] = useState({});

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

  // Fetch role statistics
  const fetchRoleStats = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        const users = data.data.users || [];
        const stats = {};
        
        Object.keys(ROLE_DEFINITIONS).forEach(role => {
          stats[role] = users.filter(user => user.role === role).length;
        });
        
        setRoleStats(stats);
      }
    } catch (err) {
      console.error('Failed to fetch role statistics:', err);
    }
  };

  // Initialize roles and fetch stats
  useEffect(() => {
    const initializeRoles = () => {
      const roleList = Object.entries(ROLE_DEFINITIONS).map(([key, definition]) => ({
        id: key,
        ...definition
      }));
      setRoles(roleList);
      setLoading(false);
    };

    initializeRoles();
    fetchRoleStats();
  }, []);

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group permissions by category
  const getPermissionsByCategory = (permissions) => {
    const grouped = {};
    permissions.forEach(permission => {
      const category = PERMISSION_DEFINITIONS[permission]?.category || 'other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    return grouped;
  };

  // Handle view permissions
  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  // Get role badge variant
  const getRoleBadgeProps = (roleId) => {
    const role = ROLE_DEFINITIONS[roleId];
    return {
      className: `${role.color} text-white border-0`
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Role & Permission Management
          </h1>
          <p className="text-gray-600 mt-1">Define roles and manage permission matrices</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search Roles</CardTitle>
            <CardDescription>Find roles by name or description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Role Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Current user count by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(roleStats).map(([roleId, count]) => {
                const role = ROLE_DEFINITIONS[roleId];
                const Icon = role.icon;
                return (
                  <div key={roleId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${role.color} text-white`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium">{role.name}</span>
                    </div>
                    <Badge variant="outline">{count || 0}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredRoles.map((role) => {
          const Icon = role.icon;
          const userCount = roleStats[role.id] || 0;
          
          return (
            <Card key={role.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${role.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge {...getRoleBadgeProps(role.id)}>
                    {userCount} {userCount === 1 ? 'user' : 'users'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <CardDescription className="text-sm">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      Permissions ({role.defaultPermissions.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.defaultPermissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {PERMISSION_DEFINITIONS[permission]?.name || permission}
                        </Badge>
                      ))}
                      {role.defaultPermissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.defaultPermissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPermissions(role)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions Matrix Modal */}
      <Dialog open={showPermissionsModal} onOpenChange={setShowPermissionsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRole && (
                <>
                  <div className={`p-2 rounded-lg ${selectedRole.color} text-white`}>
                    <selectedRole.icon className="h-5 w-5" />
                  </div>
                  {selectedRole.name} - Permission Matrix
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Detailed view of all permissions assigned to this role
            </DialogDescription>
          </DialogHeader>
          
          {selectedRole && (
            <div className="py-4">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Role Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRole.description}
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(getPermissionsByCategory(selectedRole.defaultPermissions)).map(([category, permissions]) => {
                  const categoryInfo = PERMISSION_CATEGORIES[category];
                  const CategoryIcon = categoryInfo?.icon || Settings;
                  
                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <CategoryIcon className="h-4 w-4" />
                        <h4 className="font-medium">{categoryInfo?.name || category}</h4>
                        <Badge variant="outline" className={categoryInfo?.color}>
                          {permissions.length} {permissions.length === 1 ? 'permission' : 'permissions'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => {
                          const permInfo = PERMISSION_DEFINITIONS[permission];
                          return (
                            <div key={permission} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-green-800">
                                  {permInfo?.name || permission}
                                </div>
                                <div className="text-xs text-green-600">
                                  {permInfo?.description || 'No description available'}
                                </div>
                              </div>
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* All Permissions Overview */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-4">All System Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.entries(PERMISSION_DEFINITIONS).map(([permission, info]) => {
                    const hasPermission = selectedRole.defaultPermissions.includes(permission);
                    
                    return (
                      <div 
                        key={permission}
                        className={`flex items-center space-x-2 p-2 rounded text-sm ${
                          hasPermission 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {hasPermission ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <X className="h-3 w-3 text-gray-400" />
                        )}
                        <span className="flex-1">{info.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}