'use client';
'use client';

import { DashboardLayout } from "@/components/dashboard/layout";
import ProtectedRoute from '@/components/auth/protected-route';
import ApiDocumentation from '@/components/docs/api-documentation';
import { useSearchParams } from 'next/navigation';

export default function DocsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ApiDocumentation defaultTab={defaultTab} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}