'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { ReportsManagement } from '@/components/reports/reports-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function ReportsPage() {
  return (
    <ProtectedRoute requiredPermissions={['view_reports']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="text-muted-foreground">
                Comprehensive business reports and performance analytics
              </p>
            </div>
          </div>
          
          <ReportsManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}