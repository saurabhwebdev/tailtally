'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/dashboard/layout";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import AuthLoading from "@/components/auth/auth-loading";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If not authenticated, redirect to auth page
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) {
    return <AuthLoading />;
  }
  
  if (!isAuthenticated) {
    return <AuthLoading />; // Will redirect to /auth
  }
  
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
