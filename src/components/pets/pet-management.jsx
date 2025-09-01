'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generatePetAvatarUrl } from '@/lib/animal-avatars';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Heart,
  Calendar,
  User,
  Phone,
  Mail,
  PawPrint,
  AlertTriangle,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import PetForm from './pet-form';
import PetDetail from './pet-detail';

const speciesColors = {
  dog: 'bg-blue-500',
  cat: 'bg-purple-500',
  bird: 'bg-yellow-500',
  fish: 'bg-cyan-500',
  rabbit: 'bg-green-500',
  hamster: 'bg-orange-500',
  other: 'bg-gray-500'
};

const speciesEmojis = {
  dog: '🐕',
  cat: '🐱',
  bird: '🐦',
  fish: '🐠',
  rabbit: '🐰',
  hamster: '🐹',
  other: '🐾'
};

export default function PetManagement() {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalCount: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    petId: null,
    petName: ''
  });
  const [emailStatus, setEmailStatus] = useState({});
  const [emailDialog, setEmailDialog] = useState({
    isOpen: false,
    pet: null,
    type: 'welcome'
  });

  // Fetch pets
  const fetchPets = async (page = 1, species = selectedSpecies, search = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (species && species !== 'all') {
        params.append('species', species);
      }
      
      if (search) {
        params.append('search', search);
      }

      const data = await apiRequest(`/api/pets?${params}`);

      if (data.success) {
        setPets(data.data.pets || []);
        setPagination(data.data.pagination || {});
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch pets');
      console.error('Fetch pets error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (petId, petName) => {
    setDeleteDialog({
      isOpen: true,
      petId,
      petName
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { petId } = deleteDialog;
    
    try {
      const data = await apiRequest(`/api/pets/${petId}`, {
        method: 'DELETE'
      });

      if (data.success) {
        // Refresh the list
        await fetchPets(pagination.current, selectedSpecies, searchTerm);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete pet');
      console.error('Delete pet error:', err);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchPets(1, selectedSpecies, value);
  };

  // Handle species filter
  const handleSpeciesFilter = (species) => {
    setSelectedSpecies(species);
    fetchPets(1, species, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchPets(page, selectedSpecies, searchTerm);
  };

  // Pet added/updated handler
  const handlePetSaved = () => {
    setIsAddDialogOpen(false);
    setEditingPet(null);
    fetchPets(pagination.current, selectedSpecies, searchTerm);
  };

  // Handle email sending
  const handleSendEmail = async (pet, emailType = 'welcome') => {
    const petId = pet._id;
    
    try {
      // Set loading state
      setEmailStatus(prev => ({
        ...prev,
        [petId]: { status: 'loading', message: 'Sending email...' }
      }));

      // Show loading toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`Sending email to ${pet.owner?.firstName || 'owner'} for ${pet.name}...`, 'info', 2000);
      }

      const response = await apiRequest('/api/pets/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: emailType,
          petId: petId,
          additionalData: {
            updateType: emailType === 'profile_update' ? 'general' : undefined
          }
        })
      });

      if (response.success) {
        const statusType = response.skipped ? 'skipped' : 'success';
        const message = response.skipped ? 'Email skipped - owner preferences' : 'Email sent successfully!';
        
        setEmailStatus(prev => ({
          ...prev,
          [petId]: { 
            status: statusType, 
            message: message
          }
        }));

        // Show success/skipped toast
        if (typeof window !== 'undefined' && window.showToast) {
          if (response.skipped) {
            window.showToast(`Email skipped for ${pet.name} - owner communication preferences`, 'info', 4000);
          } else {
            window.showToast(`✅ Email sent successfully to ${pet.owner?.firstName || 'owner'} for ${pet.name}!`, 'success', 4000);
          }
        }
      } else {
        const errorMessage = response.error || 'Failed to send email';
        setEmailStatus(prev => ({
          ...prev,
          [petId]: { status: 'error', message: errorMessage }
        }));

        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(`❌ Failed to send email for ${pet.name}: ${errorMessage}`, 'error', 5000);
        }
      }
    } catch (error) {
      console.error('Email sending error:', error);
      const errorMessage = 'Failed to send email';
      setEmailStatus(prev => ({
        ...prev,
        [petId]: { status: 'error', message: errorMessage }
      }));

      // Show error toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`❌ Network error while sending email for ${pet.name}. Please try again.`, 'error', 5000);
      }
    }

    // Clear status after 5 seconds (increased from 3 to give users more time to see the feedback)
    setTimeout(() => {
      setEmailStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[petId];
        return newStatus;
      });
    }, 5000);
  };

  // Get email button content based on status
  const getEmailButtonContent = (pet) => {
    const status = emailStatus[pet._id];
    
    if (!status) {
      return {
        icon: <Send className="mr-2 h-4 w-4" />,
        text: 'Send Email',
        className: ''
      };
    }

    switch (status.status) {
      case 'loading':
        return {
          icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
          text: 'Sending...',
          className: 'text-blue-600'
        };
      case 'success':
        return {
          icon: <CheckCircle className="mr-2 h-4 w-4" />,
          text: 'Sent!',
          className: 'text-green-600'
        };
      case 'skipped':
        return {
          icon: <Mail className="mr-2 h-4 w-4" />,
          text: 'Skipped',
          className: 'text-yellow-600'
        };
      case 'error':
        return {
          icon: <XCircle className="mr-2 h-4 w-4" />,
          text: 'Failed',
          className: 'text-red-600'
        };
      default:
        return {
          icon: <Send className="mr-2 h-4 w-4" />,
          text: 'Send Email',
          className: ''
        };
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pet Management</h1>
          <p className="text-muted-foreground">
            Manage pets, medical records, and vaccination schedules
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Pet</DialogTitle>
              <DialogDescription>
                Enter the pet's information below
              </DialogDescription>
            </DialogHeader>
            <PetForm onSaved={handlePetSaved} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              All registered pets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dogs</CardTitle>
            <span className="text-lg">🐕</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(pet => pet.species === 'dog').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Current page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cats</CardTitle>
            <span className="text-lg">🐱</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(pet => pet.species === 'cat').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Current page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Others</CardTitle>
            <span className="text-lg">🐾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pets.filter(pet => !['dog', 'cat'].includes(pet.species)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Current page
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pets by name, owner, or breed..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedSpecies} onValueChange={handleSpeciesFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Species</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                  <SelectItem value="bird">Birds</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="rabbit">Rabbits</SelectItem>
                  <SelectItem value="hamster">Hamsters</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pets List</CardTitle>
          <CardDescription>
            {pagination.totalCount} total pets found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Species</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={pet.photos?.[0]?.url || generatePetAvatarUrl(pet, 40)} />
                        <AvatarFallback className={`text-white ${speciesColors[pet.species] || speciesColors.other}`}>
                          {speciesEmojis[pet.species] || '🐾'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{pet.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pet.color && `${pet.color} • `}
                          {pet.gender && pet.gender !== 'unknown' && (
                            <span className="capitalize">{pet.gender}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-white ${speciesColors[pet.species]}`}>
                      <span className="mr-1">{speciesEmojis[pet.species]}</span>
                      {pet.species}
                    </Badge>
                  </TableCell>
                  <TableCell>{pet.breed || 'Mixed'}</TableCell>
                  <TableCell>{pet.age ? `${pet.age} years` : 'Unknown'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{pet.ownerInfo?.name || 'Unknown'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {pet.ownerInfo?.email && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{pet.ownerInfo.email}</span>
                        </div>
                      )}
                      {pet.ownerInfo?.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{pet.ownerInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(pet.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedPet(pet)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && (
                          <DropdownMenuItem onClick={() => setEditingPet(pet)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && pet.ownerInfo?.email && (
                          <DropdownMenuItem 
                            onClick={() => handleSendEmail(pet, 'welcome')}
                            className={getEmailButtonContent(pet).className}
                            disabled={emailStatus[pet._id]?.status === 'loading'}
                          >
                            {getEmailButtonContent(pet).icon}
                            {getEmailButtonContent(pet).text}
                          </DropdownMenuItem>
                        )}
                        {(hasRole('admin') || hasRole('veterinarian')) && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(pet._id, pet.name)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pets.length === 0 && !loading && (
            <div className="text-center py-8">
              <PawPrint className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No pets found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedSpecies !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first pet to get started'
                }
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.current - 1) * 10) + 1} to{' '}
                {Math.min(pagination.current * 10, pagination.totalCount)} of{' '}
                {pagination.totalCount} pets
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current >= pagination.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pet Detail Dialog */}
      {selectedPet && (
        <Dialog open={!!selectedPet} onOpenChange={() => setSelectedPet(null)}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Pet Details - {selectedPet.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[85vh]">
              <PetDetail pet={selectedPet} onClose={() => setSelectedPet(null)} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Pet Dialog */}
      {editingPet && (
        <Dialog open={!!editingPet} onOpenChange={() => setEditingPet(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Pet</DialogTitle>
              <DialogDescription>
                Update {editingPet.name}'s information
              </DialogDescription>
            </DialogHeader>
            <PetForm 
              pet={editingPet} 
              onSaved={handlePetSaved} 
              onCancel={() => setEditingPet(null)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, petId: null, petName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Pet"
        description={`Are you sure you want to delete "${deleteDialog.petName}"? This action cannot be undone and will permanently remove the pet and all associated data.`}
        confirmText="Delete Pet"
        cancelText="Cancel"
        variant="destructive"
        loading={loading}
      />
    </div>
  );
}
