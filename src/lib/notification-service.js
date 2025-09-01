import Notification from '@/models/Notification';
import connectDB from '@/lib/mongodb';

class NotificationService {
  /**
   * Create a new notification
   * @param {Object} notificationData - The notification data
   * @param {string} notificationData.title - Notification title
   * @param {string} notificationData.message - Notification message
   * @param {string} notificationData.type - Notification type
   * @param {string} notificationData.category - Notification category
   * @param {string} notificationData.userId - Target user ID
   * @param {string} [notificationData.priority='medium'] - Notification priority
   * @param {Object} [notificationData.relatedData] - Related entity data
   * @param {string} [notificationData.actionUrl] - Optional action URL
   * @param {string} [notificationData.actionLabel] - Optional action label
   * @param {Date} [notificationData.scheduledFor] - Optional scheduled time
   * @param {string} [notificationData.createdBy] - Creator user ID
   * @returns {Promise<Object>} Success/error response
   */
  async createNotification(notificationData) {
    try {
      await connectDB();
      
      const notification = new Notification({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        category: notificationData.category,
        userId: notificationData.userId,
        priority: notificationData.priority || 'medium',
        relatedData: notificationData.relatedData || {},
        actionUrl: notificationData.actionUrl,
        actionLabel: notificationData.actionLabel,
        scheduledFor: notificationData.scheduledFor,
        createdBy: notificationData.createdBy
      });
      
      const savedNotification = await notification.save();
      
      return {
        success: true,
        notification: savedNotification,
        message: 'Notification created successfully'
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create multiple notifications
   * @param {Array} notificationsData - Array of notification data objects
   * @returns {Promise<Object>} Success/error response
   */
  async createBulkNotifications(notificationsData) {
    try {
      await connectDB();
      
      const notifications = notificationsData.map(data => new Notification({
        title: data.title,
        message: data.message,
        type: data.type,
        category: data.category,
        userId: data.userId,
        priority: data.priority || 'medium',
        relatedData: data.relatedData || {},
        actionUrl: data.actionUrl,
        actionLabel: data.actionLabel,
        scheduledFor: data.scheduledFor,
        createdBy: data.createdBy
      }));
      
      const savedNotifications = await Notification.insertMany(notifications);
      
      return {
        success: true,
        notifications: savedNotifications,
        count: savedNotifications.length,
        message: `${savedNotifications.length} notifications created successfully`
      };
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get notifications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications and metadata
   */
  async getNotificationsForUser(userId, options = {}) {
    try {
      await connectDB();
      
      const notifications = await Notification.getForUser(userId, options);
      const unreadCount = await Notification.getUnreadCount(userId);
      const summary = await Notification.getSummaryByCategory(userId);
      
      return {
        success: true,
        notifications,
        unreadCount,
        summary,
        total: notifications.length
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark notifications as read
   * @param {Array|string} notificationIds - Notification ID(s)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success/error response
   */
  async markAsRead(notificationIds, userId) {
    try {
      await connectDB();
      
      const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
      
      const result = await Notification.markAsRead(ids, userId);
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} notifications marked as read`
      };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success/error response
   */
  async markAllAsRead(userId) {
    try {
      await connectDB();
      
      const result = await Notification.markAllAsRead(userId);
      
      return {
        success: true,
        modifiedCount: result.modifiedCount,
        message: `${result.modifiedCount} notifications marked as read`
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success/error response
   */
  async deleteNotification(notificationId, userId) {
    try {
      await connectDB();
      
      const result = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isActive: false },
        { new: true }
      );
      
      if (!result) {
        return {
          success: false,
          error: 'Notification not found'
        };
      }
      
      return {
        success: true,
        message: 'Notification deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Specific notification creators for different modules

  /**
   * Create appointment-related notifications
   */
  async createAppointmentNotification(type, userId, appointmentData, additionalData = {}) {
    const notificationTypes = {
      reminder: {
        title: `Appointment Reminder: ${appointmentData.pet?.name || 'Pet'}`,
        message: `Appointment scheduled for ${new Date(appointmentData.date).toLocaleDateString()} at ${appointmentData.time}`,
        priority: 'high'
      },
      scheduled: {
        title: 'New Appointment Scheduled',
        message: `Appointment for ${appointmentData.pet?.name || 'Pet'} scheduled for ${new Date(appointmentData.date).toLocaleDateString()}`,
        priority: 'medium'
      },
      cancelled: {
        title: 'Appointment Cancelled',
        message: `Appointment for ${appointmentData.pet?.name || 'Pet'} has been cancelled`,
        priority: 'medium'
      }
    };

    const template = notificationTypes[type];
    if (!template) return { success: false, error: 'Invalid appointment notification type' };

    return this.createNotification({
      ...template,
      type: `appointment_${type}`,
      category: 'appointment',
      userId,
      relatedData: {
        entityType: 'appointment',
        entityId: appointmentData._id,
        metadata: { 
          petName: appointmentData.pet?.name,
          ownerName: appointmentData.owner?.fullName,
          date: appointmentData.date,
          time: appointmentData.time
        }
      },
      actionUrl: `/appointments/${appointmentData._id}`,
      actionLabel: 'View Appointment',
      ...additionalData
    });
  }

  /**
   * Create inventory-related notifications
   */
  async createInventoryNotification(type, userId, inventoryData, additionalData = {}) {
    const notificationTypes = {
      low_stock: {
        title: `Low Stock Alert: ${inventoryData.name}`,
        message: `Only ${inventoryData.quantity} units left in stock`,
        priority: 'high'
      },
      expired: {
        title: `Expired Item: ${inventoryData.name}`,
        message: `Item has expired on ${new Date(inventoryData.expiryDate).toLocaleDateString()}`,
        priority: 'urgent'
      },
      restock: {
        title: `Item Restocked: ${inventoryData.name}`,
        message: `${inventoryData.quantity} units added to inventory`,
        priority: 'low'
      }
    };

    const template = notificationTypes[type];
    if (!template) return { success: false, error: 'Invalid inventory notification type' };

    return this.createNotification({
      ...template,
      type: `inventory_${type}`,
      category: 'inventory',
      userId,
      relatedData: {
        entityType: 'inventory',
        entityId: inventoryData._id,
        metadata: { 
          name: inventoryData.name,
          sku: inventoryData.sku,
          quantity: inventoryData.quantity,
          minStock: inventoryData.minStock
        }
      },
      actionUrl: `/inventory/${inventoryData._id}`,
      actionLabel: 'View Item',
      ...additionalData
    });
  }

  /**
   * Create invoice-related notifications
   */
  async createInvoiceNotification(type, userId, invoiceData, additionalData = {}) {
    const notificationTypes = {
      overdue: {
        title: `Overdue Invoice: ${invoiceData.invoiceNumber}`,
        message: `Invoice for ${invoiceData.customer?.details?.name || 'Customer'} is overdue`,
        priority: 'high'
      },
      paid: {
        title: `Payment Received: ${invoiceData.invoiceNumber}`,
        message: `Invoice payment of ₹${invoiceData.totals?.finalAmount || 0} received`,
        priority: 'medium'
      }
    };

    const template = notificationTypes[type];
    if (!template) return { success: false, error: 'Invalid invoice notification type' };

    return this.createNotification({
      ...template,
      type: `invoice_${type}`,
      category: 'invoice',
      userId,
      relatedData: {
        entityType: 'invoice',
        entityId: invoiceData._id,
        metadata: { 
          invoiceNumber: invoiceData.invoiceNumber,
          customerName: invoiceData.customer?.details?.name,
          amount: invoiceData.totals?.finalAmount
        }
      },
      actionUrl: `/invoices/${invoiceData._id}`,
      actionLabel: 'View Invoice',
      ...additionalData
    });
  }

  /**
   * Create payment-related notifications
   */
  async createPaymentNotification(type, userId, paymentData, additionalData = {}) {
    const notificationTypes = {
      received: {
        title: 'Payment Received',
        message: `Payment of ₹${paymentData.amount} received via ${paymentData.method}`,
        priority: 'medium'
      },
      reminder: {
        title: 'Payment Reminder',
        message: `Payment due: ₹${paymentData.dueAmount} for ${paymentData.reference}`,
        priority: 'high'
      }
    };

    const template = notificationTypes[type];
    if (!template) return { success: false, error: 'Invalid payment notification type' };

    return this.createNotification({
      ...template,
      type: `payment_${type}`,
      category: 'payment',
      userId,
      relatedData: {
        entityType: paymentData.entityType || 'sale',
        entityId: paymentData.entityId,
        metadata: paymentData
      },
      actionUrl: paymentData.actionUrl,
      actionLabel: 'View Details',
      ...additionalData
    });
  }

  /**
   * Create pet-related notifications
   */
  async createPetNotification(type, userId, petData, additionalData = {}) {
    const notificationTypes = {
      vaccination_due: {
        title: `Vaccination Due: ${petData.name}`,
        message: `${petData.name}'s vaccination is due soon`,
        priority: 'high'
      },
      checkup_due: {
        title: `Checkup Due: ${petData.name}`,
        message: `${petData.name} is due for a routine checkup`,
        priority: 'medium'
      }
    };

    const template = notificationTypes[type];
    if (!template) return { success: false, error: 'Invalid pet notification type' };

    return this.createNotification({
      ...template,
      type: `pet_${type}`,
      category: 'pet',
      userId,
      relatedData: {
        entityType: 'pet',
        entityId: petData._id,
        metadata: { 
          name: petData.name,
          species: petData.species,
          ownerName: petData.owner?.fullName
        }
      },
      actionUrl: `/pets/${petData._id}`,
      actionLabel: 'View Pet',
      ...additionalData
    });
  }

  /**
   * Create system notifications
   */
  async createSystemNotification(userId, title, message, priority = 'medium', additionalData = {}) {
    return this.createNotification({
      title,
      message,
      type: 'system_alert',
      category: 'system',
      userId,
      priority,
      ...additionalData
    });
  }

  /**
   * Create notifications for all staff users
   * @param {Object} notificationData - Notification data (without userId)
   * @param {Array} [roleFilter] - Optional role filter ['staff', 'admin', 'veterinarian']
   * @returns {Promise<Object>} Success/error response
   */
  async createStaffNotification(notificationData, roleFilter = ['staff', 'admin', 'veterinarian']) {
    try {
      await connectDB();
      const User = require('@/models/User').default;
      
      // Get all staff users
      const staffUsers = await User.find({ 
        role: { $in: roleFilter },
        isActive: true 
      }).select('_id');
      
      if (staffUsers.length === 0) {
        return {
          success: false,
          error: 'No staff users found'
        };
      }
      
      // Create notifications for all staff
      const notifications = staffUsers.map(user => ({
        ...notificationData,
        userId: user._id
      }));
      
      return this.createBulkNotifications(notifications);
    } catch (error) {
      console.error('Error creating staff notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get notification template by type and data
   * @param {string} type - Notification type
   * @param {Object} data - Related data
   * @returns {Object} Notification template
   */
  getNotificationTemplate(type, data) {
    const templates = {
      // Appointment templates
      appointment_reminder: {
        title: `Appointment Reminder: ${data.petName || 'Pet'}`,
        message: `Appointment scheduled for ${new Date(data.date).toLocaleDateString()} at ${data.time}`,
        category: 'appointment',
        priority: 'high'
      },
      appointment_scheduled: {
        title: 'New Appointment Scheduled',
        message: `Appointment for ${data.petName || 'Pet'} scheduled`,
        category: 'appointment',
        priority: 'medium'
      },
      appointment_cancelled: {
        title: 'Appointment Cancelled',
        message: `Appointment for ${data.petName || 'Pet'} has been cancelled`,
        category: 'appointment',
        priority: 'medium'
      },
      
      // Inventory templates
      inventory_low_stock: {
        title: `Low Stock Alert: ${data.name}`,
        message: `Only ${data.quantity} units left in stock`,
        category: 'inventory',
        priority: 'high'
      },
      inventory_expired: {
        title: `Expired Item: ${data.name}`,
        message: `Item has expired`,
        category: 'inventory',
        priority: 'urgent'
      },
      inventory_restock: {
        title: `Item Restocked: ${data.name}`,
        message: `${data.quantity} units added to inventory`,
        category: 'inventory',
        priority: 'low'
      },
      
      // Invoice templates
      invoice_overdue: {
        title: `Overdue Invoice: ${data.invoiceNumber}`,
        message: `Invoice for ${data.customerName || 'Customer'} is overdue`,
        category: 'invoice',
        priority: 'high'
      },
      invoice_paid: {
        title: `Payment Received: ${data.invoiceNumber}`,
        message: `Invoice payment of ₹${data.amount || 0} received`,
        category: 'invoice',
        priority: 'medium'
      },
      
      // Payment templates
      payment_received: {
        title: 'Payment Received',
        message: `Payment of ₹${data.amount} received via ${data.method}`,
        category: 'payment',
        priority: 'medium'
      },
      payment_reminder: {
        title: 'Payment Reminder',
        message: `Payment due: ₹${data.dueAmount} for ${data.reference}`,
        category: 'payment',
        priority: 'high'
      },
      
      // Pet templates
      pet_vaccination_due: {
        title: `Vaccination Due: ${data.name}`,
        message: `${data.name}'s vaccination is due soon`,
        category: 'pet',
        priority: 'high'
      },
      pet_checkup_due: {
        title: `Checkup Due: ${data.name}`,
        message: `${data.name} is due for a routine checkup`,
        category: 'pet',
        priority: 'medium'
      }
    };

    return templates[type] || {
      title: 'Notification',
      message: 'You have a new notification',
      category: 'general',
      priority: 'medium'
    };
  }

  /**
   * Clean up old notifications (older than 30 days)
   * @returns {Promise<Object>} Success/error response
   */
  async cleanupOldNotifications() {
    try {
      await connectDB();
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await Notification.updateMany(
        {
          createdAt: { $lt: thirtyDaysAgo },
          isActive: true
        },
        {
          $set: { isActive: false }
        }
      );
      
      return {
        success: true,
        deletedCount: result.modifiedCount,
        message: `${result.modifiedCount} old notifications cleaned up`
      };
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
