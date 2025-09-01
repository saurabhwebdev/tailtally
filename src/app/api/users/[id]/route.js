import { NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user: currentUser } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    // Non-admin users can only view their own data
    if (currentUser.role !== 'admin' && currentUser._id !== id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You can only view your own data.'
        },
        { status: 403 }
      );
    }
    
    const user = await User.findById(id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        data: { user }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user: currentUser } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }
    
    // Non-admin users can only update their own basic info
    if (currentUser.role !== 'admin' && currentUser._id !== id) {
      return NextResponse.json(
        {
          success: false,
          message: 'Access denied. You can only update your own data.'
        },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const updateData = { ...body };
    
    // Non-admin users cannot change role or permissions
    if (currentUser.role !== 'admin') {
      delete updateData.role;
      delete updateData.permissions;
      delete updateData.isActive;
      delete updateData.professionalInfo;
    }
    
    // Admin cannot change their own role to prevent lockout
    if (currentUser.role === 'admin' && currentUser._id === id && updateData.role && updateData.role !== 'admin') {
      return NextResponse.json(
        {
          success: false,
          message: 'Administrators cannot change their own role'
        },
        { status: 400 }
      );
    }
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password; // Password changes should go through separate endpoint
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.emailVerificationToken;
    delete updateData.passwordResetToken;
    delete updateData.passwordResetExpires;
    delete updateData.emailVerificationExpires;
    
    // Check if email is being changed and ensure it's unique
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await User.findOne({ 
        email: updateData.email.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email address is already in use'
          },
          { status: 409 }
        );
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');
    
    return NextResponse.json(
      {
        success: true,
        message: 'User updated successfully',
        data: { user: updatedUser }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid user ID'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authResult = await requireAdmin(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    const { user: currentUser } = authResult;
    const { id } = await params;
    
    await connectDB();
    
    // Prevent admin from deleting themselves
    if (currentUser._id === id) {
      return NextResponse.json(
        {
          success: false,
          message: 'You cannot delete your own account'
        },
        { status: 400 }
      );
    }
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }
    
    // Soft delete - set isActive to false instead of actually deleting
    await User.findByIdAndUpdate(id, { isActive: false });
    
    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully'
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid user ID'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}