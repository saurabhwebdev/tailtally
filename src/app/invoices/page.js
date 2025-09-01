'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { InvoiceManagement } from '@/components/invoices/invoice-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function InvoicesPage() {
  return (
    <ProtectedRoute requiredPermissions={['read_invoices']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
              <p className="text-muted-foreground">
                Create, manage, and track invoices and payments
              </p>
            </div>
          </div>
          
          <InvoiceManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}