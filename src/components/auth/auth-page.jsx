'use client';

import { useState } from 'react';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import AuthNav from './auth-nav';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState('login');

  const switchToSignup = () => setAuthMode('signup');
  const switchToLogin = () => setAuthMode('login');

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <AuthNav />
      <div className="w-full max-w-md">
        {authMode === 'login' ? (
          <LoginForm onSwitchToSignup={switchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
}