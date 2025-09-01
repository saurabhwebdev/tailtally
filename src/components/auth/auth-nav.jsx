'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogIn, Home } from 'lucide-react';

export default function AuthNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">TailTally</span>
      </Link>
      
      {isAuthenticated ? (
        <Link href="/" passHref>
          <Button variant="ghost" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
      ) : (
        <Link href="/auth" passHref>
          <Button variant="ghost" className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </Link>
      )}
    </nav>
  );
}