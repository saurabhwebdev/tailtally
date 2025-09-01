'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  PawPrint,
  User,
  Building,
  Heart,
  Shield,
  Clock,
  Tag,
  ExternalLink,
  Edit,
  X,
  AlertTriangle,
  CheckCircle,
  Clock as ClockIcon
} from 'lucide-react';
import OwnerForm from './owner-form';
import { generateOwnerAvatarUrl, getGenderLabel, getGenderBadgeColor } from '@/lib/owner-avatar';

const sourceColors = {
  walk_in: 'bg-blue-500',
  referral: 'bg-green-500',
  online: 'bg-purple-500',
  advertisement: 'bg-orange-500',
  social_media: 'bg-pink-500',
  other: 'bg-gray-500'
};

const sourceLabels = {
  walk_in: 'Walk-in',
  referral: 'Referral',
  online: 'Online',
  advertisement: 'Advertisement',
  social_media: 'Social Media',
  other: 'Other'
};

const communicationLabels = {
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  mail: 'Mail'
};

const contactTimeLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  anytime: 'Anytime'
};

const paymentMethodLabels = {
  cash: 'Cash',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card',
  check: 'Check',
  insurance: 'Insurance'
};

export default function OwnerDetail({ owner, onClose }) {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [editing, setEditing] = useState(false);
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Fetch owner's pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoadingPets(true);
        const data = await apiRequest(`/api/owners/${owner._id}`);
        if (data.success && data.data.pets) {
          setPets(data.data.pets);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoadingPets(false);
      }
    };

    if (owner._id) {
      fetchPets();
    }
  }, [owner._id, apiRequest]);

  const handleOwnerUpdated = (updatedOwner) => {
    setEditing(false);
    // Refresh the owner data
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={owner.avatar || generateOwnerAvatarUrl(owner)} 
              alt={`${owner.fullName} avatar`}
            />
            <AvatarFallback className="text-lg">
              {owner.firstName?.charAt(0)}{owner.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{owner.fullName}</h2>
            <p className="text-muted-foreground">
              Owner since {formatDate(owner.registrationDate)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {owner.isActive ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <X className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              {owner.isVerified && (
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="secondary" className={`text-white ${sourceColors[owner.source]}`}>
                {sourceLabels[owner.source]}
              </Badge>
              {owner.gender && (
                <Badge className={getGenderBadgeColor(owner.gender)}>
                  {getGenderLabel(owner.gender)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && (
            <Dialog open={editing} onOpenChange={setEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden" aria-describedby="edit-owner-description">
                <DialogHeader className="pb-4">
                  <DialogTitle>Edit Owner</DialogTitle>
                  <DialogDescription id="edit-owner-description">
                    Update {owner.fullName}'s information
                  </DialogDescription>
                </DialogHeader>
                 <div className="overflow-y-auto max-h-[80vh] pr-2">
                   <OwnerForm 
                     owner={owner} 
                     onSaved={handleOwnerUpdated} 
                     onCancel={() => setEditing(false)} 
                   />
                 </div>
               </DialogContent>
            </Dialog>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owner.totalVisits || 0}</div>
            <p className="text-xs text-muted-foreground">
              {owner.lastVisit ? `Last: ${formatDate(owner.lastVisit)}` : 'No visits yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(owner.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owner.activePetsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently registered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {owner.userAccount ? 'Linked' : 'Standalone'}
            </div>
            <p className="text-xs text-muted-foreground">
              {owner.userAccount ? 'Has user account' : 'No user account'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="text-sm">{owner.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="text-sm">{owner.lastName}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{owner.email}</p>
              </div>
            </div>
            
            {owner.phone && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{owner.phone}</p>
                </div>
              </div>
            )}
            
            {owner.alternatePhone && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Alternate Phone</label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{owner.alternatePhone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {owner.address?.street ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Street Address</label>
                  <p className="text-sm">{owner.address.street}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-sm">{owner.address.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-sm">{owner.address.state}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ZIP Code</label>
                    <p className="text-sm">{owner.address.zipCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-sm">{owner.address.country}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No address information provided</p>
            )}
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {owner.emergencyContact?.name ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{owner.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                    <p className="text-sm">{owner.emergencyContact.relationship}</p>
                  </div>
                </div>
                
                {owner.emergencyContact.phone && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{owner.emergencyContact.phone}</p>
                    </div>
                  </div>
                )}
                
                {owner.emergencyContact.email && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{owner.emergencyContact.email}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No emergency contact information provided</p>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Communication Method</label>
                <p className="text-sm">{communicationLabels[owner.preferences?.communicationMethod] || 'Email'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Contact Time</label>
                <p className="text-sm">{contactTimeLabels[owner.preferences?.preferredContactTime] || 'Anytime'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Communication Preferences</label>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  {owner.preferences?.appointmentReminders ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Appointment Reminders</span>
                </div>
                <div className="flex items-center space-x-2">
                  {owner.preferences?.vaccinationReminders ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Vaccination Reminders</span>
                </div>
                <div className="flex items-center space-x-2">
                  {owner.preferences?.marketingCommunications ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Marketing Communications</span>
                </div>
              </div>
            </div>
            
            {owner.preferences?.notes && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm">{owner.preferences.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Preferred Payment Method</label>
              <p className="text-sm">{paymentMethodLabels[owner.billing?.preferredPaymentMethod] || 'Credit Card'}</p>
            </div>
            
            {owner.billing?.insuranceProvider && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Insurance Provider</label>
                  <p className="text-sm">{owner.billing.insuranceProvider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                  <p className="text-sm">{owner.billing.insurancePolicyNumber}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {owner.billing?.discountEligible ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">Eligible for Discount</span>
              </div>
              {owner.billing?.discountEligible && owner.billing?.discountReason && (
                <p className="text-sm text-muted-foreground ml-6">{owner.billing.discountReason}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Source Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              Source Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source</label>
              <Badge variant="secondary" className={`text-white ${sourceColors[owner.source]}`}>
                {sourceLabels[owner.source]}
              </Badge>
            </div>
            
            {owner.referredBy && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Referred By</label>
                <p className="text-sm">{owner.referredBy}</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
              <p className="text-sm">{formatDate(owner.registrationDate)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {owner.tags && owner.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {owner.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Associated Pets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PawPrint className="h-5 w-5 mr-2" />
            Associated Pets ({pets.length})
          </CardTitle>
          <CardDescription>
            Pets registered under this owner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingPets ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : pets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <Card key={pet._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={pet.photos?.[0]} />
                        <AvatarFallback>
                          {pet.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{pet.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {pet.breed} • {pet.age} years old
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {pet.species}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {pet.gender}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <PawPrint className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No pets found</h3>
              <p className="text-muted-foreground">
                This owner doesn't have any pets registered yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
