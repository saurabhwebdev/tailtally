import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PUT(request) {
  try {
    const authResult = await requireAuth(request);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      dateOfBirth,
      gender,
      address,
      avatar,
      professionalInfo,
      preferences
    } = body;
    
    // Connect to database
    await connectDB();
    
    // Prepare update data
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (avatar !== undefined) {
      // Validate avatar URL length
      if (avatar && avatar.length > 5000) {
        return NextResponse.json(
          {
            success: false,
            message: 'Avatar URL is too long. Please try generating a new avatar.',
            errors: ['Avatar URL cannot exceed 5000 characters']
          },
          { status: 400 }
        );
      }
      updateData.avatar = avatar;
    }
    if (professionalInfo !== undefined) updateData.professionalInfo = professionalInfo;
    if (preferences !== undefined) updateData.preferences = preferences;
    
    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updateData },
      { new: true, runValidators: false } // Don't run validators on the entire document
    );
    
    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      );
    }
    
    // Manually validate the updated fields
    const validationErrors = [];
    
    if (firstName !== undefined && (!firstName || firstName.trim().length === 0)) {
      validationErrors.push('First name is required');
    }
    
    if (lastName !== undefined && (!lastName || lastName.trim().length === 0)) {
      validationErrors.push('Last name is required');
    }
    
    if (email !== undefined && (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      validationErrors.push('Please provide a valid email');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        },
        { status: 400 }
      );
    }
    
    // Prepare user data for response (exclude sensitive fields)
    const userResponse = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
      address: updatedUser.address,
      professionalInfo: updatedUser.professionalInfo,
      isActive: updatedUser.isActive,
      isEmailVerified: updatedUser.isEmailVerified,
      preferences: updatedUser.preferences,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
    
    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: userResponse
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle specific MongoDB validation errors
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
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}