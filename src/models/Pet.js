import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required'],
    trim: true,
    maxlength: [50, 'Pet name cannot exceed 50 characters']
  },
  species: {
    type: String,
    required: [true, 'Pet species is required'],
    enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    trim: true,
    maxlength: [50, 'Breed cannot exceed 50 characters']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [50, 'Age seems too high for a pet']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [30, 'Color description cannot exceed 30 characters']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  neutered: {
    type: Boolean,
    default: false
  },
  microchipId: {
    type: String,
    trim: true
  },
  photos: [{
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Reference to Owner model (new structure)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: [true, 'Owner is required']
  },
  // Reference to User model (for backward compatibility)
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allow null/undefined values
  },
  // Legacy owner info (for backward compatibility)
  ownerInfo: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Owner name cannot exceed 100 characters']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please provide a valid phone number']
    }
  },
  medicalHistory: [{
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['checkup', 'treatment', 'surgery', 'emergency', 'vaccination', 'other'],
      default: 'other'
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Medical history description cannot exceed 500 characters']
    },
    veterinarian: {
      type: String,
      trim: true,
      maxlength: [100, 'Veterinarian name cannot exceed 100 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    cost: {
      type: Number,
      min: [0, 'Cost cannot be negative']
    }
  }],
  vaccinations: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    nextDue: {
      type: Date
    }
  }],
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
PetSchema.index({ owner: 1 });
PetSchema.index({ 'ownerInfo.email': 1 });
PetSchema.index({ species: 1 });
PetSchema.index({ name: 1, owner: 1 });
PetSchema.index({ createdAt: -1 });

// Virtual for pet's full info
PetSchema.virtual('fullInfo').get(function() {
  return `${this.name} - ${this.species}${this.breed ? ` (${this.breed})` : ''} - Owner: ${this.ownerInfo.name}`;
});

// Instance method to add medical history
PetSchema.methods.addMedicalRecord = function(data) {
  const { type = 'other', description, veterinarian, notes, cost, date = new Date() } = data;
  this.medicalHistory.push({
    date,
    type,
    description,
    veterinarian,
    notes,
    cost
  });
  return this.save();
};

// Instance method to add photo
PetSchema.methods.addPhoto = function(url, description = '') {
  this.photos.push({
    url,
    description,
    uploadedAt: new Date()
  });
  return this.save();
};

// Instance method to add vaccination
PetSchema.methods.addVaccination = function(name, date, nextDue) {
  this.vaccinations.push({
    name,
    date,
    nextDue
  });
  return this.save();
};

// Static method to find pets by owner ID
PetSchema.statics.findByOwner = function(ownerId) {
  return this.find({ owner: ownerId, isActive: true });
};

// Static method to find pets by owner email
PetSchema.statics.findByOwnerEmail = function(email) {
  return this.find({ 'ownerInfo.email': email.toLowerCase(), isActive: true });
};

// Static method to find pets by species
PetSchema.statics.findBySpecies = function(species) {
  return this.find({ species: species.toLowerCase(), isActive: true });
};

// Pre-save middleware
PetSchema.pre('save', function(next) {
  // Ensure owner email is lowercase
  if (this.ownerInfo && this.ownerInfo.email) {
    this.ownerInfo.email = this.ownerInfo.email.toLowerCase();
  }
  next();
});

export default mongoose.models.Pet || mongoose.model('Pet', PetSchema);