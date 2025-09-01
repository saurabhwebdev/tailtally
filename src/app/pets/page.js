'use client';

import { DashboardLayout } from "@/components/dashboard/layout";
import PetManagement from '@/components/pets/pet-management';
import ProtectedRoute from '@/components/auth/protected-route';

export default function PetsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <PetManagement />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
