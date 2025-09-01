// Email templates for pet-related communications

class EmailTemplates {
  // Pet registration welcome email template
  static petRegistrationWelcome(petData, ownerData) {
    const petName = petData.name || 'Your Pet';
    const ownerName = ownerData.firstName || 'Pet Owner';
    const petSpecies = petData.species || 'pet';
    const petBreed = petData.breed ? ` (${petData.breed})` : '';
    const registrationDate = new Date().toLocaleDateString();

    return {
      subject: `Welcome ${petName} to Our Pet Management System! 🐾`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🐾 Welcome to Our Pet Family!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your pet has been successfully registered</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hello ${ownerName}! 👋</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">We're excited to welcome <strong>${petName}</strong> to our pet management system! Your ${petSpecies}${petBreed} has been successfully registered and is now part of our care family.</p>

            <!-- Pet Details Card -->
            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
              <h3 style="color: #1e293b; margin-top: 0; font-size: 18px; display: flex; align-items: center;">
                🐾 Pet Registration Details
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Pet Name:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${petName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Species:</td>
                  <td style="padding: 8px 0; color: #1e293b; text-transform: capitalize;">${petSpecies}</td>
                </tr>
                ${petData.breed ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Breed:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${petData.breed}</td>
                </tr>` : ''}
                ${petData.age ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Age:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${petData.age} years old</td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Registration Date:</td>
                  <td style="padding: 8px 0; color: #1e293b;">${registrationDate}</td>
                </tr>
              </table>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">✅ What's Next?</h3>
              <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>Schedule your pet's first appointment for a health checkup</li>
                <li>Update vaccination records if you have them</li>
                <li>Add emergency contact information</li>
                <li>Upload a photo of ${petName} for easy identification</li>
                <li>Review our pet care services and recommendations</li>
              </ul>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">📞 Need Help?</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px;">Our team is here to help! Contact us anytime if you have questions about ${petName}'s care or our services.</p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Access Pet Profile</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Thank you for choosing our pet management system!</p>
            <p style="margin: 5px 0 0 0;">This email was sent regarding ${petName}'s registration on ${registrationDate}</p>
          </div>
        </div>
      `
    };
  }

  // Pet profile update notification
  static petProfileUpdate(petData, ownerData, updateType = 'general') {
    const petName = petData.name || 'Your Pet';
    const ownerName = ownerData.firstName || 'Pet Owner';
    const updateDate = new Date().toLocaleDateString();

    return {
      subject: `${petName}'s Profile Updated - ${updateType.charAt(0).toUpperCase() + updateType.slice(1)} Information`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Profile Update Notification</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${ownerName}!</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              We wanted to let you know that <strong>${petName}'s</strong> profile has been updated with new ${updateType} information.
            </p>

            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #64748b;"><strong>Update Date:</strong> ${updateDate}</p>
              <p style="margin: 10px 0 0 0; color: #64748b;"><strong>Update Type:</strong> ${updateType.charAt(0).toUpperCase() + updateType.slice(1)}</p>
            </div>

            <p style="color: #475569;">You can view the complete updated profile by logging into your account.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="#" style="background-color: #2563eb; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: 600;">View Profile</a>
            </div>
          </div>

          <div style="text-align: center; padding: 15px; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from your Pet Management System.</p>
          </div>
        </div>
      `
    };
  }

  // Medical record update notification
  static medicalRecordUpdate(petData, ownerData, medicalData) {
    const petName = petData.name || 'Your Pet';
    const ownerName = ownerData.firstName || 'Pet Owner';
    const recordDate = new Date().toLocaleDateString();
    const recordType = medicalData.type || 'Medical Record';

    return {
      subject: `${petName} - New Medical Record Added: ${recordType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #059669; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🏥 Medical Record Update</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${ownerName}!</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              A new medical record has been added to <strong>${petName}'s</strong> health profile.
            </p>

            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">Medical Record Details</h3>
              <p style="margin: 5px 0; color: #047857;"><strong>Type:</strong> ${recordType}</p>
              <p style="margin: 5px 0; color: #047857;"><strong>Date:</strong> ${recordDate}</p>
              ${medicalData.description ? `<p style="margin: 5px 0; color: #047857;"><strong>Description:</strong> ${medicalData.description}</p>` : ''}
              ${medicalData.veterinarian ? `<p style="margin: 5px 0; color: #047857;"><strong>Veterinarian:</strong> ${medicalData.veterinarian}</p>` : ''}
            </div>

            <p style="color: #475569;">You can view the complete medical history by accessing ${petName}'s profile.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="#" style="background-color: #059669; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: 600;">View Medical Records</a>
            </div>
          </div>

          <div style="text-align: center; padding: 15px; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from your Pet Management System.</p>
          </div>
        </div>
      `
    };
  }

  // Vaccination reminder
  static vaccinationReminder(petData, ownerData, vaccinationData) {
    const petName = petData.name || 'Your Pet';
    const ownerName = ownerData.firstName || 'Pet Owner';
    const dueDate = vaccinationData.nextDue ? new Date(vaccinationData.nextDue).toLocaleDateString() : 'Soon';
    const vaccineName = vaccinationData.name || 'Vaccination';

    return {
      subject: `🩺 Vaccination Reminder: ${petName} - ${vaccineName} Due ${dueDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🩺 Vaccination Reminder</h1>
          </div>

          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Hello ${ownerName}!</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              This is a friendly reminder that <strong>${petName}</strong> is due for a vaccination.
            </p>

            <div style="background-color: #fef2f2; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #991b1b; margin-top: 0;">Vaccination Details</h3>
              <p style="margin: 5px 0; color: #b91c1c;"><strong>Vaccination:</strong> ${vaccineName}</p>
              <p style="margin: 5px 0; color: #b91c1c;"><strong>Due Date:</strong> ${dueDate}</p>
              <p style="margin: 5px 0; color: #b91c1c;"><strong>Pet:</strong> ${petName}</p>
            </div>

            <p style="color: #475569;">Please schedule an appointment to keep ${petName} healthy and up-to-date with vaccinations.</p>

            <div style="text-align: center; margin: 25px 0;">
              <a href="#" style="background-color: #dc2626; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; font-weight: 600;">Schedule Appointment</a>
            </div>
          </div>

          <div style="text-align: center; padding: 15px; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">This is an automated reminder from your Pet Management System.</p>
          </div>
        </div>
      `
    };
  }

  // Owner registration welcome email template
  static ownerRegistrationWelcome(ownerData) {
    const ownerName = ownerData.firstName || 'Pet Owner';
    const registrationDate = new Date().toLocaleDateString();

    return {
      subject: `Welcome to Our Pet Management System, ${ownerName}! 🐾`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🐾 Welcome to Our Pet Family!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your account has been successfully created</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hello ${ownerName}! 👋</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Thank you for joining our pet management system! We're excited to help you provide the best care for your beloved pets.
            </p>

            <!-- Owner Information -->
            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #334155; margin-top: 0; font-size: 18px; margin-bottom: 15px;">📋 Your Account Details</h3>
              <div style="color: #64748b; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${ownerData.fullName || ownerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${ownerData.email}</p>
                ${ownerData.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${ownerData.phone}</p>` : ''}
                <p style="margin: 5px 0;"><strong>Registration Date:</strong> ${registrationDate}</p>
              </div>
            </div>

            <!-- Services Information -->
            <div style="background-color: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">🏥 Our Services</h3>
              <ul style="color: #047857; margin: 15px 0; padding-left: 20px; line-height: 1.8;">
                <li>Comprehensive pet health records</li>
                <li>Appointment scheduling and reminders</li>
                <li>Vaccination tracking</li>
                <li>Medical history management</li>
                <li>Emergency contact information</li>
              </ul>
            </div>

            <!-- Next Steps -->
            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">📞 Need Help?</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px;">Our team is here to help! Contact us anytime if you have questions about our services or need assistance with your account.</p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Access Your Account</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Thank you for choosing our pet management system!</p>
            <p style="margin: 5px 0 0 0;">This email was sent regarding your account registration on ${registrationDate}</p>
          </div>
        </div>
      `
    };
  }

  // Owner profile update notification template
  static ownerProfileUpdate(ownerData, updateType = 'general') {
    const ownerName = ownerData.firstName || 'Pet Owner';
    const updateDate = new Date().toLocaleDateString();
    
    const updateMessages = {
      general: 'Your profile information has been updated',
      contact: 'Your contact information has been updated',
      preferences: 'Your communication preferences have been updated',
      billing: 'Your billing information has been updated',
      address: 'Your address information has been updated'
    };

    const updateMessage = updateMessages[updateType] || updateMessages.general;

    return {
      subject: `Profile Updated - ${ownerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📝 Profile Updated</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Your information has been successfully updated</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hello ${ownerName}! 👋</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${updateMessage} in our system. This email confirms the changes made to your account.
            </p>

            <!-- Update Information -->
            <div style="background-color: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 18px;">✅ Update Details</h3>
              <div style="color: #047857; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Update Type:</strong> ${updateType.charAt(0).toUpperCase() + updateType.slice(1)} Information</p>
                <p style="margin: 5px 0;"><strong>Updated On:</strong> ${updateDate}</p>
                <p style="margin: 5px 0;"><strong>Account:</strong> ${ownerData.fullName || ownerName}</p>
              </div>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">🔒 Security Notice</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px;">If you did not make these changes or have any concerns, please contact us immediately.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Thank you for keeping your information up to date!</p>
            <p style="margin: 5px 0 0 0;">This email was sent regarding profile changes on ${updateDate}</p>
          </div>
        </div>
      `
    };
  }

  // Appointment reminder template
  static appointmentReminder(ownerData, appointmentData) {
    const ownerName = ownerData.firstName || 'Pet Owner';
    const appointmentDate = new Date(appointmentData.date).toLocaleDateString();
    const appointmentTime = appointmentData.time || 'TBD';

    return {
      subject: `Appointment Reminder - ${appointmentDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📅 Appointment Reminder</h1>
            <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 16px;">Don't forget your upcoming appointment</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hello ${ownerName}! 👋</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              This is a friendly reminder about your upcoming appointment with us.
            </p>

            <!-- Appointment Details -->
            <div style="background-color: #f3e8ff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7c3aed;">
              <h3 style="color: #581c87; margin-top: 0; font-size: 18px;">📋 Appointment Details</h3>
              <div style="color: #6b21a8; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentTime}</p>
                <p style="margin: 5px 0;"><strong>Owner:</strong> ${ownerData.fullName || ownerName}</p>
                ${appointmentData.petName ? `<p style="margin: 5px 0;"><strong>Pet:</strong> ${appointmentData.petName}</p>` : ''}
                ${appointmentData.service ? `<p style="margin: 5px 0;"><strong>Service:</strong> ${appointmentData.service}</p>` : ''}
              </div>
            </div>

            <!-- Preparation Instructions -->
            <div style="background-color: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">📝 Please Remember</h3>
              <ul style="color: #047857; margin: 15px 0; padding-left: 20px; line-height: 1.8;">
                <li>Arrive 10 minutes early for check-in</li>
                <li>Bring any relevant medical records</li>
                <li>Have your pet's current medications list ready</li>
                <li>Contact us if you need to reschedule</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">We look forward to seeing you and your pet!</p>
            <p style="margin: 5px 0 0 0;">Need to reschedule? Contact us as soon as possible.</p>
          </div>
        </div>
      `
    };
  }

  // General notification template
  static ownerGeneralNotification(ownerData, notificationData) {
    const ownerName = ownerData.firstName || 'Pet Owner';
    const notificationDate = new Date().toLocaleDateString();

    return {
      subject: notificationData.subject || 'Important Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📢 ${notificationData.title || 'Notification'}</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Important information for you</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hello ${ownerName}! 👋</h2>
            
            <div style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${notificationData.message || 'We have an important update for you.'}
            </div>

            ${notificationData.details ? `
            <!-- Details -->
            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #334155; margin-top: 0; font-size: 18px;">📋 Details</h3>
              <div style="color: #64748b; font-size: 14px; line-height: 1.8;">
                ${notificationData.details}
              </div>
            </div>
            ` : ''}

            ${notificationData.actionRequired ? `
            <!-- Action Required -->
            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">⚠️ Action Required</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px;">${notificationData.actionRequired}</p>
            </div>
            ` : ''}
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Thank you for your attention to this matter!</p>
            <p style="margin: 5px 0 0 0;">This notification was sent on ${notificationDate}</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Generate inventory low stock alert email template
   * @param {Object} data - Template data
   * @returns {Object} Email template with subject and html
   */
  static inventoryLowStockAlert(data) {
    const {
      itemName,
      currentStock,
      minimumStock,
      category,
      alertDate = new Date().toLocaleDateString()
    } = data;

    return {
      subject: `🚨 Low Stock Alert - ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🚨 Low Stock Alert</h1>
            <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 16px;">Immediate attention required</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Stock Level Critical ⚠️</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              The inventory item <strong>${itemName}</strong> has reached critically low stock levels and requires immediate restocking.
            </p>

            <!-- Alert Information -->
            <div style="background-color: #fef2f2; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc2626;">
              <h3 style="color: #991b1b; margin-top: 0; font-size: 18px;">📦 Stock Details</h3>
              <div style="color: #7f1d1d; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Item Name:</strong> ${itemName}</p>
                <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
                <p style="margin: 5px 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
                <p style="margin: 5px 0;"><strong>Minimum Required:</strong> ${minimumStock} units</p>
                <p style="margin: 5px 0;"><strong>Alert Date:</strong> ${alertDate}</p>
              </div>
            </div>

            <!-- Action Required -->
            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 16px;">⚡ Action Required</h3>
              <p style="color: #b45309; margin: 0; font-size: 14px;">Please restock this item immediately to avoid service disruptions.</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Automated inventory monitoring system</p>
            <p style="margin: 5px 0 0 0;">Alert generated on ${alertDate}</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Generate inventory expiry alert email template
   * @param {Object} data - Template data
   * @returns {Object} Email template with subject and html
   */
  static inventoryExpiryAlert(data) {
    const {
      itemName,
      expiryDate,
      currentStock,
      category,
      alertDate = new Date().toLocaleDateString()
    } = data;

    const formattedExpiryDate = new Date(expiryDate).toLocaleDateString();

    return {
      subject: `⏰ Expiry Alert - ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">⏰ Expiry Alert</h1>
            <p style="color: #fed7aa; margin: 10px 0 0 0; font-size: 16px;">Item approaching expiration</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Expiration Warning ⚠️</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              The inventory item <strong>${itemName}</strong> is approaching its expiration date and requires attention.
            </p>

            <!-- Expiry Information -->
            <div style="background-color: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0; font-size: 18px;">📅 Expiry Details</h3>
              <div style="color: #b45309; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Item Name:</strong> ${itemName}</p>
                <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
                <p style="margin: 5px 0;"><strong>Expiry Date:</strong> ${formattedExpiryDate}</p>
                <p style="margin: 5px 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
                <p style="margin: 5px 0;"><strong>Alert Date:</strong> ${alertDate}</p>
              </div>
            </div>

            <!-- Recommended Actions -->
            <div style="background-color: #ecfdf5; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; font-size: 16px;">💡 Recommended Actions</h3>
              <ul style="color: #047857; margin: 0; font-size: 14px; padding-left: 20px;">
                <li>Use items before expiration date</li>
                <li>Consider promotional pricing to move stock</li>
                <li>Check for alternative uses or donations</li>
                <li>Update inventory rotation practices</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Automated expiry monitoring system</p>
            <p style="margin: 5px 0 0 0;">Alert generated on ${alertDate}</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Generate inventory stock update notification email template
   * @param {Object} data - Template data
   * @returns {Object} Email template with subject and html
   */
  static inventoryStockUpdate(data) {
    const {
      itemName,
      previousStock,
      currentStock,
      updateType,
      category,
      updateDate = new Date().toLocaleDateString()
    } = data;

    const stockChange = currentStock - previousStock;
    const changeType = stockChange > 0 ? 'increased' : 'decreased';
    const changeIcon = stockChange > 0 ? '📈' : '📉';
    const changeColor = stockChange > 0 ? '#10b981' : '#f59e0b';

    return {
      subject: `📦 Stock Updated - ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📦 Stock Update</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0 0; font-size: 16px;">Inventory levels have been updated</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Stock Level Changed ${changeIcon}</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              The stock level for <strong>${itemName}</strong> has been ${changeType} in the inventory system.
            </p>

            <!-- Update Information -->
            <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">📊 Update Details</h3>
              <div style="color: #1e3a8a; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Item Name:</strong> ${itemName}</p>
                <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
                <p style="margin: 5px 0;"><strong>Previous Stock:</strong> ${previousStock} units</p>
                <p style="margin: 5px 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
                <p style="margin: 5px 0; color: ${changeColor};"><strong>Change:</strong> ${stockChange > 0 ? '+' : ''}${stockChange} units</p>
                <p style="margin: 5px 0;"><strong>Update Type:</strong> ${updateType}</p>
                <p style="margin: 5px 0;"><strong>Update Date:</strong> ${updateDate}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Automated inventory tracking system</p>
            <p style="margin: 5px 0 0 0;">Update recorded on ${updateDate}</p>
          </div>
        </div>
      `
    };
  }

  /**
   * Generate general inventory notification email template
   * @param {Object} data - Template data
   * @returns {Object} Email template with subject and html
   */
  static inventoryGeneralNotification(data) {
    const {
      itemName,
      message,
      category,
      currentStock,
      notificationDate = new Date().toLocaleDateString()
    } = data;

    return {
      subject: `📋 Inventory Notification - ${itemName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">📋 Inventory Notification</h1>
            <p style="color: #ddd6fe; margin: 10px 0 0 0; font-size: 16px;">Important inventory information</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Inventory Update 📦</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${message}
            </p>

            <!-- Item Information -->
            <div style="background-color: #faf5ff; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="color: #6b21a8; margin-top: 0; font-size: 18px;">📦 Item Details</h3>
              <div style="color: #7c2d92; font-size: 14px; line-height: 1.8;">
                <p style="margin: 5px 0;"><strong>Item Name:</strong> ${itemName}</p>
                <p style="margin: 5px 0;"><strong>Category:</strong> ${category}</p>
                <p style="margin: 5px 0;"><strong>Current Stock:</strong> ${currentStock} units</p>
                <p style="margin: 5px 0;"><strong>Notification Date:</strong> ${notificationDate}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">Inventory management system</p>
            <p style="margin: 5px 0 0 0;">Notification sent on ${notificationDate}</p>
          </div>
        </div>
      `
    };
  }
}

export default EmailTemplates;