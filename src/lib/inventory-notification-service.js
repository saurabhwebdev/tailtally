import emailService from './email-service.js';
import EmailTemplates from './email-templates.js';
import EmailSettings from '@/models/EmailSettings';
import Inventory from '@/models/Inventory';
import connectDB from './mongodb.js';

class InventoryNotificationService {
  constructor() {
    this.emailService = emailService;
  }

  /**
   * Get user's email configuration
   * @param {string} userId - User ID
   * @returns {Object|null} Email configuration or null if not found
   */
  async getUserEmailConfig(userId) {
    try {
      await connectDB();
      const emailSettings = await EmailSettings.findByUserId(userId);
      
      if (!emailSettings || !emailSettings.settings.isEnabled) {
        console.log(`Email not configured or disabled for user: ${userId}`);
        return null;
      }

      return emailSettings.gmail;
    } catch (error) {
      console.error('Error getting user email config:', error);
      return null;
    }
  }

  /**
   * Check if inventory item notification should be sent
   * @param {Object} item - Inventory item object
   * @param {string} notificationType - Type of notification
   * @returns {boolean} Whether to send email
   */
  shouldSendEmail(item, notificationType = 'general') {
    // For inventory, we'll send emails for low stock, expiry alerts, etc.
    // This can be configured based on business rules
    return true;
  }

  /**
   * Send low stock alert email
   * @param {Object} item - Inventory item
   * @param {string} userId - User ID
   * @returns {Object} Result of email sending
   */
  async sendLowStockAlert(item, userId) {
    try {
      const emailConfig = await this.getUserEmailConfig(userId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      if (!this.shouldSendEmail(item, 'low_stock')) {
        return {
          success: true,
          message: 'Email notification skipped - notification preferences',
          skipped: true
        };
      }

      const emailContent = EmailTemplates.inventoryLowStockAlert({
        itemName: item.name,
        currentStock: item.quantity || item.currentStock,
        minimumStock: item.lowStockThreshold || item.minimumStock || 10,
        category: item.category
      });

      // Send to admin/staff email (could be configured)
      const recipientEmail = emailConfig.email || 'admin@example.com';
      
      const result = await this.emailService.sendEmail(emailConfig, {
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });

      if (result.success) {
        console.log(`Low stock alert sent for ${item.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending low stock alert:', error);
      return {
        success: false,
        message: `Failed to send low stock alert: ${error.message}`
      };
    }
  }

  /**
   * Send expiry alert email
   * @param {Object} item - Inventory item
   * @param {string} userId - User ID
   * @returns {Object} Result of email sending
   */
  async sendExpiryAlert(item, userId) {
    try {
      const emailConfig = await this.getUserEmailConfig(userId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      if (!this.shouldSendEmail(item, 'expiry_alert')) {
        return {
          success: true,
          message: 'Email notification skipped - notification preferences',
          skipped: true
        };
      }

      const emailContent = EmailTemplates.inventoryExpiryAlert({
        itemName: item.name,
        expiryDate: item.expirationDate || item.expiryDate,
        currentStock: item.quantity || item.currentStock,
        category: item.category
      });

      // Send to admin/staff email (could be configured)
      const recipientEmail = emailConfig.email || 'admin@example.com';
      
      const result = await this.emailService.sendEmail(emailConfig, {
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });

      if (result.success) {
        console.log(`Expiry alert sent for ${item.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending expiry alert:', error);
      return {
        success: false,
        message: `Failed to send expiry alert: ${error.message}`
      };
    }
  }

  /**
   * Send stock update notification
   * @param {Object} item - Inventory item
   * @param {string} userId - User ID
   * @returns {Object} Result of email sending
   */
  async sendStockUpdate(item, userId) {
    try {
      const emailConfig = await this.getUserEmailConfig(userId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      if (!this.shouldSendEmail(item, 'stock_update')) {
        return {
          success: true,
          message: 'Email notification skipped - notification preferences',
          skipped: true
        };
      }

      const emailContent = EmailTemplates.inventoryStockUpdate({
        itemName: item.name,
        previousStock: 0,
        currentStock: item.quantity || item.currentStock,
        updateType: 'manual',
        category: item.category
      });

      // Send to admin/staff email (could be configured)
      const recipientEmail = emailConfig.email || 'admin@example.com';
      
      const result = await this.emailService.sendEmail(emailConfig, {
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });

      if (result.success) {
        console.log(`Stock update notification sent for ${item.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending stock update notification:', error);
      return {
        success: false,
        message: `Failed to send stock update notification: ${error.message}`
      };
    }
  }

  /**
   * Send general inventory notification
   * @param {Object} item - Inventory item
   * @param {string} userId - User ID
   * @returns {Object} Result of email sending
   */
  async sendGeneralNotification(item, userId) {
    try {
      const emailConfig = await this.getUserEmailConfig(userId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      if (!this.shouldSendEmail(item, 'general')) {
        return {
          success: true,
          message: 'Email notification skipped - notification preferences',
          skipped: true
        };
      }

      const emailContent = EmailTemplates.inventoryGeneralNotification({
        itemName: item.name,
        message: 'Inventory item notification',
        category: item.category,
        currentStock: item.quantity || item.currentStock
      });

      // Send to admin/staff email (could be configured)
      const recipientEmail = emailConfig.email || 'admin@example.com';
      
      const result = await this.emailService.sendEmail(emailConfig, {
        to: recipientEmail,
        subject: emailContent.subject,
        html: emailContent.html
      });

      if (result.success) {
        console.log(`General notification sent for ${item.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending general inventory notification:', error);
      return {
        success: false,
        message: `Failed to send general notification: ${error.message}`
      };
    }
  }

  /**
   * Send bulk notifications for multiple inventory items
   * @param {string} userId - User ID
   * @param {Array} items - Array of inventory items
   * @param {string} notificationType - Type of notification
   * @returns {Object} Result of bulk email sending
   */
  async sendBulkNotifications(userId, items, notificationType) {
    const results = {
      sent: 0,
      skipped: 0,
      failed: 0,
      errors: []
    };

    for (const item of items) {
      try {
        let result;
        switch (notificationType) {
          case 'low_stock':
            result = await this.sendLowStockAlert(item, userId);
            break;
          case 'expiry_alert':
            result = await this.sendExpiryAlert(item, userId);
            break;
          case 'stock_update':
            result = await this.sendStockUpdate(item, userId);
            break;
          case 'general':
            result = await this.sendGeneralNotification(item, userId);
            break;
          default:
            result = { success: false, message: 'Unknown notification type' };
        }

        if (result.success) {
          if (result.skipped) {
            results.skipped++;
          } else {
            results.sent++;
          }
        } else {
          results.failed++;
          results.errors.push(`${item.name}: ${result.message}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${item.name}: ${error.message}`);
      }
    }

    return results;
  }
}

const inventoryNotificationService = new InventoryNotificationService();
export default inventoryNotificationService;