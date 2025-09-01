'use client';

import { useAuth } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/auth/protected-route';
import { DashboardLayout } from '@/components/dashboard/layout';
import InventoryManagement from '@/components/inventory/inventory-management';

export default function InventoryPage() {
  return (
    <ProtectedRoute requiredPermissions={['read_inventory']}>
      <DashboardLayout>
        <InventoryManagement />
      </DashboardLayout>
    </ProtectedRoute>
  );
}