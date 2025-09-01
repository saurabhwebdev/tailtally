import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  // Appointment Identification
  appointmentNumber: {
    type: String,
    unique: true,
    required: [true, 'Appointment number is required']
  },
  
  // Pet and Owner Information
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Pet is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'Owner is required']
  },
  
  // Appointment Details
  type: {
    type: String,
    enum: ['checkup', 'vaccination', 'surgery', 'grooming', 'emergency', 'other'],
    required: [true, 'Appointment type is required']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number, // Duration in minutes
    default: 30,
    min: [5, 'Duration must be at least 5 minutes']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  
  // Status Information
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  
  // Staff Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Notification Settings
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderDate: Date,
    confirmationSent: {
      type: Boolean,
      default: false
    },
    confirmationDate: Date
  },
  
  // Audit Trail
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AppointmentSchema.index({ pet: 1 });
AppointmentSchema.index({ owner: 1 });
AppointmentSchema.index({ date: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ assignedTo: 1 });

// Virtual for formatted time
AppointmentSchema.virtual('formattedTime').get(function() {
  return this.time;
});

// Static method to find today's appointments
AppointmentSchema.statics.findTodaysAppointments = function() {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
  return this.find({
    date: { $gte: startOfDay, $lte: endOfDay },
    status: { $nin: ['cancelled', 'no-show'] },
    isActive: true
  })
  .populate('pet', 'name species')
  .populate('owner', 'firstName lastName')
  .sort({ time: 1 });
};

// Static method to find upcoming appointments
AppointmentSchema.statics.findUpcomingAppointments = function(days = 7) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + days);
  
  return this.find({
    date: { $gte: startOfDay, $lte: endDate },
    status: { $nin: ['cancelled', 'no-show'] },
    isActive: true
  })
  .populate('pet', 'name species')
  .populate('owner', 'firstName lastName')
  .sort({ date: 1, time: 1 });
};

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
export default Appointment;