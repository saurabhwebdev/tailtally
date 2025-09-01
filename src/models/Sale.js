import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  // Sale Identification
  saleNumber: {
    type: String,
    unique: true,
    required: [true, 'Sale number is required']
  },
  
  // Customer Information
  customer: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: [true, 'Owner is required']
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      sparse: true // Optional - for pet-specific sales
    }
  },
  
  // Sale Items
  items: {
    type: [{
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Inventory item is required']
    },
    name: {
      type: String,
      required: [true, 'Item name is required']
    },
    sku: {
      type: String,
      required: [true, 'SKU is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    // GST Information
    gst: {
      isApplicable: {
        type: Boolean,
        default: true
      },
      rate: {
        type: Number,
        default: 18,
        min: [0, 'GST rate cannot be negative'],
        max: [100, 'GST rate cannot exceed 100%']
      },
      type: {
        type: String,
        enum: ['CGST_SGST', 'IGST', 'EXEMPT', 'NIL_RATED', 'ZERO_RATED'],
        default: 'CGST_SGST'
      },
      hsnCode: String,
      sacCode: String
    },
    // Calculated amounts
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    taxableAmount: {
      type: Number,
      required: [true, 'Taxable amount is required']
    },
    gstAmount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total is required']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    }
  }],
    default: []
  },
  
  // Sale Totals
  totals: {
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative']
    },
    totalDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Total discount cannot be negative']
    },
    totalTaxable: {
      type: Number,
      required: [true, 'Total taxable amount is required']
    },
    totalGST: {
      type: Number,
      default: 0,
      min: [0, 'Total GST cannot be negative']
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required'],
      min: [0, 'Grand total cannot be negative']
    }
  },
  
  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'credit'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded', 'cancelled'],
      default: 'pending'
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative']
    },
    dueAmount: {
      type: Number,
      default: 0,
      min: [0, 'Due amount cannot be negative']
    },
    transactionId: {
      type: String,
      trim: true
    },
    paymentDate: {
      type: Date
    },
    dueDate: {
      type: Date
    }
  },
  
  // Sale Status
  status: {
    type: String,
    enum: ['draft', 'confirmed', 'delivered', 'cancelled', 'returned'],
    default: 'draft'
  },
  
  // Dates
  saleDate: {
    type: Date,
    default: Date.now,
    required: [true, 'Sale date is required']
  },
  deliveryDate: {
    type: Date
  },
  
  // Staff Information
  salesPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sales person is required']
  },
  
  // Additional Information
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Invoice Reference
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    sparse: true
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
// Note: saleNumber already has unique: true which creates an index
SaleSchema.index({ 'customer.owner': 1 });
SaleSchema.index({ salesPerson: 1 });
SaleSchema.index({ saleDate: -1 });
SaleSchema.index({ status: 1 });
SaleSchema.index({ 'payment.status': 1 });
SaleSchema.index({ createdAt: -1 });

// Virtual for customer name
SaleSchema.virtual('customerName').get(function() {
  if (this.populated('customer.owner') && this.customer && this.customer.owner) {
    return this.customer.owner.fullName || 'Unknown Customer';
  }
  return 'Unknown Customer';
});

// Virtual for total items count
SaleSchema.virtual('totalItems').get(function() {
  if (!this.items || !Array.isArray(this.items)) {
    return 0;
  }
  return this.items.reduce((total, item) => total + (item.quantity || 0), 0);
});

// Virtual for profit calculation
SaleSchema.virtual('profit').get(function() {
  // This would need cost information from inventory
  return 0; // Placeholder
});

// Pre-save middleware to generate sale number
SaleSchema.pre('save', async function(next) {
  // Ensure items is always an array
  if (!this.items) {
    this.items = [];
  }
  
  if (!this.saleNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last sale number for this month
    const lastSale = await this.constructor.findOne({
      saleNumber: new RegExp(`^SAL-${year}${month}-`)
    }).sort({ saleNumber: -1 });
    
    let sequence = 1;
    if (lastSale) {
      const lastSequence = parseInt(lastSale.saleNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.saleNumber = `SAL-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  
  // Calculate totals
  this.calculateTotals();
  
  next();
});

// Instance method to calculate totals
SaleSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalGST = 0;
  
  // Check if items exist and is an array
  if (!this.items || !Array.isArray(this.items)) {
    this.totals = {
      subtotal: 0,
      totalDiscount: 0,
      totalTaxable: 0,
      totalGST: 0,
      grandTotal: 0
    };
    return;
  }
  
  this.items.forEach(item => {
    // Calculate item subtotal
    item.subtotal = item.quantity * item.unitPrice;
    
    // Calculate discount
    if (item.discountType === 'percentage') {
      item.discountAmount = (item.subtotal * item.discount) / 100;
    } else {
      item.discountAmount = item.discount;
    }
    
    // Calculate taxable amount
    item.taxableAmount = item.subtotal - item.discountAmount;
    
    // Calculate GST
    if (item.gst.isApplicable) {
      item.gstAmount = (item.taxableAmount * item.gst.rate) / 100;
    } else {
      item.gstAmount = 0;
    }
    
    // Calculate item total
    item.total = item.taxableAmount + item.gstAmount;
    
    // Add to totals
    subtotal += item.subtotal;
    totalDiscount += item.discountAmount;
    totalGST += item.gstAmount;
  });
  
  this.totals = {
    subtotal,
    totalDiscount,
    totalTaxable: subtotal - totalDiscount,
    totalGST,
    grandTotal: subtotal - totalDiscount + totalGST
  };
  
  // Update payment due amount
  if (this.totals && this.payment) {
    this.payment.dueAmount = this.totals.grandTotal - (this.payment.paidAmount || 0);
  }
};

// Instance method to add payment
SaleSchema.methods.addPayment = function(amount, method, transactionId) {
  // Ensure payment object exists
  if (!this.payment) {
    this.payment = {};
  }
  
  // Ensure paidAmount exists
  if (!this.payment.paidAmount) {
    this.payment.paidAmount = 0;
  }
  
  this.payment.paidAmount += amount;
  this.payment.method = method;
  this.payment.transactionId = transactionId;
  this.payment.paymentDate = new Date();
  
  // Ensure totals exist
  if (this.totals && this.totals.grandTotal) {
    if (this.payment.paidAmount >= this.totals.grandTotal) {
      this.payment.status = 'paid';
      this.payment.dueAmount = 0;
    } else if (this.payment.paidAmount > 0) {
      this.payment.status = 'partial';
      this.payment.dueAmount = this.totals.grandTotal - this.payment.paidAmount;
    }
  }
  
  return this.save();
};

// Instance method to update inventory
SaleSchema.methods.updateInventory = async function() {
  const Inventory = this.model('Inventory');
  
  // Check if items exist and is an array
  if (!this.items || !Array.isArray(this.items)) {
    return;
  }
  
  for (const item of this.items) {
    if (!item.inventory || !item.quantity) {
      continue; // Skip invalid items
    }
    
    await Inventory.findByIdAndUpdate(
      item.inventory,
      {
        $inc: { quantity: -item.quantity, totalSold: item.quantity },
        $set: { lastSaleDate: new Date() },
        $push: {
          stockMovements: {
            type: 'sale',
            quantity: -item.quantity,
            date: new Date(),
            reference: this.saleNumber || 'Unknown',
            notes: `Sale to ${this.customerName || 'Unknown Customer'}`
          }
        }
      }
    );
  }
};

// Static method to get sales by date range
SaleSchema.statics.getSalesByDateRange = function(startDate, endDate) {
  return this.find({
    saleDate: { $gte: startDate, $lte: endDate },
    isActive: true
  }).populate('customer.owner customer.pet salesPerson');
};

// Static method to get sales by customer
SaleSchema.statics.getSalesByCustomer = function(ownerId) {
  return this.find({
    'customer.owner': ownerId,
    isActive: true
  }).populate('customer.owner customer.pet salesPerson');
};

// Static method to get pending payments
SaleSchema.statics.getPendingPayments = function() {
  return this.find({
    'payment.status': { $in: ['pending', 'partial'] },
    isActive: true
  }).populate('customer.owner salesPerson');
};

// Static method to get sales statistics
SaleSchema.statics.getSalesStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        saleDate: { $gte: startDate, $lte: endDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: { $ifNull: ['$totals.grandTotal', 0] } },
        totalItems: { $sum: { $ifNull: [{ $sum: '$items.quantity' }, 0] } },
        averageSale: { $avg: { $ifNull: ['$totals.grandTotal', 0] } }
      }
    }
  ]);
};

const Sale = mongoose.models.Sale || mongoose.model('Sale', SaleSchema);

export default Sale;