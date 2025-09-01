'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

/**
 * PermissionGuard component to protect routes and components based on user roles and permissions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if permission check passes
 * @param {string|string[]} props.requiredRole - Required role(s) to access the content
 * @param {string|string[]} props.requiredPermission - Required permission(s) to access the content
 * @param {React.ReactNode} props.fallback - Custom fallback component when access is denied
 * @param {boolean} props.showLoadingSpinner - Whether to show loading spinner during auth check
 * @param {string} props.accessDeniedMessage - Custom access denied message
 * @param {boolean} props.redirectOnDenied - Whether to redirect when access is denied (future implementation)
 */
export default function PermissionGuard({
  children,
  requiredRole = null,
  requiredPermission = null,
  fallback = null,
  showLoadingSpinner = true,
  accessDeniedMessage = null,
  redirectOnDenied = false
}) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading state
  if (isLoading && showLoadingSpinner) {
    return (
      <div className="flex items-center justify-center min-h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return fallback || (
      <div className="flex items-center justify-center min-h-32">
        <Alert className="max-w-md">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            {accessDeniedMessage || 'You must be logged in to access this content.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Check role requirements
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = roles.includes(user.role);
    
    if (!hasRequiredRole) {
      return fallback || (
        <div className="flex items-center justify-center min-h-32">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {accessDeniedMessage || `Access denied. Required role: ${roles.join(' or ')}`}
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Check permission requirements
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    const hasRequiredPermissions = permissions.every(permission => 
      user.permissions && user.permissions.includes(permission)
    );
    
    if (!hasRequiredPermissions) {
      return fallback || (
        <div className="flex items-center justify-center min-h-32">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {accessDeniedMessage || 'Access denied. You do not have the required permissions.'}
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

/**
 * Higher-order component version of PermissionGuard
 * 
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {Object} options - Permission options
 * @returns {React.Component} Protected component
 */
export function withPermissionGuard(WrappedComponent, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <PermissionGuard {...options}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

/**
 * Hook to check permissions imperatively
 * 
 * @param {string|string[]} requiredRole - Required role(s)
 * @param {string|string[]} requiredPermission - Required permission(s)
 * @returns {Object} Permission check results
 */
export function usePermissionCheck(requiredRole = null, requiredPermission = null) {
  const { user, isAuthenticated, isLoading } = useAuth();

  const hasRole = (role) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.every(perm => user.permissions.includes(perm));
  };

  const canAccess = () => {
    if (!isAuthenticated || !user) return false;
    
    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) return false;
    
    // Check permission if required
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    
    return true;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasPermission,
    canAccess: canAccess(),
    // Helper methods for specific roles
    isAdmin: () => hasRole('admin'),
    isVeterinarian: () => hasRole('veterinarian'),
    isStaff: () => hasRole('staff'),
    isCustomer: () => hasRole('customer'),
    // Helper methods for common permission groups
    canManageUsers: () => hasPermission(['read_users', 'write_users']),
    canManagePets: () => hasPermission(['read_pets', 'write_pets']),
    canManageAppointments: () => hasPermission(['read_appointments', 'write_appointments']),
    canViewReports: () => hasPermission('view_reports'),
    canManageSystem: () => hasPermission('manage_system')
  };
}

/**
 * Component to conditionally render content based on permissions
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {string|string[]} props.role - Required role(s)
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {React.ReactNode} props.fallback - Content to render if permission check fails
 */
export function ConditionalRender({ children, role = null, permission = null, fallback = null }) {
  const { canAccess } = usePermissionCheck(role, permission);
  
  return canAccess ? <>{children}</> : (fallback || null);
}

/**
 * Admin-only wrapper component
 */
export function AdminOnly({ children, fallback = null }) {
  return (
    <PermissionGuard 
      requiredRole="admin" 
      fallback={fallback}
      accessDeniedMessage="Access denied. Administrator privileges required."
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Staff and above wrapper component (staff, veterinarian, admin)
 */
export function StaffOnly({ children, fallback = null }) {
  return (
    <PermissionGuard 
      requiredRole={['staff', 'veterinarian', 'admin']} 
      fallback={fallback}
      accessDeniedMessage="Access denied. Staff privileges required."
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Veterinarian and above wrapper component (veterinarian, admin)
 */
export function VeterinarianOnly({ children, fallback = null }) {
  return (
    <PermissionGuard 
      requiredRole={['veterinarian', 'admin']} 
      fallback={fallback}
      accessDeniedMessage="Access denied. Veterinarian privileges required."
    >
      {children}
    </PermissionGuard>
  );
}