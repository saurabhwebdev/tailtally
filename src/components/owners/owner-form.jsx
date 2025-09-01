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
import { AlertTriangle, Loader2, X, Plus } from 'lucide-react';

const COMMUNICATION_METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'mail', label: 'Mail' }
];

const CONTACT_TIMES = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' }
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'check', label: 'Check' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'upi', label: 'UPI' },
  { value: 'net_banking', label: 'Net Banking' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'emi', label: 'EMI' }
];

const SOURCES = [
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'referral', label: 'Referral' },
  { value: 'online', label: 'Online' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' }
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'unspecified', label: 'Prefer not to say' }
];

export default function OwnerForm({ owner = null, onSaved, onCancel }) {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    gender: 'unspecified',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    },
    preferences: {
      communicationMethod: 'email',
      appointmentReminders: true,
      vaccinationReminders: true,
      marketingCommunications: false,
      preferredContactTime: 'anytime',
      notes: ''
    },
    billing: {
      preferredPaymentMethod: 'cash',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      discountEligible: false,
      discountReason: ''
    },
    source: 'walk_in',
    referredBy: '',
    tags: []
  });

  // Initialize form data
  useEffect(() => {
    if (owner) {
      setFormData({
        firstName: owner.firstName || '',
        lastName: owner.lastName || '',
        email: owner.email || '',
        phone: owner.phone || '',
        alternatePhone: owner.alternatePhone || '',
        gender: owner.gender || 'unspecified',
        address: {
          street: owner.address?.street || '',
          city: owner.address?.city || '',
          state: owner.address?.state || '',
          zipCode: owner.address?.zipCode || '',
          country: owner.address?.country || 'USA'
        },
        emergencyContact: {
          name: owner.emergencyContact?.name || '',
          relationship: owner.emergencyContact?.relationship || '',
          phone: owner.emergencyContact?.phone || '',
          email: owner.emergencyContact?.email || ''
        },
        preferences: {
          communicationMethod: owner.preferences?.communicationMethod || 'email',
          appointmentReminders: owner.preferences?.appointmentReminders ?? true,
          vaccinationReminders: owner.preferences?.vaccinationReminders ?? true,
          marketingCommunications: owner.preferences?.marketingCommunications ?? false,
          preferredContactTime: owner.preferences?.preferredContactTime || 'anytime',
          notes: owner.preferences?.notes || ''
        },
        billing: {
          preferredPaymentMethod: owner.billing?.preferredPaymentMethod || 'cash',
          insuranceProvider: owner.billing?.insuranceProvider || '',
          insurancePolicyNumber: owner.billing?.insurancePolicyNumber || '',
          discountEligible: owner.billing?.discountEligible ?? false,
          discountReason: owner.billing?.discountReason || ''
        },
        source: owner.source || 'walk_in',
        referredBy: owner.referredBy || '',
        tags: owner.tags || []
      });
    }
  }, [owner]);

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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('First name, last name, and email are required');
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submitData = { ...formData };
      
      // Log the gender field before cleanup
      console.log('Gender before cleanup:', submitData.gender);
      
      // Remove empty fields
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '' || submitData[key] === null) {
          delete submitData[key];
        }
      });

      // Clean up preferences - ensure enum fields are not empty
      if (submitData.preferences) {
        Object.keys(submitData.preferences).forEach(key => {
          if (submitData.preferences[key] === '' || submitData.preferences[key] === null) {
            // For enum fields, set defaults instead of deleting
            if (key === 'communicationMethod') {
              submitData.preferences[key] = 'email';
            } else if (key === 'preferredContactTime') {
              submitData.preferences[key] = 'anytime';
            } else {
              delete submitData.preferences[key];
            }
          }
        });
      }

      // Clean up address
      if (submitData.address) {
        Object.keys(submitData.address).forEach(key => {
          if (submitData.address[key] === '' || submitData.address[key] === null) {
            delete submitData.address[key];
          }
        });
        if (Object.keys(submitData.address).length === 0) {
          delete submitData.address;
        }
      }

      // Clean up emergency contact
      if (submitData.emergencyContact) {
        Object.keys(submitData.emergencyContact).forEach(key => {
          if (submitData.emergencyContact[key] === '' || submitData.emergencyContact[key] === null) {
            delete submitData.emergencyContact[key];
          }
        });
        if (Object.keys(submitData.emergencyContact).length === 0) {
          delete submitData.emergencyContact;
        }
      }

      // Clean up billing
      if (submitData.billing) {
        Object.keys(submitData.billing).forEach(key => {
          if (submitData.billing[key] === '' || submitData.billing[key] === null) {
            // For enum fields, set defaults instead of deleting
            if (key === 'preferredPaymentMethod') {
              submitData.billing[key] = 'cash';
            } else {
              delete submitData.billing[key];
            }
          }
        });
        if (Object.keys(submitData.billing).length === 0) {
          delete submitData.billing;
        }
      }

      const url = owner ? `/api/owners/${owner._id}` : '/api/owners';
      const method = owner ? 'PUT' : 'POST';
      
      // Log the final data being sent
      console.log('Final submitData:', submitData);
      console.log('Gender in final data:', submitData.gender);

      const data = await apiRequest(url, {
        method,
        body: JSON.stringify(submitData)
      });

      if (data.success) {
        onSaved && onSaved(data.data.owner);
      } else {
        setError(data.message || 'Failed to save owner');
      }
    } catch (err) {
      setError(err.message || 'Failed to save owner');
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
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                placeholder="Enter alternate phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address?.street || ''}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.address?.city || ''}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                placeholder="Enter city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.address?.state || ''}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                placeholder="Enter state"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.address?.zipCode || ''}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                placeholder="Enter ZIP code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.address?.country || ''}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contact</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Emergency Contact Name</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyRelationship">Relationship</Label>
              <Input
                id="emergencyRelationship"
                value={formData.emergencyContact?.relationship || ''}
                onChange={(e) => handleInputChange('emergencyContact.relationship', e.target.value)}
                placeholder="Enter relationship"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact?.phone || ''}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyEmail">Emergency Contact Email</Label>
              <Input
                id="emergencyEmail"
                type="email"
                value={formData.emergencyContact?.email || ''}
                onChange={(e) => handleInputChange('emergencyContact.email', e.target.value)}
                placeholder="Enter emergency contact email"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="communicationMethod">Preferred Communication Method</Label>
              <Select 
                value={formData.preferences.communicationMethod} 
                onValueChange={(value) => handleInputChange('preferences.communicationMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication method" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredContactTime">Preferred Contact Time</Label>
              <Select 
                value={formData.preferences.preferredContactTime} 
                onValueChange={(value) => handleInputChange('preferences.preferredContactTime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact time" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_TIMES.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="appointmentReminders"
                  checked={formData.preferences.appointmentReminders}
                  onChange={(e) => handleInputChange('preferences.appointmentReminders', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="vaccinationReminders"
                  checked={formData.preferences.vaccinationReminders}
                  onChange={(e) => handleInputChange('preferences.vaccinationReminders', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="vaccinationReminders">Vaccination Reminders</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="marketingCommunications"
                  checked={formData.preferences.marketingCommunications}
                  onChange={(e) => handleInputChange('preferences.marketingCommunications', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="marketingCommunications">Marketing Communications</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferencesNotes">Notes</Label>
              <Textarea
              id="preferencesNotes"
              value={formData.preferences?.notes || ''}
              onChange={(e) => handleInputChange('preferences.notes', e.target.value)}
              placeholder="Enter any additional notes or preferences"
              rows={3}
            />
          </div>
        </div>

        {/* Billing Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredPaymentMethod">Preferred Payment Method</Label>
              <Select 
                value={formData.billing.preferredPaymentMethod} 
                onValueChange={(value) => handleInputChange('billing.preferredPaymentMethod', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={formData.billing?.insuranceProvider || ''}
                onChange={(e) => handleInputChange('billing.insuranceProvider', e.target.value)}
                placeholder="Enter insurance provider"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="insurancePolicyNumber">Insurance Policy Number</Label>
              <Input
                id="insurancePolicyNumber"
                value={formData.billing?.insurancePolicyNumber || ''}
                onChange={(e) => handleInputChange('billing.insurancePolicyNumber', e.target.value)}
                placeholder="Enter policy number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="discountEligible"
                  checked={formData.billing.discountEligible}
                  onChange={(e) => handleInputChange('billing.discountEligible', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="discountEligible">Eligible for Discount</Label>
              </div>
            </div>
          </div>

          {formData.billing.discountEligible && (
            <div className="space-y-2">
              <Label htmlFor="discountReason">Discount Reason</Label>
              <Input
                id="discountReason"
                value={formData.billing?.discountReason || ''}
                onChange={(e) => handleInputChange('billing.discountReason', e.target.value)}
                placeholder="Enter reason for discount"
              />
            </div>
          )}
        </div>

        {/* Source Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Source Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">How did they find us?</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => handleInputChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referredBy">Referred By</Label>
              <Input
                id="referredBy"
                value={formData.referredBy}
                onChange={(e) => handleInputChange('referredBy', e.target.value)}
                placeholder="Enter referral source"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tags</h3>
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <span className="text-sm">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            {owner ? 'Update Owner' : 'Add Owner'}
          </Button>
        </div>
      </form>
    </div>
  );
}
