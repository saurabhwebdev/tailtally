'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PublicBookingPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    petName: '',
    petSpecies: '',
    petBreed: '',
    petAge: '',
    serviceType: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    additionalNotes: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (formData.appointmentDate) {
      fetchAvailableSlots(formData.appointmentDate);
    }
  }, [formData.appointmentDate]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/public-booking');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setSettings(data.data);
      } else {
        setError(data.message || 'Public booking is not available');
      }
    } catch (error) {
      setError('Failed to load booking system');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`/api/public/book-appointment?date=${date}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAvailableSlots(data.data.timeSlots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch('/api/public/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBookingSuccess(true);
        setBookingDetails(data.data);
      } else {
        setError(data.message || 'Failed to submit booking');
      }
    } catch (error) {
      setError('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate min and max dates
  const getMinDate = () => {
    if (!settings) return '';
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + (settings.minAdvanceBookingHours || 24));
    return minDate.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    if (!settings) return '';
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + (settings.maxAdvanceBookingDays || 30));
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <PawPrint className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading booking system...</p>
        </div>
      </div>
    );
  }

  if (!settings || !settings.enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'Online booking is currently unavailable. Please call us to schedule an appointment.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your appointment request has been {bookingDetails.status === 'confirmed' ? 'confirmed' : 'submitted'}.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">Appointment Number:</p>
              <p className="text-lg font-mono">{bookingDetails.appointmentNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {bookingDetails.confirmationMessage}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Book Another Appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <PawPrint className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-3xl">{settings.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{settings.description}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Owner Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">
                      Full Name {settings.requiredFields?.ownerName && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="ownerName"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      required={settings.requiredFields?.ownerName}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">
                      Email {settings.requiredFields?.ownerEmail && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="ownerEmail"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                      required={settings.requiredFields?.ownerEmail}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerPhone">
                      Phone {settings.requiredFields?.ownerPhone && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="ownerPhone"
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                      required={settings.requiredFields?.ownerPhone}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Pet Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Pet Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="petName">
                      Pet Name {settings.requiredFields?.petName && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                      id="petName"
                      value={formData.petName}
                      onChange={(e) => handleInputChange('petName', e.target.value)}
                      required={settings.requiredFields?.petName}
                      placeholder="Buddy"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="petSpecies">
                      Species {settings.requiredFields?.petSpecies && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                      value={formData.petSpecies}
                      onValueChange={(value) => handleInputChange('petSpecies', value)}
                      required={settings.requiredFields?.petSpecies}
                    >
                      <SelectTrigger id="petSpecies">
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="rabbit">Rabbit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {settings.requiredFields?.petBreed && (
                    <div className="space-y-2">
                      <Label htmlFor="petBreed">
                        Breed <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="petBreed"
                        value={formData.petBreed}
                        onChange={(e) => handleInputChange('petBreed', e.target.value)}
                        required
                        placeholder="Golden Retriever"
                      />
                    </div>
                  )}
                  {settings.requiredFields?.petAge && (
                    <div className="space-y-2">
                      <Label htmlFor="petAge">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="petAge"
                        value={formData.petAge}
                        onChange={(e) => handleInputChange('petAge', e.target.value)}
                        required
                        placeholder="3 years"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">
                      Service Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value) => handleInputChange('serviceType', value)}
                      required
                    >
                      <SelectTrigger id="serviceType">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.availableServices?.map((service) => (
                          <SelectItem key={service.type} value={service.type}>
                            {service.name} ({service.duration} min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDate">
                      Preferred Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appointmentTime">
                      Preferred Time <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.appointmentTime}
                      onValueChange={(value) => handleInputChange('appointmentTime', value)}
                      required
                      disabled={!formData.appointmentDate || availableSlots.length === 0}
                    >
                      <SelectTrigger id="appointmentTime">
                        <SelectValue placeholder={
                          !formData.appointmentDate 
                            ? "Select date first" 
                            : availableSlots.length === 0 
                              ? "No slots available" 
                              : "Select time"
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot.time} value={slot.time}>
                            {slot.time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Reason for Visit {settings.requiredFields?.reason && <span className="text-red-500">*</span>}
                  </Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    required={settings.requiredFields?.reason}
                    placeholder="Please describe the reason for your visit..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information you'd like us to know..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              {settings.termsAndConditions && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{settings.termsAndConditions}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
