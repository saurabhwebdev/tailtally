'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Camera,
  UserCheck
} from 'lucide-react';
import { getModernAvatarUrl, getUserInitials, generateModernAvatarDataUri, generateModernAvatarHttpUrl } from '@/lib/modern-avatar';
import ModernAvatarGenerator from './modern-avatar-generator';

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isAvatarGeneratorOpen, setIsAvatarGeneratorOpen] = useState(false);
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    },
    professionalInfo: {
      licenseNumber: user?.professionalInfo?.licenseNumber || '',
      specialization: user?.professionalInfo?.specialization || '',
      yearsOfExperience: user?.professionalInfo?.yearsOfExperience || '',
      department: user?.professionalInfo?.department || '',
      employeeId: user?.professionalInfo?.employeeId || ''
    },
    preferences: {
      theme: user?.preferences?.theme || 'system',
      language: user?.preferences?.language || 'en',
      notifications: {
        email: user?.preferences?.notifications?.email ?? true,
        push: user?.preferences?.notifications?.push ?? true,
        sms: user?.preferences?.notifications?.sms ?? false
      }
    }
  });

  // Update form data when user changes (e.g., after avatar save)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        },
        professionalInfo: {
          licenseNumber: user.professionalInfo?.licenseNumber || '',
          specialization: user.professionalInfo?.specialization || '',
          yearsOfExperience: user.professionalInfo?.yearsOfExperience || '',
          department: user.professionalInfo?.department || '',
          employeeId: user.professionalInfo?.employeeId || ''
        },
        preferences: {
          theme: user.preferences?.theme || 'system',
          language: user.preferences?.language || 'en',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            push: user.preferences?.notifications?.push ?? true,
            sms: user.preferences?.notifications?.sms ?? false
          }
        }
      });
    }
  }, [user]);

  // Generate avatar image URL from seed
  useEffect(() => {
    const generateAvatar = async () => {
      // Use the most up-to-date avatar value
      const currentAvatar = formData.avatar || user?.avatar;
      const avatarSeed = getModernAvatarUrl({...user, avatar: currentAvatar}, 'lorelei', 128);
      if (avatarSeed) {
        try {
          // For modern avatars, prioritize HTTP API for better performance
          const parts = avatarSeed.split(':');
          if (parts.length === 4) {
            const [, style, seed, size] = parts;
            const httpUrl = generateModernAvatarHttpUrl(seed, style, parseInt(size));
            setAvatarImageUrl(httpUrl);
          } else {
            const dataUri = await generateModernAvatarDataUri(avatarSeed);
            setAvatarImageUrl(dataUri);
          }
        } catch (error) {
          console.error('Error generating avatar:', error);
        }
      }
    };

    generateAvatar();
  }, [user, user?.avatar, formData.avatar]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '');
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else if (name.startsWith('professionalInfo.')) {
      const field = name.replace('professionalInfo.', '');
      setFormData(prev => ({
        ...prev,
        professionalInfo: {
          ...prev.professionalInfo,
          [field]: field === 'yearsOfExperience' ? (value === '' ? '' : Number(value)) : value
        }
      }));
    } else if (name.startsWith('preferences.')) {
      const field = name.replace('preferences.', '');
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: value
        }
      }));
    } else if (name.startsWith('notifications.')) {
      const field = name.replace('notifications.', '');
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [field]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setMessage(null);
      
      await updateProfile(formData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user?.gender || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
        country: user?.address?.country || ''
      },
      professionalInfo: {
        licenseNumber: user?.professionalInfo?.licenseNumber || '',
        specialization: user?.professionalInfo?.specialization || '',
        yearsOfExperience: user?.professionalInfo?.yearsOfExperience || '',
        department: user?.professionalInfo?.department || '',
        employeeId: user?.professionalInfo?.employeeId || ''
      },
      preferences: {
        theme: user?.preferences?.theme || 'system',
        language: user?.preferences?.language || 'en',
        notifications: {
          email: user?.preferences?.notifications?.email ?? true,
          push: user?.preferences?.notifications?.push ?? true,
          sms: user?.preferences?.notifications?.sms ?? false
        }
      }
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleAvatarSave = async (avatarUrl) => {
    try {
      setUpdateLoading(true);
      setMessage(null);
      
      // Only send the avatar field, not the entire form data
      await updateProfile({ avatar: avatarUrl });
      
      // Update avatar in form data locally
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update avatar' });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Avatar URL is now handled by the useEffect above

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={updateLoading}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateLoading}
                  className="flex items-center gap-2"
                >
                  {updateLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <div className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 mx-auto ring-4 ring-gray-100">
                    <AvatarImage src={avatarImageUrl} alt={user.fullName || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold">
                      {getUserInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => setIsAvatarGeneratorOpen(true)}
                    title="Generate new avatar"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mb-4">
                  Click the camera to generate a new avatar
                </p>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                
                <div className="flex justify-center mt-4">
                  <Badge variant="secondary" className="capitalize">
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  {user.lastLogin && (
                    <div className="flex items-center justify-center text-muted-foreground">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Last active {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  {isEditing ? (
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user.firstName || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  {isEditing ? (
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user.lastName || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                  {isEditing ? (
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{user.gender || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md min-h-[60px]">
                    <span>{user.bio || 'No bio provided'}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="mt-8">
                <h4 className="text-md font-semibold mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Address
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street</label>
                    {isEditing ? (
                      <Input
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span>{user.address?.street || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    {isEditing ? (
                      <Input
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span>{user.address?.city || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State</label>
                    {isEditing ? (
                      <Input
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span>{user.address?.state || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                    {isEditing ? (
                      <Input
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        placeholder="Enter ZIP code"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span>{user.address?.zipCode || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    {isEditing ? (
                      <Input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span>{user.address?.country || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Avatar Generator */}
        <ModernAvatarGenerator
          user={user}
          isOpen={isAvatarGeneratorOpen}
          onClose={() => setIsAvatarGeneratorOpen(false)}
          onSave={handleAvatarSave}
        />
      </div>
    </DashboardLayout>
  );
}