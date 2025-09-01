import { NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const authResult = await requireAuth(request);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }
    
    const { user: currentUser } = authResult;
    const { searchParams } = new URL(request.url);
    
    await connectDB();
    
    // Build query based on user role and search parameters
    let query = { isActive: true };
    
    // Non-admin users can only see their own data
    if (currentUser.role !== 'admin') {
      query._id = currentUser._id;
    } else {
      // Admin can filter by role, search, etc.
      const role = searchParams.get('role');
      const search = searchParams.get('search');
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 10;
      
      if (role) {
        query.role = role;
      }
      
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      const skip = (page - 1) * limit;
      
      const users = await User.find(query)
        .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await User.countDocuments(query);
      
      return NextResponse.json(
        {
          success: true,
          data: {
            users,
            pagination: {
              current: page,
              total: Math.ceil(total / limit),
              count: users.length,
              totalCount: total
            }
          }
        },
        { status: 200 }
      );
    }
    
    // For non-admin users, return only their own data
    const user = await User.findById(currentUser._id)
      .select('-password -passwordResetToken -passwordResetExpires -emailVerificationToken');
    
    return NextResponse.json(
      {
        success: true,
        data: { user }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get users error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authResult = await requireAdmin(request);
    
    // If auth failed, return the error response
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.message.includes('permissions') ? 403 : 401 }
      );
    }
    
    await connectDB();
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
      professionalInfo
    } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields'
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists'
        },
        { status: 409 }
      );
    }
    
    // Create new user
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
      address,
      professionalInfo,
      isEmailVerified: true // Admin-created users are auto-verified
    };
    
    const user = new User(userData);
    await user.save();
    
    // Remove sensitive fields
    user.password = undefined;
    
    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        data: { user }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Create user error:', error);
    
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