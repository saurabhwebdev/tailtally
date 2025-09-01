'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Clock, User, PawPrint } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function AppointmentForm({ appointment, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    owner: '',
    pet: '',
    type: '',
    date: null,
    time: '',
    duration: 30,
    notes: '',
    priority: 'normal',
    assignedTo: ''
  });
  const [owners, setOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [loadingPets, setLoadingPets] = useState(false);

  // Time slots for appointments
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    fetchOwners();
    fetchStaff();
    
    if (appointment) {
      setFormData({
        owner: appointment.owner?._id || '',
        pet: appointment.pet?._id || '',
        type: appointment.type || '',
        date: appointment.date ? new Date(appointment.date) : null,
        time: appointment.time || '',
        duration: appointment.duration || 30,
        notes: appointment.notes || '',
        priority: appointment.priority || 'normal',
        assignedTo: appointment.assignedTo?._id || 'unassigned'
      });
      
      if (appointment.owner?._id) {
        fetchPetsByOwner(appointment.owner._id);
      }
    }
  }, [appointment]);

  const fetchOwners = async () => {
    try {
      setLoadingOwners(true);
      const response = await fetch('/api/owners?limit=100');
      const data = await response.json();
      
      if (response.ok) {
        setOwners(data.data.owners || []);
      }
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchPetsByOwner = async (ownerId) => {
    if (!ownerId) {
      setPets([]);
      return;
    }

    try {
      setLoadingPets(true);
      const response = await fetch(`/api/pets?ownerId=${ownerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPets(data.data.pets || []);
      }
    } catch (err) {
      console.error('Failed to fetch pets:', err);
    } finally {
      setLoadingPets(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/users?role=staff');
      const data = await response.json();
      
      if (response.ok) {
        setStaff(data.data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    }
  };

  const handleOwnerChange = (ownerId) => {
    setFormData(prev => ({ ...prev, owner: ownerId, pet: '' }));
    fetchPetsByOwner(ownerId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.owner || !formData.pet || !formData.type || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = appointment 
        ? `/api/appointments/${appointment._id}`
        : '/api/appointments';
      
      const method = appointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          date: formData.date.toISOString().split('T')[0],
          assignedTo: formData.assignedTo === 'unassigned' ? null : formData.assignedTo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save appointment');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Edit Appointment' : 'New Appointment'}
          </DialogTitle>
          <DialogDescription>
            {appointment ? 'Update appointment details' : 'Schedule a new appointment for a pet'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Owner Selection */}
          <div className="space-y-2">
            <Label htmlFor="owner">Owner *</Label>
            <Select 
              value={formData.owner} 
              onValueChange={handleOwnerChange}
              disabled={loadingOwners}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select owner">
                  {formData.owner && owners.find(o => o._id === formData.owner) && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {owners.find(o => o._id === formData.owner)?.firstName} {owners.find(o => o._id === formData.owner)?.lastName}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner._id} value={owner._id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {owner.firstName} {owner.lastName}
                      <span className="text-muted-foreground">({owner.email})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pet Selection */}
          <div className="space-y-2">
            <Label htmlFor="pet">Pet *</Label>
            <Select 
              value={formData.pet} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, pet: value }))}
              disabled={!formData.owner || loadingPets}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pet">
                  {formData.pet && pets.find(p => p._id === formData.pet) && (
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4" />
                      {pets.find(p => p._id === formData.pet)?.name}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet._id} value={pet._id}>
                    <div className="flex items-center gap-2">
                      <PawPrint className="h-4 w-4" />
                      {pet.name}
                      <span className="text-muted-foreground">({pet.species} • {pet.breed})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Appointment Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                    disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select 
                value={formData.time} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                min="5"
                max="240"
                step="5"
              />
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select 
              value={formData.assignedTo} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {staff.map((member) => (
                  <SelectItem key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the appointment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (appointment ? 'Update' : 'Create')} Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}