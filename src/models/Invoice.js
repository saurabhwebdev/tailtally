import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  // Invoice Identification
  invoiceNumber: {
    type: String,
    unique: true,
    required: [true, 'Invoice number is required']
  },
  
  // Reference to Sale
  sale: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale',
    required: [true, 'Sale reference is required']
  },
  
  // Customer Information (denormalized for invoice integrity)
  customer: {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: [true, 'Owner is required']
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      sparse: true
    },
    // Snapshot of customer info at time of invoice
    details: {
      name: {
        type: String,
        required: [true, 'Customer name is required']
      },
      email: {
        type: String,
        required: [true, 'Customer email is required']
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required']
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      },
      gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format']
      }
    }
  },
  
  // Business Information (for invoice header)
  business: {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      default: 'TailTally Pet Services'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    contact: {
      phone: String,
      email: String,
      website: String
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    logo: String
  },
  
  // Invoice Items (snapshot from sale)
  items: [{
    name: {
      type: String,
      required: [true, 'Item name is required']
    },
    description: String,
    sku: String,
    hsnCode: String,
    sacCode: String,
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
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      default: 'percentage'
    },
    // GST Details
    gst: {
      isApplicable: {
        type: Boolean,
        default: true
      },
      rate: {
        type: Number,
        default: 18
      },
      type: {
        type: String,
        enum: ['CGST_SGST', 'IGST', 'EXEMPT', 'NIL_RATED', 'ZERO_RATED'],
        default: 'CGST_SGST'
      },
      cgstRate: Number,
      sgstRate: Number,
      igstRate: Number,
      cessRate: {
        type: Number,
        default: 0
      }
    },
    // Calculated Amounts
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
    cgstAmount: {
      type: Number,
      default: 0
    },
    sgstAmount: {
      type: Number,
      default: 0
    },
    igstAmount: {
      type: Number,
      default: 0
    },
    cessAmount: {
      type: Number,
      default: 0
    },
    totalGstAmount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Total is required']
    }
  }],
  
  // Invoice Totals
  totals: {
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    totalDiscount: {
      type: Number,
      default: 0
    },
    totalTaxable: {
      type: Number,
      required: [true, 'Total taxable amount is required']
    },
    totalCGST: {
      type: Number,
      default: 0
    },
    totalSGST: {
      type: Number,
      default: 0
    },
    totalIGST: {
      type: Number,
      default: 0
    },
    totalCess: {
      type: Number,
      default: 0
    },
    totalGST: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: [true, 'Grand total is required']
    },
    roundOff: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: [true, 'Final amount is required']
    }
  },
  
  // Invoice Dates
  invoiceDate: {
    type: Date,
    default: Date.now,
    required: [true, 'Invoice date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  
  // Invoice Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  
  // Payment Information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque', 'credit']
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    dueAmount: {
      type: Number,
      default: 0
    },
    paymentDate: Date,
    transactionId: String
  },
  
  // Terms and Conditions
  terms: {
    paymentTerms: {
      type: String,
      default: 'Payment due within 30 days'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      branch: String
    }
  },
  
  // Digital Signature and Verification
  signature: {
    authorizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    digitalSignature: String,
    timestamp: Date
  },
  
  // Email and Communication
  communication: {
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentDate: Date,
    emailOpenedDate: Date,
    remindersSent: {
      type: Number,
      default: 0
    },
    lastReminderDate: Date
  },
  
  // File Attachments
  attachments: [{
    filename: String,
    url: String,
    type: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
// Note: invoiceNumber index is already created by 'unique: true' constraint
InvoiceSchema.index({ sale: 1 });
InvoiceSchema.index({ 'customer.owner': 1 });
InvoiceSchema.index({ invoiceDate: -1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ 'payment.status': 1 });
InvoiceSchema.index({ createdAt: -1 });

// Virtual for customer name
InvoiceSchema.virtual('customerName').get(function() {
  return this.customer.details.name;
});

// Virtual for days overdue
InvoiceSchema.virtual('daysOverdue').get(function() {
  if (this.payment.status === 'paid' || !this.dueDate) return 0;
  const today = new Date();
  const diffTime = today - this.dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for is overdue
InvoiceSchema.virtual('isOverdue').get(function() {
  return this.daysOverdue > 0 && this.payment.status !== 'paid';
});

// Pre-save middleware to generate invoice number
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last invoice number for this month
    const lastInvoice = await this.constructor.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}-`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    this.invoiceNumber = `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  
  // Set due date if not provided (30 days from invoice date)
  if (!this.dueDate) {
    this.dueDate = new Date(this.invoiceDate.getTime() + (30 * 24 * 60 * 60 * 1000));
  }
  
  // Calculate totals
  this.calculateTotals();
  
  // Update payment due amount
  this.payment.dueAmount = this.totals.finalAmount - this.payment.paidAmount;
  
  next();
});

// Instance method to calculate totals
InvoiceSchema.methods.calculateTotals = function() {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;
  let totalCess = 0;
  
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
    
    // Calculate GST components
    if (item.gst.isApplicable) {
      if (item.gst.type === 'CGST_SGST') {
        item.cgstAmount = (item.taxableAmount * item.gst.cgstRate) / 100;
        item.sgstAmount = (item.taxableAmount * item.gst.sgstRate) / 100;
        item.igstAmount = 0;
      } else if (item.gst.type === 'IGST') {
        item.cgstAmount = 0;
        item.sgstAmount = 0;
        item.igstAmount = (item.taxableAmount * item.gst.igstRate) / 100;
      } else {
        item.cgstAmount = 0;
        item.sgstAmount = 0;
        item.igstAmount = 0;
      }
      
      item.cessAmount = (item.taxableAmount * item.gst.cessRate) / 100;
      item.totalGstAmount = item.cgstAmount + item.sgstAmount + item.igstAmount + item.cessAmount;
    } else {
      item.cgstAmount = 0;
      item.sgstAmount = 0;
      item.igstAmount = 0;
      item.cessAmount = 0;
      item.totalGstAmount = 0;
    }
    
    // Calculate item total
    item.total = item.taxableAmount + item.totalGstAmount;
    
    // Add to totals
    subtotal += item.subtotal;
    totalDiscount += item.discountAmount;
    totalCGST += item.cgstAmount;
    totalSGST += item.sgstAmount;
    totalIGST += item.igstAmount;
    totalCess += item.cessAmount;
  });
  
  const totalTaxable = subtotal - totalDiscount;
  const totalGST = totalCGST + totalSGST + totalIGST + totalCess;
  const grandTotal = totalTaxable + totalGST;
  
  // Calculate round off (to nearest rupee)
  const roundOff = Math.round(grandTotal) - grandTotal;
  const finalAmount = Math.round(grandTotal);
  
  this.totals = {
    subtotal,
    totalDiscount,
    totalTaxable,
    totalCGST,
    totalSGST,
    totalIGST,
    totalCess,
    totalGST,
    grandTotal,
    roundOff,
    finalAmount
  };
};

// Instance method to mark as sent
InvoiceSchema.methods.markAsSent = function() {
  this.status = 'sent';
  this.communication.emailSent = true;
  this.communication.emailSentDate = new Date();
  return this.save();
};

// Instance method to mark as viewed
InvoiceSchema.methods.markAsViewed = function() {
  if (this.status === 'sent') {
    this.status = 'viewed';
    this.communication.emailOpenedDate = new Date();
  }
  return this.save();
};

// Instance method to add payment
InvoiceSchema.methods.addPayment = function(amount, method, transactionId) {
  this.payment.paidAmount += amount;
  this.payment.method = method;
  this.payment.transactionId = transactionId;
  this.payment.paymentDate = new Date();
  
  if (this.payment.paidAmount >= this.totals.finalAmount) {
    this.payment.status = 'paid';
    this.status = 'paid';
    this.payment.dueAmount = 0;
  } else if (this.payment.paidAmount > 0) {
    this.payment.status = 'partial';
    this.payment.dueAmount = this.totals.finalAmount - this.payment.paidAmount;
  }
  
  return this.save();
};

// Instance method to send reminder
InvoiceSchema.methods.sendReminder = function() {
  this.communication.remindersSent += 1;
  this.communication.lastReminderDate = new Date();
  
  // Update status to overdue if past due date
  if (this.isOverdue && this.payment.status !== 'paid') {
    this.status = 'overdue';
  }
  
  return this.save();
};

// Static method to get overdue invoices
InvoiceSchema.statics.getOverdueInvoices = function() {
  const today = new Date();
  return this.find({
    dueDate: { $lt: today },
    'payment.status': { $ne: 'paid' },
    status: { $ne: 'cancelled' },
    isActive: true
  }).populate('customer.owner sale');
};

// Static method to get invoices by date range
InvoiceSchema.statics.getInvoicesByDateRange = function(startDate, endDate) {
  return this.find({
    invoiceDate: { $gte: startDate, $lte: endDate },
    isActive: true
  }).populate('customer.owner customer.pet sale');
};

// Static method to get revenue statistics
InvoiceSchema.statics.getRevenueStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        invoiceDate: { $gte: startDate, $lte: endDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalRevenue: { $sum: '$totals.finalAmount' },
        totalPaid: { $sum: '$payment.paidAmount' },
        totalDue: { $sum: '$payment.dueAmount' },
        averageInvoice: { $avg: '$totals.finalAmount' }
      }
    }
  ]);
};

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);

export default Invoice;