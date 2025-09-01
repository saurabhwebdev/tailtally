import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  // Notification Identification
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Notification Type and Category
  type: {
    type: String,
    enum: [
      'appointment_reminder',
      'appointment_scheduled',
      'appointment_cancelled',
      'inventory_low_stock',
      'inventory_expired',
      'inventory_restock',
      'invoice_overdue',
      'invoice_paid',
      'payment_received',
      'payment_reminder',
      'pet_vaccination_due',
      'pet_checkup_due',
      'system_alert',
      'general'
    ],
    required: [true, 'Notification type is required']
  },
  category: {
    type: String,
    enum: ['appointment', 'inventory', 'invoice', 'payment', 'pet', 'system', 'general'],
    required: [true, 'Notification category is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Target User
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  
  // Related Data References (optional)
  relatedData: {
    entityType: {
      type: String,
      enum: ['appointment', 'inventory', 'invoice', 'sale', 'pet', 'owner'],
      sparse: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      sparse: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  
  // Notification State
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    sparse: true
  },
  
  // Action Information (optional)
  actionUrl: {
    type: String,
    trim: true
  },
  actionLabel: {
    type: String,
    trim: true,
    maxlength: [50, 'Action label cannot exceed 50 characters']
  },
  
  // Scheduling (for future notifications)
  scheduledFor: {
    type: Date,
    sparse: true
  },
  
  // Creator Information
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ category: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ scheduledFor: 1 });
NotificationSchema.index({ 'relatedData.entityType': 1, 'relatedData.entityId': 1 });

// Virtual for time ago
NotificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return this.createdAt.toLocaleDateString();
});

// Static method to get unread count for user
NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    userId,
    isRead: false,
    isActive: true,
    $or: [
      { scheduledFor: { $exists: false } },
      { scheduledFor: { $lte: new Date() } }
    ]
  });
};

// Static method to get notifications for user with pagination
NotificationSchema.statics.getForUser = function(userId, options = {}) {
  const { 
    limit = 20, 
    skip = 0, 
    includeRead = true, 
    category = null,
    priority = null 
  } = options;
  
  const query = {
    userId,
    isActive: true,
    $or: [
      { scheduledFor: { $exists: false } },
      { scheduledFor: { $lte: new Date() } }
    ]
  };
  
  if (!includeRead) {
    query.isRead = false;
  }
  
  if (category) {
    query.category = category;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  return this.find(query)
    .populate('createdBy', 'firstName lastName email')
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to mark notifications as read
NotificationSchema.statics.markAsRead = function(notificationIds, userId) {
  return this.updateMany(
    {
      _id: { $in: notificationIds },
      userId,
      isActive: true
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

// Static method to mark all as read for user
NotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    {
      userId,
      isRead: false,
      isActive: true
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

// Static method to get notification summary by category
NotificationSchema.statics.getSummaryByCategory = function(userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
        isActive: true,
        $or: [
          { scheduledFor: { $exists: false } },
          { scheduledFor: { $lte: new Date() } }
        ]
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        urgentCount: {
          $sum: {
            $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0]
          }
        },
        highCount: {
          $sum: {
            $cond: [{ $eq: ['$priority', 'high'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;
