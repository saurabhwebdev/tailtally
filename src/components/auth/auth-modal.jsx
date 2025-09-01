'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import LoginForm from './login-form';
import SignupForm from './signup-form';

export default function AuthModal() {
  const { isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState('login');
  const [isVisible, setIsVisible] = useState(true);

  // Hide modal when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [isAuthenticated]);

  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  if (!isVisible) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md mx-auto">
        {authMode === 'login' ? (
          <LoginForm onSwitchToSignup={switchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
}