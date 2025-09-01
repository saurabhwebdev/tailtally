'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { SalesManagement } from '@/components/sales/sales-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function SalesPage() {
  return (
    <ProtectedRoute requiredPermissions={['read_sales']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sales Management</h1>
              <p className="text-muted-foreground">
                Manage sales transactions, track revenue, and generate invoices
              </p>
            </div>
          </div>
          
          <SalesManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}