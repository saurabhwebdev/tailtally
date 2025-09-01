'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import AuthPage from '@/components/auth/auth-page';
import AuthLoading from '@/components/auth/auth-loading';

export default function Auth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Show loading while checking auth state
  if (isLoading) {
    return <AuthLoading />;
  }

  // If authenticated, don't render auth page (will redirect)
  if (isAuthenticated) {
    return <AuthLoading />;
  }

  return <AuthPage />;
}