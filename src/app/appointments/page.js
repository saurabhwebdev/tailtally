'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { AppointmentManagement } from '@/components/appointments/appointment-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function AppointmentsPage() {
  return (
    <ProtectedRoute requiredPermissions={['read_appointments']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
              <p className="text-muted-foreground">
                Schedule and manage pet appointments
              </p>
            </div>
          </div>
          
          <AppointmentManagement />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}