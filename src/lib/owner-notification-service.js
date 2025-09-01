import emailService from './email-service.js';
import EmailTemplates from './email-templates.js';
import EmailSettings from '@/models/EmailSettings';
import Owner from '@/models/Owner';
import connectDB from './mongodb.js';

class OwnerNotificationService {
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
   * Check if owner wants to receive email notifications
   * @param {Object} owner - Owner object
   * @param {string} notificationType - Type of notification
   * @returns {boolean} Whether to send email
   */
  shouldSendEmail(owner, notificationType = 'general') {
    // Check if owner has email
    if (!owner.email) {
      return false;
    }

    // Check communication preferences
    if (owner.preferences) {
      // If owner prefers email or hasn't set preference (default to email)
      const prefersEmail = !owner.preferences.communicationMethod || 
                          owner.preferences.communicationMethod === 'email';
      
      // Check specific notification preferences
      switch (notificationType) {
        case 'appointment':
          return prefersEmail && (owner.preferences.appointmentReminders !== false);
        case 'profile_update':
          return prefersEmail;
        case 'welcome':
          return prefersEmail;
        case 'marketing':
          return prefersEmail && (owner.preferences.marketingCommunications === true);
        default:
          return prefersEmail;
      }
    }

    // Default to sending email if no preferences set
    return true;
  }

  /**
   * Send owner registration welcome email
   * @param {Object} ownerData - Owner information
   * @param {string} staffUserId - Staff user ID who registered the owner
   * @returns {Object} Result of email sending
   */
  async sendOwnerRegistrationWelcome(ownerData, staffUserId) {
    try {
      // Check if owner wants email notifications
      if (!this.shouldSendEmail(ownerData, 'welcome')) {
        return {
          success: true,
          message: 'Email notification skipped - owner preferences',
          skipped: true
        };
      }

      // Get staff user's email configuration
      const emailConfig = await this.getUserEmailConfig(staffUserId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      // Generate email template
      const emailTemplate = EmailTemplates.ownerRegistrationWelcome(ownerData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Owner registration welcome email sent to ${ownerData.email} for ${ownerData.fullName}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending owner registration welcome email:', error);
      return {
        success: false,
        message: `Failed to send welcome email: ${error.message}`
      };
    }
  }

  /**
   * Send owner profile update notification
   * @param {Object} ownerData - Owner information
   * @param {string} updateType - Type of update
   * @param {string} staffUserId - Staff user ID who made the update
   * @returns {Object} Result of email sending
   */
  async sendOwnerProfileUpdate(ownerData, updateType, staffUserId) {
    try {
      // Check if owner wants email notifications
      if (!this.shouldSendEmail(ownerData, 'profile_update')) {
        return {
          success: true,
          message: 'Email notification skipped - owner preferences',
          skipped: true
        };
      }

      // Get staff user's email configuration
      const emailConfig = await this.getUserEmailConfig(staffUserId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      // Generate email template
      const emailTemplate = EmailTemplates.ownerProfileUpdate(ownerData, updateType);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Owner profile update email sent to ${ownerData.email} for ${ownerData.fullName}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending owner profile update email:', error);
      return {
        success: false,
        message: `Failed to send profile update email: ${error.message}`
      };
    }
  }

  /**
   * Send appointment reminder to owner
   * @param {Object} ownerData - Owner information
   * @param {Object} appointmentData - Appointment information
   * @param {string} staffUserId - Staff user ID sending the reminder
   * @returns {Object} Result of email sending
   */
  async sendAppointmentReminder(ownerData, appointmentData, staffUserId) {
    try {
      // Check if owner wants appointment reminders
      if (!this.shouldSendEmail(ownerData, 'appointment')) {
        return {
          success: true,
          message: 'Email notification skipped - owner preferences',
          skipped: true
        };
      }

      // Get staff user's email configuration
      const emailConfig = await this.getUserEmailConfig(staffUserId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      // Generate email template
      const emailTemplate = EmailTemplates.appointmentReminder(ownerData, appointmentData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Appointment reminder email sent to ${ownerData.email} for ${ownerData.fullName}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending appointment reminder email:', error);
      return {
        success: false,
        message: `Failed to send appointment reminder email: ${error.message}`
      };
    }
  }

  /**
   * Send general notification to owner
   * @param {Object} ownerData - Owner information
   * @param {Object} notificationData - Notification content
   * @param {string} staffUserId - Staff user ID sending the notification
   * @returns {Object} Result of email sending
   */
  async sendGeneralNotification(ownerData, notificationData, staffUserId) {
    try {
      // Check if owner wants email notifications
      if (!this.shouldSendEmail(ownerData, 'general')) {
        return {
          success: true,
          message: 'Email notification skipped - owner preferences',
          skipped: true
        };
      }

      // Get staff user's email configuration
      const emailConfig = await this.getUserEmailConfig(staffUserId);
      if (!emailConfig) {
        return {
          success: false,
          message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.'
        };
      }

      // Generate email template
      const emailTemplate = EmailTemplates.ownerGeneralNotification(ownerData, notificationData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`General notification email sent to ${ownerData.email} for ${ownerData.fullName}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending general notification email:', error);
      return {
        success: false,
        message: `Failed to send general notification email: ${error.message}`
      };
    }
  }
}

const ownerNotificationService = new OwnerNotificationService();
export default ownerNotificationService;