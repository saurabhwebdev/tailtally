import emailService from './email-service.js';
import EmailTemplates from './email-templates.js';
import EmailSettings from '@/models/EmailSettings';
import Owner from '@/models/Owner';
import connectDB from './mongodb.js';

class PetNotificationService {
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
        case 'vaccination':
          return prefersEmail && (owner.preferences.vaccinationReminders !== false);
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
   * Send pet registration welcome email
   * @param {Object} petData - Pet information
   * @param {Object} ownerData - Owner information
   * @param {string} staffUserId - Staff user ID who registered the pet
   * @returns {Object} Result of email sending
   */
  async sendPetRegistrationWelcome(petData, ownerData, staffUserId) {
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
      const emailTemplate = EmailTemplates.petRegistrationWelcome(petData, ownerData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Pet registration welcome email sent to ${ownerData.email} for pet ${petData.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending pet registration welcome email:', error);
      return {
        success: false,
        message: `Failed to send welcome email: ${error.message}`
      };
    }
  }

  /**
   * Send pet profile update notification
   * @param {Object} petData - Pet information
   * @param {Object} ownerData - Owner information
   * @param {string} updateType - Type of update
   * @param {string} staffUserId - Staff user ID who made the update
   * @returns {Object} Result of email sending
   */
  async sendPetProfileUpdate(petData, ownerData, updateType, staffUserId) {
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
      const emailTemplate = EmailTemplates.petProfileUpdate(petData, ownerData, updateType);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Pet profile update email sent to ${ownerData.email} for pet ${petData.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending pet profile update email:', error);
      return {
        success: false,
        message: `Failed to send profile update email: ${error.message}`
      };
    }
  }

  /**
   * Send medical record update notification
   * @param {Object} petData - Pet information
   * @param {Object} ownerData - Owner information
   * @param {Object} medicalData - Medical record information
   * @param {string} staffUserId - Staff user ID who added the record
   * @returns {Object} Result of email sending
   */
  async sendMedicalRecordUpdate(petData, ownerData, medicalData, staffUserId) {
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
      const emailTemplate = EmailTemplates.medicalRecordUpdate(petData, ownerData, medicalData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Medical record update email sent to ${ownerData.email} for pet ${petData.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending medical record update email:', error);
      return {
        success: false,
        message: `Failed to send medical record update email: ${error.message}`
      };
    }
  }

  /**
   * Send vaccination reminder
   * @param {Object} petData - Pet information
   * @param {Object} ownerData - Owner information
   * @param {Object} vaccinationData - Vaccination information
   * @param {string} staffUserId - Staff user ID sending the reminder
   * @returns {Object} Result of email sending
   */
  async sendVaccinationReminder(petData, ownerData, vaccinationData, staffUserId) {
    try {
      // Check if owner wants vaccination reminders
      if (!this.shouldSendEmail(ownerData, 'vaccination')) {
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
      const emailTemplate = EmailTemplates.vaccinationReminder(petData, ownerData, vaccinationData);
      
      // Send email
      const result = await this.emailService.sendEmail(emailConfig, {
        to: ownerData.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });

      if (result.success) {
        console.log(`Vaccination reminder email sent to ${ownerData.email} for pet ${petData.name}`);
      }

      return result;
    } catch (error) {
      console.error('Error sending vaccination reminder email:', error);
      return {
        success: false,
        message: `Failed to send vaccination reminder email: ${error.message}`
      };
    }
  }

  /**
   * Send bulk notifications to multiple owners
   * @param {Array} notifications - Array of notification objects
   * @param {string} staffUserId - Staff user ID sending the notifications
   * @returns {Object} Results of bulk email sending
   */
  async sendBulkNotifications(notifications, staffUserId) {
    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    // Get staff user's email configuration once
    const emailConfig = await this.getUserEmailConfig(staffUserId);
    if (!emailConfig) {
      return {
        success: false,
        message: 'Email not configured. Please set up your Gmail integration in Settings before sending emails.',
        results
      };
    }

    // Process each notification
    for (const notification of notifications) {
      try {
        const { type, petData, ownerData, additionalData } = notification;
        
        let result;
        switch (type) {
          case 'welcome':
            result = await this.sendPetRegistrationWelcome(petData, ownerData, staffUserId);
            break;
          case 'profile_update':
            result = await this.sendPetProfileUpdate(petData, ownerData, additionalData.updateType, staffUserId);
            break;
          case 'medical_record':
            result = await this.sendMedicalRecordUpdate(petData, ownerData, additionalData.medicalData, staffUserId);
            break;
          case 'vaccination_reminder':
            result = await this.sendVaccinationReminder(petData, ownerData, additionalData.vaccinationData, staffUserId);
            break;
          default:
            results.failed++;
            results.errors.push(`Unknown notification type: ${type}`);
            continue;
        }

        if (result.success) {
          if (result.skipped) {
            results.skipped++;
          } else {
            results.success++;
          }
        } else {
          results.failed++;
          results.errors.push(result.message);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error processing notification: ${error.message}`);
      }
    }

    return {
      success: true,
      message: `Bulk notifications processed: ${results.success} sent, ${results.failed} failed, ${results.skipped} skipped`,
      results
    };
  }
}

export default new PetNotificationService();