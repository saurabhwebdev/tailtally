import connectDB from '@/lib/mongodb';
import Pet from '@/models/Pet';
import { requireAuth, requirePermission } from '@/lib/auth-middleware';
import { PERMISSIONS } from '@/lib/permissions';

export async function GET(request, { params }) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    await connectDB();
    
    const { id } = await params;
    let query = { _id: id, isActive: true };
    
    // Customers can only see their own pets
    if (user.role === 'customer') {
      query.owner = user._id;
    }
    
    const pet = await Pet.findOne(query)
      .populate('owner', 'firstName lastName email phone');
    
    if (!pet) {
      return Response.json(
        {
          success: false,
          message: 'Pet not found'
        },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Pet retrieved successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Get pet error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to retrieve pet',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.WRITE_PETS]);
    
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user } = authResult;
    await connectDB();
    
    const { id } = await params;
    let query = { _id: id, isActive: true };
    
    // Customers can only update their own pets
    if (user.role === 'customer') {
      query.owner = user._id;
    }
    
    const body = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete body._id;
    delete body.createdAt;
    delete body.updatedAt;
    
    // For customers, ensure they can't change owner
    if (user.role === 'customer') {
      delete body.owner;
      delete body.ownerInfo;
    }
    
    const pet = await Pet.findOneAndUpdate(
      query,
      body,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('owner', 'firstName lastName email phone');
    
    if (!pet) {
      return Response.json(
        {
          success: false,
          message: 'Pet not found'
        },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Pet updated successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Update pet error:', error);
    
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
    
    return Response.json(
      {
        success: false,
        message: 'Failed to update pet',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requirePermission(request, [PERMISSIONS.DELETE_PETS]);
    
    if (!authResult.success) {
      return Response.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user } = authResult;
    await connectDB();
    
    const { id } = await params;
    let query = { _id: id, isActive: true };
    
    // Customers can only delete their own pets
    if (user.role === 'customer') {
      query.owner = user._id;
    }
    
    // Soft delete by setting isActive to false
    const pet = await Pet.findOneAndUpdate(
      query,
      { isActive: false },
      { new: true }
    );
    
    if (!pet) {
      return Response.json(
        {
          success: false,
          message: 'Pet not found'
        },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Pet deleted successfully',
      data: { pet }
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    return Response.json(
      {
        success: false,
        message: 'Failed to delete pet',
        error: error.message
      },
      { status: 500 }
    );
  }
}
