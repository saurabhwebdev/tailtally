import connectDB from '@/lib/mongodb';
import Owner from '@/models/Owner';
import Pet from '@/models/Pet';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

export async function GET(request, { params }) {
  try {
    const authResult = await requireAuth(request);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    const owner = await Owner.findById(id)
      .populate('userAccount', 'firstName lastName email role')
      .populate({
        path: 'petsCount',
        match: { isActive: true }
      })
      .populate({
        path: 'activePetsCount',
        match: { isActive: true }
      });
    
    if (!owner) {
      return Response.json(
        {
          success: false,
          message: 'Owner not found'
        },
        { status: 404 }
      );
    }
    
    // Get owner's pets
    const pets = await Pet.find({ owner: id, isActive: true })
      .select('name species breed age gender photos medicalHistory vaccinations')
      .sort({ createdAt: -1 });
    
    return Response.json({
      success: true,
      message: 'Owner retrieved successfully',
      data: { 
        owner,
        pets
      }
    });
  } catch (error) {
    console.error('Get owner error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve owner',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_USERS]);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    const body = await request.json();
    
    // Check if owner exists
    const existingOwner = await Owner.findById(id);
    if (!existingOwner) {
      return Response.json(
        {
          success: false,
          message: 'Owner not found'
        },
        { status: 404 }
      );
    }
    
    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingOwner.email) {
      const ownerWithEmail = await Owner.findByEmail(body.email);
      if (ownerWithEmail && ownerWithEmail._id.toString() !== id) {
        return Response.json(
          {
            success: false,
            message: 'An owner with this email already exists'
          },
          { status: 400 }
        );
      }
    }
    
    // Check if phone is being changed and if it already exists
    if (body.phone && body.phone !== existingOwner.phone) {
      const ownerWithPhone = await Owner.findByPhone(body.phone);
      if (ownerWithPhone && ownerWithPhone._id.toString() !== id) {
        return Response.json(
          {
            success: false,
            message: 'An owner with this phone number already exists'
          },
          { status: 400 }
        );
      }
    }
    
    // Update owner
    const updatedOwner = await Owner.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).populate('userAccount', 'firstName lastName email role');
    
    return Response.json({
      success: true,
      message: 'Owner updated successfully',
      data: { owner: updatedOwner }
    });
  } catch (error) {
    console.error('Error updating owner:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return Response.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return Response.json(
        {
          success: false,
          message: `An owner with this ${field} already exists`
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      {
        success: false,
        message: 'Failed to update owner',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.DELETE_USERS]);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    // Check if owner exists
    const existingOwner = await Owner.findById(id);
    if (!existingOwner) {
      return Response.json(
        {
          success: false,
          message: 'Owner not found'
        },
        { status: 404 }
      );
    }
    
    // Check if owner has active pets
    const activePets = await Pet.countDocuments({ owner: id, isActive: true });
    if (activePets > 0) {
      return Response.json(
        {
          success: false,
          message: `Cannot delete owner. They have ${activePets} active pet(s). Please transfer or deactivate the pets first.`
        },
        { status: 400 }
      );
    }
    
    // Soft delete owner
    await Owner.findByIdAndUpdate(id, { isActive: false });
    
    return Response.json({
      success: true,
      message: 'Owner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting owner:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to delete owner',
        error: error.message
      },
      { status: 500 }
    );
  }
}
