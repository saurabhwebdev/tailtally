import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import Sale from '@/models/Sale';
import Inventory from '@/models/Inventory';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/appointments - Get all appointments with filtering and pagination
export async function GET(request) {
  try {
    await connectDB();
    
    // Check authentication
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const ownerId = searchParams.get('ownerId');
    const petId = searchParams.get('petId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const assignedTo = searchParams.get('assignedTo');

    // Build query
    let query = { isActive: true };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (ownerId) {
      query.owner = ownerId;
    }

    if (petId) {
      query.pet = petId;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { appointmentNumber: searchRegex },
        { notes: searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const appointments = await Appointment.find(query)
      .populate('owner', 'firstName lastName email phone')
      .populate('pet', 'name species breed age')
      .populate('assignedTo', 'firstName lastName')
      .sort({ date: 1, time: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments(query);

    // Get appointment statistics
    const stats = await Appointment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAppointments: { $sum: 1 },
          scheduledCount: { $sum: { $cond: [{ $eq: ['$status', 'scheduled'] }, 1, 0] } },
          confirmedCount: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        appointments,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: appointments.length,
          totalCount: total
        },
        statistics: stats[0] || {
          totalAppointments: 0,
          scheduledCount: 0,
          confirmedCount: 0,
          completedCount: 0,
          cancelledCount: 0
        }
      }
    });

  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointments', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create a new appointment
export async function POST(request) {
  try {
    await connectDB();
    
    // Check authentication and permissions
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const permissionResult = await requirePermission(request, [PERMISSIONS.MANAGE_APPOINTMENTS]);
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions to create appointments' },
        { status: 403 }
      );
    }

    const { user } = authResult;
    const body = await request.json();

    const {
      pet: petId,
      owner: ownerId,
      type,
      date,
      time,
      duration,
      notes,
      priority,
      assignedTo
    } = body;

    // Validate required fields
    if (!petId || !ownerId || !type || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Pet, owner, type, date, and time are required' },
        { status: 400 }
      );
    }

    // Verify owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return NextResponse.json(
        { success: false, message: 'Owner not found' },
        { status: 404 }
      );
    }

    // Verify pet exists and belongs to owner
    const pet = await Pet.findById(petId);
    if (!pet || pet.owner.toString() !== ownerId) {
      return NextResponse.json(
        { success: false, message: 'Pet not found or does not belong to owner' },
        { status: 404 }
      );
    }

    // Check for appointment conflicts
    const appointmentDate = new Date(date);
    const conflictingAppointment = await Appointment.findOne({
      date: appointmentDate,
      time: time,
      status: { $nin: ['cancelled', 'no-show'] },
      isActive: true,
      assignedTo: assignedTo || null
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, message: 'Time slot is already booked' },
        { status: 400 }
      );
    }

    // Generate appointment number
    const year = appointmentDate.getFullYear();
    const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
    
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
    const appointmentData = {
      appointmentNumber,
      pet: petId,
      owner: ownerId,
      type,
      date: appointmentDate,
      time,
      duration: duration || 30,
      notes: notes || '',
      priority: priority || 'normal',
      assignedTo: assignedTo || null,
      status: 'scheduled'
    };

    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // Update owner's last visit
    await owner.updateLastVisit();

    // Populate the response
    await appointment.populate([
      { path: 'owner', select: 'firstName lastName email phone' },
      { path: 'pet', select: 'name species breed age' },
      { path: 'assignedTo', select: 'firstName lastName' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment }
    }, { status: 201 });

  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create appointment', error: error.message },
      { status: 500 }
    );
  }
}