'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { DashboardLayout } from "@/components/dashboard/layout";
import ProtectedRoute from '@/components/auth/protected-route';
import PetDetail from '@/components/pets/pet-detail';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { apiRequest } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/pets/${params.id}`);
        
        if (data.success) {
          setPet(data.data.pet);
          setError(null);
        } else {
          setError(data.message || 'Failed to load pet');
        }
      } catch (err) {
        setError(err.message || 'Failed to load pet');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPet();
    }
  }, [params.id, apiRequest]);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={() => router.push('/pets')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pets
            </Button>
            
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!pet) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Button 
              variant="outline" 
              onClick={() => router.push('/pets')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pets
            </Button>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Pet not found</AlertDescription>
            </Alert>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/pets')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pets
          </Button>
          
          <PetDetail 
            pet={pet} 
            onClose={() => router.push('/pets')} 
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
