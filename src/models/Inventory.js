import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'food', 'treats', 'toys', 'medication', 'supplies', 
      'grooming', 'accessories', 'health', 'cleaning', 'other'
    ],
    lowercase: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [50, 'Subcategory cannot exceed 50 characters']
  },
  
  // Pricing Information
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  markup: {
    type: Number,
    min: [0, 'Markup cannot be negative'],
    default: 0
  },
  
  // GST and Tax Information
  gst: {
    isGSTApplicable: {
      type: Boolean,
      default: true
    },
    gstRate: {
      type: Number,
      min: [0, 'GST rate cannot be negative'],
      max: [100, 'GST rate cannot exceed 100%'],
      default: 18 // Default 18% GST for pet supplies
    },
    hsnCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{4,8}$/, 'HSN code must be 4-8 digits']
    },
    sacCode: {
      type: String,
      trim: true,
      match: [/^[0-9]{6}$/, 'SAC code must be 6 digits']
    },
    gstType: {
      type: String,
      enum: ['CGST_SGST', 'IGST', 'EXEMPT', 'NIL_RATED', 'ZERO_RATED'],
      default: 'CGST_SGST'
    },
    taxCategory: {
      type: String,
      enum: ['GOODS', 'SERVICES'],
      default: 'GOODS'
    },
    cgstRate: {
      type: Number,
      min: [0, 'CGST rate cannot be negative'],
      max: [50, 'CGST rate cannot exceed 50%'],
      default: function() {
        return this.gstType === 'CGST_SGST' ? this.gstRate / 2 : 0;
      }
    },
    sgstRate: {
      type: Number,
      min: [0, 'SGST rate cannot be negative'],
      max: [50, 'SGST rate cannot exceed 50%'],
      default: function() {
        return this.gstType === 'CGST_SGST' ? this.gstRate / 2 : 0;
      }
    },
    igstRate: {
      type: Number,
      min: [0, 'IGST rate cannot be negative'],
      max: [100, 'IGST rate cannot exceed 100%'],
      default: function() {
        return this.gstType === 'IGST' ? this.gstRate : 0;
      }
    },
    cessRate: {
      type: Number,
      min: [0, 'Cess rate cannot be negative'],
      default: 0
    },
    reverseCharge: {
      type: Boolean,
      default: false
    },
    placeOfSupply: {
      stateCode: {
        type: String,
        trim: true,
        match: [/^[0-9]{2}$/, 'State code must be 2 digits']
      },
      stateName: {
        type: String,
        trim: true,
        maxlength: [50, 'State name cannot exceed 50 characters']
      }
    }
  },
  
  // Price breakdown with GST
  priceBreakdown: {
    basePrice: {
      type: Number,
      min: [0, 'Base price cannot be negative']
    },
    gstAmount: {
      type: Number,
      min: [0, 'GST amount cannot be negative']
    },
    totalPriceWithGST: {
      type: Number,
      min: [0, 'Total price cannot be negative']
    }
  },
  
  // Stock Information
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  minStockLevel: {
    type: Number,
    min: [0, 'Minimum stock level cannot be negative'],
    default: 5
  },
  maxStockLevel: {
    type: Number,
    min: [0, 'Maximum stock level cannot be negative']
  },
  
  // Product Details
  sku: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens']
  },
  barcode: {
    type: String,
    trim: true,
    sparse: true
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand cannot exceed 50 characters']
  },
  supplier: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Supplier name cannot exceed 100 characters']
    },
    contactInfo: {
      email: String,
      phone: String,
      address: String
    },
    supplierCode: String
  },
  
  // Pet-Specific Information
  petSpecies: [{
    type: String,
    enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other', 'all'],
    lowercase: true
  }],
  ageGroup: {
    type: String,
    enum: ['puppy', 'adult', 'senior', 'all'],
    default: 'all'
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large', 'universal'],
    default: 'universal'
  },
  
  // Expiration and Safety
  expirationDate: {
    type: Date
  },
  batchNumber: {
    type: String,
    trim: true
  },
  isPerishable: {
    type: Boolean,
    default: false
  },
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  
  // Status and Flags
  isActive: {
    type: Boolean,
    default: true
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  saleStartDate: {
    type: Date
  },
  saleEndDate: {
    type: Date
  },
  
  // Usage Tracking
  totalSold: {
    type: Number,
    default: 0,
    min: [0, 'Total sold cannot be negative']
  },
  lastOrderDate: {
    type: Date
  },
  lastSaleDate: {
    type: Date
  },
  
  // Relationships
  usedByPets: [{
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner'
    },
    quantity: Number,
    date: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // Stock History
  stockMovements: [{
    type: {
      type: String,
      enum: ['sale', 'purchase', 'adjustment', 'return', 'damage', 'expired'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    reference: String // Invoice number, order number, etc.
  }],
  
  // Notes and Metadata
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
InventorySchema.index({ category: 1, subcategory: 1 });
InventorySchema.index({ name: 1 });
InventorySchema.index({ petSpecies: 1 });
InventorySchema.index({ quantity: 1 });
InventorySchema.index({ expirationDate: 1 });
InventorySchema.index({ isActive: 1 });
InventorySchema.index({ 'supplier.name': 1 });
// Note: SKU index is automatically created by unique: true constraint

// Virtual fields
InventorySchema.virtual('isLowStock').get(function() {
  return this.quantity <= this.minStockLevel;
});

InventorySchema.virtual('isExpiringSoon').get(function() {
  if (!this.expirationDate) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return this.expirationDate <= thirtyDaysFromNow;
});

InventorySchema.virtual('profitMargin').get(function() {
  if (!this.cost || this.cost === 0) return 0;
  return ((this.price - this.cost) / this.cost) * 100;
});

InventorySchema.virtual('currentPrice').get(function() {
  if (this.isOnSale && this.salePrice && 
      this.saleStartDate <= new Date() && 
      (!this.saleEndDate || this.saleEndDate >= new Date())) {
    return this.salePrice;
  }
  return this.price;
});

// Instance Methods
InventorySchema.methods.calculateGSTBreakdown = function(price = null) {
  const salePrice = price || this.currentPrice || this.price;
  
  if (!this.gst.isGSTApplicable) {
    return {
      basePrice: salePrice,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      cessAmount: 0,
      totalGST: 0,
      totalPriceWithGST: salePrice
    };
  }

  const gstRate = this.gst.gstRate / 100;
  const cessRate = this.gst.cessRate / 100;
  
  // Calculate base price (price without GST)
  const basePrice = salePrice / (1 + gstRate + cessRate);
  
  // Calculate individual GST components
  const cgstAmount = this.gst.gstType === 'CGST_SGST' ? basePrice * (this.gst.cgstRate / 100) : 0;
  const sgstAmount = this.gst.gstType === 'CGST_SGST' ? basePrice * (this.gst.sgstRate / 100) : 0;
  const igstAmount = this.gst.gstType === 'IGST' ? basePrice * (this.gst.igstRate / 100) : 0;
  const cessAmount = basePrice * cessRate;
  
  const totalGST = cgstAmount + sgstAmount + igstAmount + cessAmount;
  
  return {
    basePrice: Math.round(basePrice * 100) / 100,
    cgstAmount: Math.round(cgstAmount * 100) / 100,
    sgstAmount: Math.round(sgstAmount * 100) / 100,
    igstAmount: Math.round(igstAmount * 100) / 100,
    cessAmount: Math.round(cessAmount * 100) / 100,
    totalGST: Math.round(totalGST * 100) / 100,
    totalPriceWithGST: Math.round(salePrice * 100) / 100
  };
};

InventorySchema.methods.updateGSTSettings = function(gstSettings) {
  // Update GST configuration
  this.gst = { ...this.gst, ...gstSettings };
  
  // Recalculate price breakdown
  if (this.gst.isGSTApplicable) {
    const breakdown = this.calculateGSTBreakdown();
    this.priceBreakdown = {
      basePrice: breakdown.basePrice,
      gstAmount: breakdown.totalGST,
      totalPriceWithGST: breakdown.totalPriceWithGST
    };
  } else {
    this.priceBreakdown = {
      basePrice: this.price,
      gstAmount: 0,
      totalPriceWithGST: this.price
    };
  }
  
  return this.save();
};

InventorySchema.methods.adjustStock = function(quantity, type = 'adjustment', user = null, notes = '', reference = '') {
  // Add stock movement record
  this.stockMovements.push({
    type,
    quantity,
    date: new Date(),
    user,
    notes,
    reference
  });
  
  // Update quantity
  this.quantity += quantity;
  
  // Update last order/sale date
  if (type === 'sale') {
    this.lastSaleDate = new Date();
    this.totalSold += Math.abs(quantity);
  } else if (type === 'purchase') {
    this.lastOrderDate = new Date();
  }
  
  return this.save();
};

InventorySchema.methods.sellToPet = function(petId, ownerId, quantity, notes = '') {
  // Record the sale to pet
  this.usedByPets.push({
    pet: petId,
    owner: ownerId,
    quantity,
    date: new Date(),
    notes
  });
  
  // Adjust stock
  return this.adjustStock(-quantity, 'sale', null, `Sold to pet: ${notes}`);
};

// Static Methods
InventorySchema.statics.findLowStock = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $addFields: { isLowStock: { $lte: ["$quantity", "$minStockLevel"] } } },
    { $match: { isLowStock: true } },
    { $sort: { quantity: 1 } }
  ]);
};

InventorySchema.statics.findExpiringSoon = function(days = 30) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    isActive: true,
    isPerishable: true,
    expirationDate: { $lte: futureDate, $gte: new Date() }
  }).sort({ expirationDate: 1 });
};

InventorySchema.statics.findByCategory = function(category, subcategory = null) {
  const query = { category, isActive: true };
  if (subcategory) query.subcategory = subcategory;
  return this.find(query).sort({ name: 1 });
};

InventorySchema.statics.findForPetSpecies = function(species) {
  return this.find({
    isActive: true,
    $or: [
      { petSpecies: species },
      { petSpecies: 'all' }
    ]
  }).sort({ name: 1 });
};

InventorySchema.statics.getInventoryStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalItems: { $sum: 1 },
        totalValue: { $sum: { $multiply: ["$quantity", "$price"] } },
        lowStockItems: {
          $sum: {
            $cond: [{ $lte: ["$quantity", "$minStockLevel"] }, 1, 0]
          }
        },
        expiringSoonItems: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$expirationDate", null] },
                  { $lte: ["$expirationDate", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

// Pre-save middleware
InventorySchema.pre('save', function(next) {
  // Auto-generate SKU if not provided
  if (!this.sku) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `${categoryCode}-${randomCode}`;
  }
  
  // Calculate markup if cost and price are provided
  if (this.cost && this.price) {
    this.markup = ((this.price - this.cost) / this.cost) * 100;
  }
  
  next();
});

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);

export default Inventory;