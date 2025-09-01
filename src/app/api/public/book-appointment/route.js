import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import PublicBookingSettings from '@/models/PublicBookingSettings';
import { sendEmail } from '@/lib/email';

// POST /api/public/book-appointment - Create public appointment booking
export async function POST(request) {
  try {
    await connectDB();
    
    // Get public booking settings
    const settings = await PublicBookingSettings.getSettings();
    
    // Check if public booking is enabled
    if (!settings.enabled) {
      return NextResponse.json(
        { success: false, message: 'Public booking is currently disabled' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      petName,
      petSpecies,
      petBreed,
      petAge,
      serviceType,
      appointmentDate,
      appointmentTime,
      reason,
      additionalNotes
    } = body;
    
    // Validate required fields based on settings
    const requiredFields = settings.requiredFields;
    const errors = [];
    
    if (requiredFields.ownerName && !ownerName) errors.push('Owner name is required');
    if (requiredFields.ownerEmail && !ownerEmail) errors.push('Owner email is required');
    if (requiredFields.ownerPhone && !ownerPhone) errors.push('Owner phone is required');
    if (requiredFields.petName && !petName) errors.push('Pet name is required');
    if (requiredFields.petSpecies && !petSpecies) errors.push('Pet species is required');
    if (requiredFields.petBreed && !petBreed) errors.push('Pet breed is required');
    if (requiredFields.petAge && !petAge) errors.push('Pet age is required');
    if (requiredFields.reason && !reason) errors.push('Reason for visit is required');
    
    if (!serviceType || !appointmentDate || !appointmentTime) {
      errors.push('Service type, date, and time are required');
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Validation errors', errors },
        { status: 400 }
      );
    }
    
    // Validate service type
    const selectedService = settings.availableServices.find(
      s => s.type === serviceType && s.enabled
    );
    
    if (!selectedService) {
      return NextResponse.json(
        { success: false, message: 'Invalid or unavailable service type' },
        { status: 400 }
      );
    }
    
    // Validate booking date constraints
    const bookingDate = new Date(appointmentDate);
    const now = new Date();
    const minBookingDate = new Date(now.getTime() + settings.minAdvanceBookingHours * 60 * 60 * 1000);
    const maxBookingDate = new Date(now.getTime() + settings.maxAdvanceBookingDays * 24 * 60 * 60 * 1000);
    
    if (bookingDate < minBookingDate) {
      return NextResponse.json(
        { success: false, message: `Appointments must be booked at least ${settings.minAdvanceBookingHours} hours in advance` },
        { status: 400 }
      );
    }
    
    if (bookingDate > maxBookingDate) {
      return NextResponse.json(
        { success: false, message: `Appointments cannot be booked more than ${settings.maxAdvanceBookingDays} days in advance` },
        { status: 400 }
      );
    }
    
    // Check if date is blocked
    const isBlocked = settings.blockedDates.some(blocked => {
      const blockedDate = new Date(blocked.date);
      return blockedDate.toDateString() === bookingDate.toDateString();
    });
    
    if (isBlocked) {
      return NextResponse.json(
        { success: false, message: 'Selected date is not available for booking' },
        { status: 400 }
      );
    }
    
    // Check working day and time slot
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
    const workingDay = settings.workingDays.find(d => d.day === dayName);
    
    if (!workingDay || !workingDay.enabled) {
      return NextResponse.json(
        { success: false, message: 'Selected day is not available for booking' },
        { status: 400 }
      );
    }
    
    const timeSlot = workingDay.timeSlots.find(t => t.time === appointmentTime && t.available);
    if (!timeSlot) {
      return NextResponse.json(
        { success: false, message: 'Selected time slot is not available' },
        { status: 400 }
      );
    }
    
    // Check daily booking limit
    const startOfDay = new Date(bookingDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(bookingDate.setHours(23, 59, 59, 999));
    
    const dailyBookingCount = await Appointment.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'no-show'] },
      isActive: true
    });
    
    if (dailyBookingCount >= settings.maxBookingsPerDay) {
      return NextResponse.json(
        { success: false, message: 'Maximum bookings for this day has been reached' },
        { status: 400 }
      );
    }
    
    // Check for time slot conflicts
    const conflictingAppointment = await Appointment.findOne({
      date: bookingDate,
      time: appointmentTime,
      status: { $nin: ['cancelled', 'no-show'] },
      isActive: true
    });
    
    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, message: 'This time slot is already booked' },
        { status: 400 }
      );
    }
    
    // Find or create owner
    let owner = await Owner.findOne({ email: ownerEmail });
    
    if (!owner) {
      // Create new owner
      const [firstName, ...lastNameParts] = ownerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      owner = new Owner({
        firstName,
        lastName,
        email: ownerEmail,
        phone: ownerPhone,
        registrationSource: 'public_booking',
        isActive: true
      });
      
      await owner.save();
    } else {
      // Update owner phone if provided
      if (ownerPhone && !owner.phone) {
        owner.phone = ownerPhone;
        await owner.save();
      }
    }
    
    // Find or create pet
    let pet = await Pet.findOne({
      name: petName,
      owner: owner._id,
      species: petSpecies
    });
    
    if (!pet) {
      pet = new Pet({
        name: petName,
        species: petSpecies,
        breed: petBreed || 'Unknown',
        age: petAge || null,
        owner: owner._id,
        registrationSource: 'public_booking',
        isActive: true
      });
      
      await pet.save();
    }
    
    // Generate appointment number
    const year = bookingDate.getFullYear();
    const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
    
    const lastAppointment = await Appointment.findOne({
      appointmentNumber: new RegExp(`^APT-${year}${month}-`)
    }).sort({ appointmentNumber: -1 });
    
    let sequence = 1;
    if (lastAppointment) {
      const lastSequence = parseInt(lastAppointment.appointmentNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }
    
    const appointmentNumber = `APT-${year}${month}-${String(sequence).padStart(4, '0')}`;
    
    // Create appointment
    const appointment = new Appointment({
      appointmentNumber,
      pet: pet._id,
      owner: owner._id,
      type: serviceType,
      date: bookingDate,
      time: appointmentTime,
      duration: selectedService.duration || 30,
      notes: `${reason}${additionalNotes ? `\n\nAdditional Notes: ${additionalNotes}` : ''}`,
      status: settings.autoConfirm ? 'confirmed' : 'scheduled',
      priority: 'normal',
      isActive: true
    });
    
    await appointment.save();
    
    // Send confirmation email if enabled
    if (settings.notifications.sendConfirmationEmail && ownerEmail) {
      try {
        const emailContent = `
          <h2>Appointment Booking Confirmation</h2>
          <p>Dear ${ownerName},</p>
          <p>Your appointment has been ${settings.autoConfirm ? 'confirmed' : 'received and is pending confirmation'}.</p>
          <br>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Appointment Number:</strong> ${appointmentNumber}</li>
            <li><strong>Pet Name:</strong> ${petName}</li>
            <li><strong>Service:</strong> ${selectedService.name}</li>
            <li><strong>Date:</strong> ${bookingDate.toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${appointmentTime}</li>
            <li><strong>Duration:</strong> ${selectedService.duration} minutes</li>
          </ul>
          <br>
          <p>${settings.confirmationMessage}</p>
          <br>
          <p>Best regards,<br>The Clinic Team</p>
        `;
        
        await sendEmail({
          to: ownerEmail,
          subject: `Appointment ${settings.autoConfirm ? 'Confirmation' : 'Request Received'} - ${appointmentNumber}`,
          html: emailContent
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the booking if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: settings.autoConfirm 
        ? 'Appointment confirmed successfully' 
        : 'Appointment request submitted successfully',
      data: {
        appointmentNumber,
        status: appointment.status,
        confirmationMessage: settings.confirmationMessage
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Public booking error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment booking', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/public/book-appointment - Get available time slots
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceType = searchParams.get('serviceType');
    
    // Get public booking settings
    const settings = await PublicBookingSettings.getSettings();
    
    // Check if public booking is enabled
    if (!settings.enabled) {
      return NextResponse.json(
        { success: false, message: 'Public booking is currently disabled' },
        { status: 403 }
      );
    }
    
    if (!date) {
      return NextResponse.json(
        { success: false, message: 'Date is required' },
        { status: 400 }
      );
    }
    
    const requestedDate = new Date(date);
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][requestedDate.getDay()];
    
    // Get working day configuration
    const workingDay = settings.workingDays.find(d => d.day === dayName);
    
    if (!workingDay || !workingDay.enabled) {
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          message: 'No appointments available on this day',
          timeSlots: []
        }
      });
    }
    
    // Check if date is blocked
    const isBlocked = settings.blockedDates.some(blocked => {
      const blockedDate = new Date(blocked.date);
      return blockedDate.toDateString() === requestedDate.toDateString();
    });
    
    if (isBlocked) {
      return NextResponse.json({
        success: true,
        data: {
          available: false,
          message: 'This date is not available for booking',
          timeSlots: []
        }
      });
    }
    
    // Get booked appointments for the date
    const startOfDay = new Date(requestedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(requestedDate.setHours(23, 59, 59, 999));
    
    const bookedAppointments = await Appointment.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelled', 'no-show'] },
      isActive: true
    }).select('time');
    
    const bookedTimes = bookedAppointments.map(apt => apt.time);
    
    // Filter available time slots
    const availableSlots = workingDay.timeSlots
      .filter(slot => slot.available && !bookedTimes.includes(slot.time))
      .map(slot => ({
        time: slot.time,
        available: true
      }));
    
    return NextResponse.json({
      success: true,
      data: {
        available: availableSlots.length > 0,
        date: date,
        dayName: dayName,
        timeSlots: availableSlots,
        totalSlots: workingDay.timeSlots.length,
        bookedSlots: bookedTimes.length
      }
    });
    
  } catch (error) {
    console.error('Get available slots error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch available time slots', error: error.message },
      { status: 500 }
    );
  }
}
