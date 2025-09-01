'use client';

import { DashboardLayout } from "@/components/dashboard/layout";
import OwnerManagement from '@/components/owners/owner-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function OwnersPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <OwnerManagement />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
