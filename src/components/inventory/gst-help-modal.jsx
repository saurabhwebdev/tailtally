'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GSTHelpModal({ isOpen, onClose }) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Redirect to help center with inventory tab
      router.push('/help?tab=inventory');
      onClose();
    }
  }, [isOpen, router, onClose]);

  return null; // No modal needed, just redirect
}

