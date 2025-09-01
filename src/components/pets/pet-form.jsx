'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { compressImage, validateImageFile } from '@/lib/image-utils';

const SPECIES_OPTIONS = [
  { value: 'dog', label: '🐕 Dog' },
  { value: 'cat', label: '🐱 Cat' },
  { value: 'bird', label: '🐦 Bird' },
  { value: 'fish', label: '🐠 Fish' },
  { value: 'rabbit', label: '🐰 Rabbit' },
  { value: 'hamster', label: '🐹 Hamster' },
  { value: 'other', label: '🐾 Other' }
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' }
];

export default function PetForm({ pet = null, onSaved, onCancel }) {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isNewOwner, setIsNewOwner] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    gender: 'unknown',
    neutered: false,
    microchipId: '',
    owner: '',
    ownerInfo: {
      name: '',
      email: '',
      phone: ''
    },
    photos: []
  });

  // Initialize form data
  useEffect(() => {
    console.log('Form initialization - currentUser:', currentUser);
    console.log('Form initialization - pet:', pet);
    
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        color: pet.color || '',
        gender: pet.gender || 'unknown',
        neutered: pet.neutered || false,
        microchipId: pet.microchipId || '',
        owner: pet.owner?._id || pet.owner || '',
        ownerInfo: {
          name: pet.ownerInfo?.name || '',
          email: pet.ownerInfo?.email || '',
          phone: pet.ownerInfo?.phone || ''
        },
        photos: pet.photos || []
      });
    } else if (currentUser?.role === 'customer') {
      // Pre-fill owner info for customers
      const ownerId = currentUser._id || currentUser.id;
      const ownerName = currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
      
      console.log('Setting customer owner info:', { ownerId, ownerName, currentUser });
      
      setFormData(prev => ({
        ...prev,
        owner: ownerId,
        ownerInfo: {
          name: ownerName,
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        }
      }));
    }
  }, [pet, currentUser]);

  // Fetch users for owner selection (for staff/admin)
  useEffect(() => {
    if (hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest('/api/users?role=customer&limit=100');
      if (data.success) {
        setUsers(data.data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleOwnerChange = (ownerId) => {
    const selectedUser = users.find(user => user._id === ownerId);
    if (selectedUser) {
      setFormData(prev => ({
        ...prev,
        owner: ownerId,
        ownerInfo: {
          name: selectedUser.fullName || `${selectedUser.firstName} ${selectedUser.lastName}`,
          email: selectedUser.email || '',
          phone: selectedUser.phone || ''
        }
      }));
    }
  };

  const checkEmailExists = async (email) => {
    if (!email || !isNewOwner) return false;
    
    try {
      const data = await apiRequest(`/api/users?email=${encodeURIComponent(email)}`);
      return data.success && data.data.users && data.data.users.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleEmailChange = async (email) => {
    handleInputChange('ownerInfo.email', email);
    
    if (email && isNewOwner) {
      const exists = await checkEmailExists(email);
      if (exists) {
        setError('This email already exists. Please select the existing owner from the dropdown or use a different email.');
      } else {
        setError(null);
      }
    }
  };

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newPhotos = [];

    for (const file of files) {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        continue;
      }

      try {
        // Compress image
        const compressedUrl = await compressImage(file);
        newPhotos.push({
          url: compressedUrl,
          description: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
        });
      } catch (err) {
        console.error('Error processing image:', err);
        setError(`Failed to process image: ${file.name}`);
      }
    }

    if (newPhotos.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    }

    // Clear the input
    event.target.value = '';
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields for staff/admin users
      if ((hasRole('admin') || hasRole('veterinarian') || hasRole('staff'))) {
        if (!isNewOwner && !formData.owner) {
          setError('Please select an owner for the pet');
          setLoading(false);
          return;
        }
        if (isNewOwner && (!formData.ownerInfo.name || !formData.ownerInfo.email)) {
          setError('Please enter owner name and email for the new owner');
          setLoading(false);
          return;
        }
      }

      // Prepare data for submission
      const submitData = { ...formData };
      
      // Convert numeric fields
      if (submitData.age) submitData.age = Number(submitData.age);
      if (submitData.weight) submitData.weight = Number(submitData.weight);
      
      // Remove empty fields, but preserve owner field for customers and new owners
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null) {
          // Don't remove owner field for customers or when adding new owner
          if (key === 'owner' && (currentUser?.role === 'customer' || isNewOwner)) {
            return;
          }
          delete submitData[key];
        }
      });

      // Ensure ownerInfo is properly set for customers
      if (currentUser?.role === 'customer') {
        submitData.ownerInfo = {
          name: currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        };
      }

      // For new owners, ensure we don't send an owner ID
      if (isNewOwner) {
        delete submitData.owner;
      }

      const url = pet ? `/api/pets/${pet._id}` : '/api/pets';
      const method = pet ? 'PUT' : 'POST';

      // Debug: Log the data being sent
      console.log('Submitting pet data:', submitData);
      console.log('Current user role:', currentUser?.role);
      console.log('Owner field:', submitData.owner);

      const data = await apiRequest(url, {
        method,
        body: JSON.stringify(submitData)
      });

             if (data.success) {
         onSaved && onSaved(data.data.pet);
       } else {
         // Show the specific error message from the API
         console.error('Pet creation failed:', data);
         setError(data.message || 'Failed to save pet');
       }
    } catch (err) {
      setError(err.message || 'Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pet Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter pet name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Species *</Label>
              <Select value={formData.species} onValueChange={(value) => handleInputChange('species', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="Enter breed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="50"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter age"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Enter weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Enter color"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="microchipId">Microchip ID</Label>
              <Input
                id="microchipId"
                value={formData.microchipId}
                onChange={(e) => handleInputChange('microchipId', e.target.value)}
                placeholder="Enter microchip ID"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="neutered"
              checked={formData.neutered}
              onChange={(e) => handleInputChange('neutered', e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="neutered">Neutered/Spayed</Label>
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Photos</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Upload Photos</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                You can add more photos after creating the pet profile
              </p>
            </div>
            
            {formData.photos.length > 0 && (
              <div className="space-y-2">
                <Label>Photo Preview</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.description || `Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Owner Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Owner Information</h3>
          
          {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="existing-owner"
                    name="owner-type"
                    checked={!isNewOwner}
                    onChange={() => {
                      setIsNewOwner(false);
                      setFormData(prev => ({
                        ...prev,
                        owner: '', // Clear the owner field when switching back
                        ownerInfo: {
                          name: '',
                          email: '',
                          phone: ''
                        }
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="existing-owner">Select Existing Owner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="new-owner"
                    name="owner-type"
                    checked={isNewOwner}
                    onChange={() => {
                      setIsNewOwner(true);
                      setFormData(prev => ({
                        ...prev,
                        owner: '', // Clear the owner field when switching to new owner
                        ownerInfo: {
                          name: '',
                          email: '',
                          phone: ''
                        }
                      }));
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="new-owner">Add New Owner</Label>
                </div>
              </div>

              {!isNewOwner && (
                <div className="space-y-2">
                  <Label htmlFor="owner">Select Owner *</Label>
                  <Select value={formData.owner} onValueChange={handleOwnerChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.fullName || `${user.firstName} ${user.lastName}`} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

                             {isNewOwner && (
                 <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                   <p className="text-sm text-blue-800 mb-2">
                     Enter the new owner's information below. The pet will be created for this new owner.
                   </p>
                   <p className="text-xs text-blue-600">
                     <strong>Note:</strong> If the email already exists in the system, please select "Select Existing Owner" instead.
                   </p>
                 </div>
               )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name *</Label>
                             <Input
                 id="ownerName"
                 value={formData.ownerInfo.name}
                 onChange={(e) => handleInputChange('ownerInfo.name', e.target.value)}
                 placeholder="Enter owner name"
                 required
                 disabled={currentUser?.role === 'customer' && !isNewOwner}
               />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Owner Email *</Label>
                             <Input
                 id="ownerEmail"
                 type="email"
                 value={formData.ownerInfo.email}
                 onChange={(e) => handleEmailChange(e.target.value)}
                 placeholder="Enter owner email"
                 required
                 disabled={currentUser?.role === 'customer' && !isNewOwner}
               />
            </div>

            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="ownerPhone">Owner Phone</Label>
                             <Input
                 id="ownerPhone"
                 value={formData.ownerInfo.phone}
                 onChange={(e) => handleInputChange('ownerInfo.phone', e.target.value)}
                 placeholder="Enter owner phone"
                 disabled={currentUser?.role === 'customer' && !isNewOwner}
               />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pet ? 'Update Pet' : 'Add Pet'}
          </Button>
        </div>
      </form>
    </div>
  );
}
