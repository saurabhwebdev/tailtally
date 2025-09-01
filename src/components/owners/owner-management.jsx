'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  PawPrint,
  AlertTriangle,
  User,
  Building,
  Heart,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import OwnerForm from './owner-form';
import OwnerDetail from './owner-detail';
import { generateOwnerAvatarUrl } from '@/lib/owner-avatar';

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

export default function OwnerManagement() {
  const { user: currentUser, hasRole, apiRequest } = useAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalCount: 0
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [editingOwner, setEditingOwner] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    ownerId: null,
    ownerName: ''
  });
  const [emailStatus, setEmailStatus] = useState({});

  // Fetch owners
  const fetchOwners = async (page = 1, city = selectedCity, source = selectedSource, search = searchTerm) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (city && city !== 'all') {
        params.append('city', city);
      }
      
      if (source && source !== 'all') {
        params.append('source', source);
      }
      
      if (search) {
        params.append('search', search);
      }

      const data = await apiRequest(`/api/owners?${params}`);

      if (data.success) {
        setOwners(data.data.owners || []);
        setPagination(data.data.pagination || {});
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch owners');
      console.error('Fetch owners error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (ownerId, ownerName) => {
    setDeleteDialog({
      isOpen: true,
      ownerId,
      ownerName
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    const { ownerId } = deleteDialog;
    
    try {
      const data = await apiRequest(`/api/owners/${ownerId}`, {
        method: 'DELETE'
      });

      if (data.success) {
        // Refresh the list
        await fetchOwners(pagination.current, selectedCity, selectedSource, searchTerm);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete owner');
      console.error('Delete owner error:', err);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    fetchOwners(1, selectedCity, selectedSource, value);
  };

  // Handle city filter
  const handleCityFilter = (city) => {
    setSelectedCity(city);
    fetchOwners(1, city, selectedSource, searchTerm);
  };

  // Handle source filter
  const handleSourceFilter = (source) => {
    setSelectedSource(source);
    fetchOwners(1, selectedCity, source, searchTerm);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchOwners(page, selectedCity, selectedSource, searchTerm);
  };

  // Owner added/updated handler
  const handleOwnerSaved = () => {
    setIsAddDialogOpen(false);
    setEditingOwner(null);
    fetchOwners(pagination.current, selectedCity, selectedSource, searchTerm);
  };

  // Handle email sending
  const handleSendEmail = async (owner, emailType = 'welcome') => {
    const ownerId = owner._id;
    
    try {
      // Set loading state
      setEmailStatus(prev => ({
        ...prev,
        [ownerId]: { status: 'loading', message: 'Sending email...' }
      }));

      // Show loading toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`Sending email to ${owner.firstName || 'owner'}...`, 'info', 2000);
      }

      const response = await apiRequest('/api/owners/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: emailType,
          ownerId: ownerId,
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
          [ownerId]: { 
            status: statusType, 
            message: message
          }
        }));

        // Show success/skipped toast
        if (typeof window !== 'undefined' && window.showToast) {
          if (response.skipped) {
            window.showToast(`Email skipped for ${owner.firstName || 'owner'} - communication preferences`, 'info', 4000);
          } else {
            window.showToast(`✅ Email sent successfully to ${owner.firstName || 'owner'}!`, 'success', 4000);
          }
        }
      } else {
        const errorMessage = response.error || 'Failed to send email';
        setEmailStatus(prev => ({
          ...prev,
          [ownerId]: { status: 'error', message: errorMessage }
        }));

        // Show error toast
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(`❌ Failed to send email to ${owner.firstName || 'owner'}: ${errorMessage}`, 'error', 5000);
        }
      }
    } catch (error) {
      console.error('Email sending error:', error);
      const errorMessage = 'Failed to send email';
      setEmailStatus(prev => ({
        ...prev,
        [ownerId]: { status: 'error', message: errorMessage }
      }));

      // Show error toast
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`❌ Network error while sending email to ${owner.firstName || 'owner'}. Please try again.`, 'error', 5000);
      }
    }

    // Clear status after 5 seconds
    setTimeout(() => {
      setEmailStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[ownerId];
        return newStatus;
      });
    }, 5000);
  };

  // Get email button content based on status
  const getEmailButtonContent = (owner) => {
    const status = emailStatus[owner._id];
    
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
    fetchOwners();
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
          <h1 className="text-3xl font-bold tracking-tight">Owner Management</h1>
          <p className="text-muted-foreground">
            Manage pet owners, contact information, and preferences
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Owner
            </Button>
          </DialogTrigger>
                     <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
             <DialogHeader className="pb-4">
               <DialogTitle>Add New Owner</DialogTitle>
               <DialogDescription>
                 Enter the owner's information below
               </DialogDescription>
             </DialogHeader>
             <div className="overflow-y-auto max-h-[80vh] pr-2">
               <OwnerForm onSaved={handleOwnerSaved} onCancel={() => setIsAddDialogOpen(false)} />
             </div>
           </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              All registered owners
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {owners.filter(owner => owner.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Current page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {owners.reduce((total, owner) => total + (owner.activePetsCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current page
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{owners.reduce((total, owner) => total + (owner.totalSpent || 0), 0).toLocaleString()}
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
                  placeholder="Search owners by name, email, phone, or city..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCity} onValueChange={handleCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {Array.from(new Set(owners.map(owner => owner.address?.city).filter(Boolean))).map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedSource} onValueChange={handleSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {Object.entries(sourceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Owners List</CardTitle>
          <CardDescription>
            {pagination.totalCount} total owners found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Pets</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {owners.map((owner) => (
                <TableRow key={owner._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage 
                          src={owner.avatar || generateOwnerAvatarUrl(owner)} 
                          alt={`${owner.fullName} avatar`}
                        />
                        <AvatarFallback>
                          {owner.firstName?.charAt(0)}{owner.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{owner.fullName}</div>
                        <div className="text-sm text-muted-foreground">
                          {owner.userAccount ? 'Has Account' : 'No Account'}
                          {owner.tags.length > 0 && (
                            <span className="ml-2">
                              {owner.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="mr-1 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {owner.tags.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{owner.tags.length - 2} more
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{owner.email}</span>
                      </div>
                      {owner.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{owner.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {owner.address?.city && owner.address?.state ? (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{owner.address.city}, {owner.address.state}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not provided</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <PawPrint className="h-4 w-4 text-muted-foreground" />
                      <span>{owner.activePetsCount || 0} pets</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-white ${sourceColors[owner.source]}`}>
                      {sourceLabels[owner.source]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₹{(owner.totalSpent || 0).toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {owner.lastVisit ? (
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{new Date(owner.lastVisit).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Never</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOwner(owner)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && (
                          <DropdownMenuItem onClick={() => setEditingOwner(owner)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {(hasRole('admin') || hasRole('veterinarian') || hasRole('staff')) && owner.email && (
                          <DropdownMenuItem 
                            onClick={() => handleSendEmail(owner, 'welcome')}
                            disabled={emailStatus[owner._id]?.status === 'loading'}
                            className={getEmailButtonContent(owner).className}
                          >
                            {getEmailButtonContent(owner).icon}
                            {getEmailButtonContent(owner).text}
                          </DropdownMenuItem>
                        )}
                        {(hasRole('admin') || hasRole('veterinarian')) && (
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(owner._id, owner.fullName)}
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

          {owners.length === 0 && !loading && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No owners found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedCity !== 'all' || selectedSource !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first owner to get started'
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
                {pagination.totalCount} owners
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

             {/* Owner Detail Dialog */}
       {selectedOwner && (
         <Dialog open={!!selectedOwner} onOpenChange={() => setSelectedOwner(null)}>
           <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
             <DialogHeader className="sr-only">
               <DialogTitle>Owner Details - {selectedOwner.fullName}</DialogTitle>
             </DialogHeader>
             <div className="overflow-y-auto max-h-[85vh] pr-2">
               <OwnerDetail owner={selectedOwner} onClose={() => setSelectedOwner(null)} />
             </div>
           </DialogContent>
         </Dialog>
       )}

       {/* Edit Owner Dialog */}
       {editingOwner && (
         <Dialog open={!!editingOwner} onOpenChange={() => setEditingOwner(null)}>
           <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden">
             <DialogHeader className="pb-4">
               <DialogTitle>Edit Owner</DialogTitle>
               <DialogDescription>
                 Update {editingOwner.fullName}'s information
               </DialogDescription>
             </DialogHeader>
             <div className="overflow-y-auto max-h-[80vh] pr-2">
               <OwnerForm 
                 owner={editingOwner} 
                 onSaved={handleOwnerSaved} 
                 onCancel={() => setEditingOwner(null)} 
               />
             </div>
           </DialogContent>
         </Dialog>
       )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, ownerId: null, ownerName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Owner"
        description={`Are you sure you want to delete "${deleteDialog.ownerName}"? This action cannot be undone and will permanently remove the owner and all associated data.`}
        confirmText="Delete Owner"
        cancelText="Cancel"
        variant="destructive"
        loading={loading}
      />
    </div>
  );
}
