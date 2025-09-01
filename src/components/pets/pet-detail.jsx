'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import {
  Heart,
  User,
  Phone,
  Mail,
  Calendar,
  Weight,
  Ruler,
  MapPin,
  Plus,
  Edit,
  Trash2,
  FileText,
  Syringe,
  Clock,
  AlertTriangle,
  Camera,
  X,
  Info
} from 'lucide-react';
import { compressImage, validateImageFile } from '@/lib/image-utils';

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

const medicalTypeColors = {
  checkup: 'bg-blue-500',
  treatment: 'bg-green-500',
  surgery: 'bg-red-500',
  emergency: 'bg-orange-500',
  vaccination: 'bg-purple-500',
  other: 'bg-gray-500'
};

export default function PetDetail({ pet, onClose }) {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingMedical, setIsAddingMedical] = useState(false);
  const [isAddingVaccination, setIsAddingVaccination] = useState(false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [deletePhotoDialog, setDeletePhotoDialog] = useState({
    isOpen: false,
    photoIndex: null,
    photoDescription: ''
  });
  
  // Medical record form
  const [medicalForm, setMedicalForm] = useState({
    type: 'other',
    description: '',
    veterinarian: '',
    notes: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Vaccination form
  const [vaccinationForm, setVaccinationForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    nextDue: ''
  });

  // Photo form
  const [photoForm, setPhotoForm] = useState({
    url: '',
    description: ''
  });

  const canEdit = hasRole('admin') || hasRole('veterinarian') || hasRole('staff');

  const addMedicalRecord = async () => {
    if (!medicalForm.description) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = { ...medicalForm };
      if (submitData.cost) submitData.cost = Number(submitData.cost);

      const data = await apiRequest(`/api/pets/${pet._id}/medical`, {
        method: 'POST',
        body: JSON.stringify(submitData)
      });

      if (data.success) {
        setSuccess('Medical record added successfully');
        setIsAddingMedical(false);
        setMedicalForm({
          type: 'other',
          description: '',
          veterinarian: '',
          notes: '',
          cost: '',
          date: new Date().toISOString().split('T')[0]
        });
        // Refresh the pet data
        window.location.reload();
      } else {
        setError(data.message || 'Failed to add medical record');
      }
    } catch (err) {
      setError(err.message || 'Failed to add medical record');
    } finally {
      setLoading(false);
    }
  };

  const addVaccination = async () => {
    if (!vaccinationForm.name || !vaccinationForm.date) {
      setError('Vaccination name and date are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(`/api/pets/${pet._id}/vaccinations`, {
        method: 'POST',
        body: JSON.stringify(vaccinationForm)
      });

      if (data.success) {
        setSuccess('Vaccination record added successfully');
        setIsAddingVaccination(false);
        setVaccinationForm({
          name: '',
          date: new Date().toISOString().split('T')[0],
          nextDue: ''
        });
        // Refresh the pet data
        window.location.reload();
      } else {
        setError(data.message || 'Failed to add vaccination record');
      }
    } catch (err) {
      setError(err.message || 'Failed to add vaccination record');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      try {
        // Compress image
        const compressedUrl = await compressImage(file);
        setPhotoForm(prev => ({
          ...prev,
          url: compressedUrl
        }));
        setError(null);
      } catch (err) {
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try another file.');
      }
    }
  };

  const addPhoto = async () => {
    if (!photoForm.url) {
      setError('Photo URL is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(`/api/pets/${pet._id}/photos`, {
        method: 'POST',
        body: JSON.stringify(photoForm)
      });

      if (data.success) {
        setSuccess('Photo added successfully');
        setIsAddingPhoto(false);
        setPhotoForm({
          url: '',
          description: ''
        });
        // Refresh the pet data
        window.location.reload();
      } else {
        setError(data.message || 'Failed to add photo');
      }
    } catch (err) {
      setError(err.message || 'Failed to add photo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhotoClick = (photoIndex, photoDescription) => {
    setDeletePhotoDialog({
      isOpen: true,
      photoIndex,
      photoDescription
    });
  };

  const handleDeletePhotoConfirm = async () => {
    const { photoIndex } = deletePhotoDialog;
    
    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest(`/api/pets/${pet._id}/photos?index=${photoIndex}`, {
        method: 'DELETE'
      });

      if (data.success) {
        setSuccess('Photo deleted successfully');
        // Refresh the pet data
        window.location.reload();
      } else {
        setError(data.message || 'Failed to delete photo');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete photo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isVaccinationDue = (vaccination) => {
    if (!vaccination.nextDue) return false;
    const nextDue = new Date(vaccination.nextDue);
    const today = new Date();
    const diffTime = nextDue - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Due within 30 days
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={pet.photos?.[0]?.url} />
            <AvatarFallback className="text-2xl">
              {speciesEmojis[pet.species] || '🐾'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{pet.name}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className={`text-white ${speciesColors[pet.species]}`}>
                <span className="mr-1">{speciesEmojis[pet.species]}</span>
                {pet.species}
              </Badge>
              {pet.breed && (
                <Badge variant="outline">{pet.breed}</Badge>
              )}
              {pet.gender && pet.gender !== 'unknown' && (
                <Badge variant="outline" className="capitalize">{pet.gender}</Badge>
              )}
            </div>
          </div>
        </div>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Pet Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                    <p className="text-sm">{pet.age ? `${pet.age} years` : 'Unknown'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                    <p className="text-sm">{pet.weight ? `${pet.weight} kg` : 'Unknown'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Color</Label>
                    <p className="text-sm">{pet.color || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Neutered</Label>
                    <p className="text-sm">{pet.neutered ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                {pet.microchipId && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Microchip ID</Label>
                    <p className="text-sm font-mono">{pet.microchipId}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Registered</Label>
                  <p className="text-sm">{formatDate(pet.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm">{pet.ownerInfo?.name || 'Unknown'}</p>
                </div>
                {pet.ownerInfo?.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pet.ownerInfo.email}</span>
                  </div>
                )}
                {pet.ownerInfo?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{pet.ownerInfo.phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest medical records and vaccinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pet.medicalHistory?.slice(0, 3).map((record, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Badge variant="secondary" className={`text-white ${medicalTypeColors[record.type]}`}>
                      {record.type}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{record.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(record.date)} • {record.veterinarian || 'Unknown vet'}
                      </p>
                    </div>
                  </div>
                ))}
                {(!pet.medicalHistory || pet.medicalHistory.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No medical records yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>Complete medical records for {pet.name}</CardDescription>
                </div>
                {canEdit && (
                  <Dialog open={isAddingMedical} onOpenChange={setIsAddingMedical}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Record
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Medical Record</DialogTitle>
                        <DialogDescription>
                          Add a new medical record for {pet.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select 
                            value={medicalForm.type} 
                            onValueChange={(value) => setMedicalForm(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checkup">Checkup</SelectItem>
                              <SelectItem value="treatment">Treatment</SelectItem>
                              <SelectItem value="surgery">Surgery</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="vaccination">Vaccination</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={medicalForm.date}
                            onChange={(e) => setMedicalForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={medicalForm.description}
                            onChange={(e) => setMedicalForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the medical record..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Veterinarian</Label>
                          <Input
                            value={medicalForm.veterinarian}
                            onChange={(e) => setMedicalForm(prev => ({ ...prev, veterinarian: e.target.value }))}
                            placeholder="Enter veterinarian name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={medicalForm.notes}
                            onChange={(e) => setMedicalForm(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cost</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={medicalForm.cost}
                            onChange={(e) => setMedicalForm(prev => ({ ...prev, cost: e.target.value }))}
                            placeholder="Enter cost"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddingMedical(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addMedicalRecord} disabled={loading}>
                            Add Record
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pet.medicalHistory?.map((record, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`text-white ${medicalTypeColors[record.type]}`}>
                          {record.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(record.date)}
                        </span>
                      </div>
                      {record.cost && (
                        <span className="text-sm font-medium">${record.cost}</span>
                      )}
                    </div>
                    <h4 className="font-medium mb-1">{record.description}</h4>
                    {record.veterinarian && (
                      <p className="text-sm text-muted-foreground mb-1">
                        Veterinarian: {record.veterinarian}
                      </p>
                    )}
                    {record.notes && (
                      <p className="text-sm text-muted-foreground">{record.notes}</p>
                    )}
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    No medical records yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vaccinations</CardTitle>
                  <CardDescription>Vaccination records and schedule for {pet.name}</CardDescription>
                </div>
                {canEdit && (
                  <Dialog open={isAddingVaccination} onOpenChange={setIsAddingVaccination}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vaccination
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add Vaccination Record</DialogTitle>
                        <DialogDescription>
                          Add a new vaccination record for {pet.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Vaccination Name *</Label>
                          <Input
                            value={vaccinationForm.name}
                            onChange={(e) => setVaccinationForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Rabies, DHPP, Bordetella"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date Given *</Label>
                          <Input
                            type="date"
                            value={vaccinationForm.date}
                            onChange={(e) => setVaccinationForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Next Due Date</Label>
                          <Input
                            type="date"
                            value={vaccinationForm.nextDue}
                            onChange={(e) => setVaccinationForm(prev => ({ ...prev, nextDue: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddingVaccination(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addVaccination} disabled={loading}>
                            Add Vaccination
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pet.vaccinations?.map((vaccination, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Syringe className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-medium">{vaccination.name}</h4>
                      </div>
                      {vaccination.nextDue && isVaccinationDue(vaccination) && (
                        <Badge variant="destructive">Due Soon</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Given: {formatDate(vaccination.date)}</p>
                      {vaccination.nextDue && (
                        <p>Next due: {formatDate(vaccination.nextDue)}</p>
                      )}
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-8">
                    No vaccination records yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Photo gallery for {pet.name}</CardDescription>
                </div>
                {canEdit && (
                  <Dialog open={isAddingPhoto} onOpenChange={setIsAddingPhoto}>
                    <DialogTrigger asChild>
                      <Button>
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add Photo</DialogTitle>
                        <DialogDescription>
                          Add a new photo for {pet.name}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Photo URL *</Label>
                          <Input
                            value={photoForm.url}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, url: e.target.value }))}
                            placeholder="Enter photo URL or upload file"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Upload File</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="cursor-pointer"
                          />
                          <p className="text-xs text-muted-foreground">
                            Choose an image file to upload. Supported formats: JPG, PNG, GIF
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={photoForm.description}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Add a description for this photo..."
                          />
                        </div>
                        {photoForm.url && (
                          <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="border rounded-lg p-2">
                              <img
                                src={photoForm.url}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded"
                                onError={() => setPhotoForm(prev => ({ ...prev, url: '' }))}
                              />
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsAddingPhoto(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addPhoto} disabled={loading || !photoForm.url}>
                            Add Photo
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {pet.photos && pet.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pet.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={photo.description || `${pet.name} photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {canEdit && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeletePhotoClick(index, photo.description || `Photo ${index + 1}`)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                      {photo.description && (
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No photos yet</h3>
                  <p className="text-muted-foreground">
                    Add photos to create a gallery for {pet.name}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Photo Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deletePhotoDialog.isOpen}
        onClose={() => setDeletePhotoDialog({ isOpen: false, photoIndex: null, photoDescription: '' })}
        onConfirm={handleDeletePhotoConfirm}
        title="Delete Photo"
        description={`Are you sure you want to delete "${deletePhotoDialog.photoDescription}"? This action cannot be undone.`}
        confirmText="Delete Photo"
        cancelText="Cancel"
        variant="destructive"
        loading={loading}
      />
    </div>
  );
}
