import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import Sale from '@/models/Sale';
import Inventory from '@/models/Inventory';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

// GET /api/appointments/[id] - Get appointment by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const { id } = await params;
    const appointment = await Appointment.findById(id)
      .populate('owner', 'firstName lastName email phone address preferences')
      .populate('pet', 'name species breed age weight gender medicalHistory vaccinations')
      .populate('assignedTo', 'firstName lastName email');

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Get related sales for this pet/owner
    const relatedSales = await Sale.find({
      'customer.owner': appointment.owner._id,
      'customer.pet': appointment.pet._id,
      isActive: true
    })
      .populate('items.inventory', 'name category')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pet's recent appointments
    const recentAppointments = await Appointment.find({
      pet: appointment.pet._id,
      _id: { $ne: appointment._id },
      isActive: true
    })
      .populate('assignedTo', 'firstName lastName')
      .sort({ date: -1 })
      .limit(3);

    return NextResponse.json({
      success: true,
      data: {
        appointment,
        relatedSales,
        recentAppointments
      }
    });

  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch appointment', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/appointments/[id] - Update appointment
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
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
        { success: false, message: 'Insufficient permissions to update appointments' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, date, time, duration, notes, priority, status, assignedTo } = body;

    const { id } = await params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check for conflicts if date/time is being changed
    if ((date && date !== appointment.date.toISOString().split('T')[0]) || 
        (time && time !== appointment.time)) {
      const appointmentDate = new Date(date || appointment.date);
      const appointmentTime = time || appointment.time;
      
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: id },
        date: appointmentDate,
        time: appointmentTime,
        status: { $nin: ['cancelled', 'no-show'] },
        isActive: true,
        assignedTo: assignedTo || appointment.assignedTo
      });

      if (conflictingAppointment) {
        return NextResponse.json(
          { success: false, message: 'Time slot is already booked' },
          { status: 400 }
        );
      }
    }

    // Update appointment
    const updateData = {};
    if (type) updateData.type = type;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = time;
    if (duration) updateData.duration = duration;
    if (notes !== undefined) updateData.notes = notes;
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('owner', 'firstName lastName email phone')
      .populate('pet', 'name species breed age')
      .populate('assignedTo', 'firstName lastName');

    return NextResponse.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment: updatedAppointment }
    });

  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update appointment', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id] - Cancel appointment
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
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
        { success: false, message: 'Insufficient permissions to cancel appointments' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update status to cancelled instead of deleting
    appointment.status = 'cancelled';
    await appointment.save();

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel appointment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel appointment', error: error.message },
      { status: 500 }
    );
  }
}