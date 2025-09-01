'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // logout function now handles the redirect
    } catch (error) {
      console.error('Logout error:', error);
      // The logout function should still redirect even on error
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive font-medium transition-colors duration-200 group"
    >
      <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
      {isLoggingOut ? 'Logging out...' : 'Log out'}
    </Button>
  );
}