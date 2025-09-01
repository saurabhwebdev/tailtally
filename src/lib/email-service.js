import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Create transporter with Gmail configuration
  createTransporter(emailConfig) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.email,
        pass: emailConfig.appPassword
      },
      secure: true,
      port: 465
    });
  }

  // Test email connection
  async testConnection(emailConfig) {
    try {
      const transporter = this.createTransporter(emailConfig);
      await transporter.verify();
      return { success: true, message: 'Email configuration verified successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: `Email configuration failed: ${error.message}` 
      };
    }
  }

  // Send test email
  async sendTestEmail(emailConfig, recipientEmail) {
    try {
      const transporter = this.createTransporter(emailConfig);
      
      const mailOptions = {
        from: {
          name: emailConfig.displayName || 'Pet Management System',
          address: emailConfig.email
        },
        to: recipientEmail,
        subject: 'Test Email - Pet Management System',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Email Configuration Test</h2>
            <p>Hello!</p>
            <p>This is a test email from your Pet Management System to verify that your Gmail configuration is working correctly.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #059669; margin-top: 0;">✅ Configuration Status: Success</h3>
              <p><strong>From:</strong> ${emailConfig.email}</p>
              <p><strong>Display Name:</strong> ${emailConfig.displayName || 'Pet Management System'}</p>
              <p><strong>Test Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p>If you received this email, your Gmail integration is working perfectly!</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from your Pet Management System.<br>
              If you didn't request this test, please check your email settings.
            </p>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      return { 
        success: true, 
        message: 'Test email sent successfully',
        messageId: result.messageId 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to send test email: ${error.message}` 
      };
    }
  }

  // Send general email
  async sendEmail(emailConfig, mailOptions) {
    try {
      const transporter = this.createTransporter(emailConfig);
      
      const options = {
        from: {
          name: emailConfig.displayName || 'Pet Management System',
          address: emailConfig.email
        },
        ...mailOptions
      };

      const result = await transporter.sendMail(options);
      return { 
        success: true, 
        message: 'Email sent successfully',
        messageId: result.messageId 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Failed to send email: ${error.message}` 
      };
    }
  }
}

export default new EmailService();