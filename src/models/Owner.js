import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  alternatePhone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      trim: true,
      maxlength: [100, 'Street address cannot exceed 100 characters']
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    zipCode: {
      type: String,
      trim: true,
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid ZIP code']
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, 'Country cannot exceed 50 characters'],
      default: 'USA'
    }
  },
  
  // Emergency Contact
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    }
  },
  
  // Owner Preferences
  preferences: {
    communicationMethod: {
      type: String,
      enum: ['email', 'phone', 'sms', 'mail'],
      default: 'email'
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    vaccinationReminders: {
      type: Boolean,
      default: true
    },
    marketingCommunications: {
      type: Boolean,
      default: false
    },
    preferredContactTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'anytime'],
      default: 'anytime'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  
  // Financial Information
  billing: {
    preferredPaymentMethod: {
      type: String,
      enum: ['cash', 'credit_card', 'debit_card', 'check', 'insurance', 'upi', 'net_banking', 'wallet', 'emi'],
      default: 'cash'
    },
    insuranceProvider: {
      type: String,
      trim: true,
      maxlength: [100, 'Insurance provider cannot exceed 100 characters']
    },
    insurancePolicyNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'Policy number cannot exceed 50 characters']
    },
    discountEligible: {
      type: Boolean,
      default: false
    },
    discountReason: {
      type: String,
      trim: true,
      maxlength: [200, 'Discount reason cannot exceed 200 characters']
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  
  // Relationship to User Account (if exists)
  userAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allow null/undefined values
  },
  
  // Owner History
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date
  },
  totalVisits: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  
  // Tags and Categories
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  
  // Source Information
  source: {
    type: String,
    enum: ['walk_in', 'referral', 'online', 'advertisement', 'social_media', 'other'],
    default: 'walk_in'
  },
  referredBy: {
    type: String,
    trim: true,
    maxlength: [100, 'Referral source cannot exceed 100 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// Indexes
// Note: email index is automatically created by unique: true property
OwnerSchema.index({ phone: 1 });
OwnerSchema.index({ isActive: 1 });
OwnerSchema.index({ 'address.city': 1, 'address.state': 1 });
OwnerSchema.index({ createdAt: -1 });
OwnerSchema.index({ userAccount: 1 });

// Virtual for full name
OwnerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for full address
OwnerSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  
  const parts = [
    this.address.street,
    this.address.city,
    this.address.state,
    this.address.zipCode
  ].filter(Boolean);
  
  return parts.join(', ');
});

// Virtual for pets count
OwnerSchema.virtual('petsCount', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner',
  count: true
});

// Virtual for active pets count
OwnerSchema.virtual('activePetsCount', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner',
  count: true,
  match: { isActive: true }
});

// Instance method to get all pets
OwnerSchema.methods.getPets = function() {
  return this.model('Pet').find({ owner: this._id, isActive: true });
};

// Instance method to get active pets
OwnerSchema.methods.getActivePets = function() {
  return this.model('Pet').find({ owner: this._id, isActive: true });
};

// Instance method to add tag
OwnerSchema.methods.addTag = function(tag) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

// Instance method to remove tag
OwnerSchema.methods.removeTag = function(tag) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Instance method to update last visit
OwnerSchema.methods.updateLastVisit = function() {
  this.lastVisit = new Date();
  this.totalVisits += 1;
  return this.save();
};

// Instance method to add to total spent
OwnerSchema.methods.addToTotalSpent = function(amount) {
  this.totalSpent += amount;
  return this.save();
};

// Static method to find owner by email
OwnerSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

// Static method to find owner by phone
OwnerSchema.statics.findByPhone = function(phone) {
  return this.findOne({ phone, isActive: true });
};

// Static method to find owners by city
OwnerSchema.statics.findByCity = function(city) {
  return this.find({ 'address.city': new RegExp(city, 'i'), isActive: true });
};

// Static method to find owners by tags
OwnerSchema.statics.findByTags = function(tags) {
  return this.find({ tags: { $in: tags }, isActive: true });
};

// Static method to get top spenders
OwnerSchema.statics.getTopSpenders = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ totalSpent: -1 })
    .limit(limit);
};

// Static method to get recent registrations
OwnerSchema.statics.getRecentRegistrations = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ registrationDate: -1 })
    .limit(limit);
};

// Pre-save middleware
OwnerSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  
  // Ensure emergency contact email is lowercase
  if (this.emergencyContact && this.emergencyContact.email) {
    this.emergencyContact.email = this.emergencyContact.email.toLowerCase();
  }
  
  next();
});

export default mongoose.models.Owner || mongoose.model('Owner', OwnerSchema);
