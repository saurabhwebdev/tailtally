'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children, requiredPermissions = [] }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Simple auth check - you can replace this with your actual auth logic
    const checkAuth = async () => {
      try {
        // For now, let's assume the user is authenticated
        // In a real app, you'd check with your auth system
        setIsAuthenticated(true);
        setUser({ role: 'admin', permissions: ['read_sales', 'read_invoices'] });
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // If not loading and not authenticated, redirect to auth page
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while loading or redirecting
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasPermissions = requiredPermissions.every(permission => 
      user.permissions?.includes(permission) || 
      user.role === 'admin' // Admin has all permissions
    );

    if (!hasPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  // If authenticated and has permissions, show the protected content
  return children;
}

// Also export as default for backward compatibility
export default ProtectedRoute;