import mongoose from 'mongoose';

const TimeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const WorkingDaySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  timeSlots: [TimeSlotSchema]
}, { _id: false });

const PublicBookingSettingsSchema = new mongoose.Schema({
  // General Settings
  enabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Book an Appointment'
  },
  description: {
    type: String,
    default: 'Schedule your pet appointment online'
  },
  
  // Booking Rules
  requireOwnerRegistration: {
    type: Boolean,
    default: false
  },
  autoConfirm: {
    type: Boolean,
    default: false
  },
  maxAdvanceBookingDays: {
    type: Number,
    default: 30,
    min: 1,
    max: 365
  },
  minAdvanceBookingHours: {
    type: Number,
    default: 24,
    min: 0
  },
  maxBookingsPerDay: {
    type: Number,
    default: 20,
    min: 1
  },
  
  // Available Services for Public Booking
  availableServices: [{
    type: {
      type: String,
      enum: ['checkup', 'vaccination', 'grooming', 'consultation'],
      required: true
    },
    name: String,
    description: String,
    duration: {
      type: Number,
      default: 30
    },
    enabled: {
      type: Boolean,
      default: true
    }
  }],
  
  // Working Hours
  workingDays: [WorkingDaySchema],
  
  // Default Time Slots
  defaultTimeSlots: [{
    type: String
  }],
  
  // Booking Form Fields
  requiredFields: {
    ownerName: { type: Boolean, default: true },
    ownerEmail: { type: Boolean, default: true },
    ownerPhone: { type: Boolean, default: true },
    petName: { type: Boolean, default: true },
    petSpecies: { type: Boolean, default: true },
    petBreed: { type: Boolean, default: false },
    petAge: { type: Boolean, default: false },
    reason: { type: Boolean, default: true }
  },
  
  // Notification Settings
  notifications: {
    sendConfirmationEmail: {
      type: Boolean,
      default: true
    },
    sendReminderEmail: {
      type: Boolean,
      default: true
    },
    reminderHoursBefore: {
      type: Number,
      default: 24
    }
  },
  
  // Custom Messages
  confirmationMessage: {
    type: String,
    default: 'Thank you for booking! We will contact you shortly to confirm your appointment.'
  },
  termsAndConditions: {
    type: String,
    default: ''
  },
  
  // Blocked Dates
  blockedDates: [{
    date: Date,
    reason: String
  }]
}, {
  timestamps: true
});

// Initialize default working days and time slots
PublicBookingSettingsSchema.pre('save', function(next) {
  if (this.isNew && (!this.workingDays || this.workingDays.length === 0)) {
    const defaultTimeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];
    
    this.workingDays = [
      { day: 'Monday', enabled: true, timeSlots: defaultTimeSlots.map(time => ({ time, available: true })) },
      { day: 'Tuesday', enabled: true, timeSlots: defaultTimeSlots.map(time => ({ time, available: true })) },
      { day: 'Wednesday', enabled: true, timeSlots: defaultTimeSlots.map(time => ({ time, available: true })) },
      { day: 'Thursday', enabled: true, timeSlots: defaultTimeSlots.map(time => ({ time, available: true })) },
      { day: 'Friday', enabled: true, timeSlots: defaultTimeSlots.map(time => ({ time, available: true })) },
      { day: 'Saturday', enabled: false, timeSlots: [] },
      { day: 'Sunday', enabled: false, timeSlots: [] }
    ];
    
    this.defaultTimeSlots = defaultTimeSlots;
  }
  
  if (this.isNew && (!this.availableServices || this.availableServices.length === 0)) {
    this.availableServices = [
      { type: 'checkup', name: 'General Checkup', description: 'Routine health examination', duration: 30, enabled: true },
      { type: 'vaccination', name: 'Vaccination', description: 'Pet vaccination service', duration: 20, enabled: true },
      { type: 'grooming', name: 'Grooming', description: 'Pet grooming and hygiene', duration: 60, enabled: true },
      { type: 'consultation', name: 'Consultation', description: 'General consultation', duration: 30, enabled: true }
    ];
  }
  
  next();
});

// Static method to get or create settings
PublicBookingSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const PublicBookingSettings = mongoose.models.PublicBookingSettings || mongoose.model('PublicBookingSettings', PublicBookingSettingsSchema);
export default PublicBookingSettings;
