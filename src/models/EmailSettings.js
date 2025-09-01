import mongoose from 'mongoose';

const EmailSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Gmail Configuration
  gmail: {
    email: {
      type: String,
      required: [true, 'Gmail email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@gmail\.com$/, 'Please provide a valid Gmail address']
    },
    appPassword: {
      type: String,
      required: [true, 'Gmail app password is required'],
      minlength: [16, 'Gmail app password must be 16 characters'],
      maxlength: [16, 'Gmail app password must be 16 characters']
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, 'Display name cannot exceed 100 characters']
    }
  },
  
  // Email Configuration
  settings: {
    isEnabled: {
      type: Boolean,
      default: true
    },
    testEmailSent: {
      type: Boolean,
      default: false
    },
    lastTestDate: {
      type: Date
    },
    testEmailStatus: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'pending'
    },
    testEmailError: {
      type: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
EmailSettingsSchema.index({ 'gmail.email': 1 });

// Virtual for masked app password (for display purposes)
EmailSettingsSchema.virtual('gmail.maskedAppPassword').get(function() {
  if (!this.gmail.appPassword) return '';
  return '****-****-****-' + this.gmail.appPassword.slice(-4);
});

// Instance method to test email configuration
EmailSettingsSchema.methods.testEmailConnection = async function() {
  try {
    // This will be implemented in the email service
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Static method to find settings by user ID
EmailSettingsSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

export default mongoose.models.EmailSettings || mongoose.model('EmailSettings', EmailSettingsSchema);