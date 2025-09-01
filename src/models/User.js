import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // Contact Information
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
  },
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
  
  // Role and Permissions
  role: {
    type: String,
    enum: {
      values: ['admin', 'veterinarian', 'staff', 'customer'],
      message: 'Role must be one of: admin, veterinarian, staff, customer'
    },
    required: [true, 'Role is required'],
    default: 'customer'
  },
  permissions: [{
    type: String,
    enum: [
      'read_pets', 'write_pets', 'delete_pets',
      'read_users', 'write_users', 'delete_users',
      'read_owners', 'write_owners', 'delete_owners',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records', 'delete_medical_records',
      'read_inventory', 'write_inventory', 'delete_inventory', 'manage_stock',
      'read_sales', 'write_sales', 'delete_sales', 'process_payments',
      'read_invoices', 'write_invoices', 'delete_invoices',
      'manage_notifications', 'send_notifications',
      'manage_system', 'view_reports', 'manage_billing', 'access_admin'
    ]
  }],
  
  // Professional Information (for veterinarians and staff)
  professionalInfo: {
    licenseNumber: {
      type: String,
      trim: true,
      maxlength: [50, 'License number cannot exceed 50 characters']
    },
    specialization: {
      type: String,
      trim: true,
      maxlength: [100, 'Specialization cannot exceed 100 characters']
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [70, 'Years of experience seems too high']
    },
    department: {
      type: String,
      trim: true,
      maxlength: [50, 'Department cannot exceed 50 characters']
    },
    employeeId: {
      type: String,
      trim: true,
      maxlength: [20, 'Employee ID cannot exceed 20 characters']
    }
  },
  
  // Account Status and Security
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  emailVerificationExpires: {
    type: Date,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  
  // Profile Information
  avatar: {
    type: String, // URL to profile image
    trim: true,
    maxlength: [5000, 'Avatar URL cannot exceed 5000 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say', ''],
    lowercase: true
  },
  
  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
// Note: email index is automatically created by unique: true constraint
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ 'professionalInfo.employeeId': 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to set default permissions based on role
UserSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isNew) {
    this.permissions = this.getDefaultPermissions();
  }
  next();
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get default permissions based on role
UserSchema.methods.getDefaultPermissions = function() {
  const rolePermissions = {
    admin: [
      'read_pets', 'write_pets', 'delete_pets',
      'read_users', 'write_users', 'delete_users',
      'read_owners', 'write_owners', 'delete_owners',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records', 'delete_medical_records',
      'read_inventory', 'write_inventory', 'delete_inventory', 'manage_stock',
      'read_sales', 'write_sales', 'delete_sales', 'process_payments',
      'read_invoices', 'write_invoices', 'delete_invoices',
      'manage_notifications', 'send_notifications',
      'manage_system', 'view_reports', 'manage_billing', 'access_admin'
    ],
    veterinarian: [
      'read_pets', 'write_pets',
      'read_owners', 'write_owners',
      'read_appointments', 'write_appointments', 'delete_appointments',
      'read_medical_records', 'write_medical_records',
      'read_inventory', 'write_inventory',
      'read_sales', 'write_sales', 'process_payments',
      'read_invoices', 'write_invoices',
      'send_notifications',
      'view_reports', 'manage_billing'
    ],
    staff: [
      'read_pets', 'write_pets',
      'read_owners', 'write_owners',
      'read_appointments', 'write_appointments',
      'read_medical_records',
      'read_inventory', 'write_inventory', 'manage_stock',
      'read_sales', 'write_sales', 'process_payments',
      'read_invoices', 'write_invoices',
      'manage_billing'
    ],
    customer: [
      'read_pets', 'read_owners', 'read_appointments'
    ]
  };
  
  return rolePermissions[this.role] || [];
};

// Instance method to check if user has permission
UserSchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Instance method to increment login attempts
UserSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: {
        loginAttempts: 1
      },
      $unset: {
        lockUntil: 1
      }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we're at max attempts and not locked yet, lock the account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // Lock for 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      loginAttempts: 1,
      lockUntil: 1
    }
  });
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), isActive: true });
};

// Static method to find users by role
UserSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method for authentication
UserSchema.statics.authenticate = async function(email, password) {
  const user = await this.findOne({ email: email.toLowerCase() })
    .select('+password +loginAttempts +lockUntil');
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  // Check if account is locked
  if (user.isLocked) {
    return { success: false, message: 'Account is temporarily locked. Please try again later.' };
  }
  
  // Check if account is active
  if (!user.isActive) {
    return { success: false, message: 'Account is deactivated. Please contact support.' };
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incLoginAttempts();
    return { success: false, message: 'Invalid email or password' };
  }
  
  // Success - reset login attempts and update last login
  await user.resetLoginAttempts();
  await user.updateOne({ lastLogin: new Date() });
  
  // Remove sensitive fields
  user.password = undefined;
  user.loginAttempts = undefined;
  user.lockUntil = undefined;
  
  return { success: true, user };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);