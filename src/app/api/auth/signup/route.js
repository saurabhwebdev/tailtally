import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, getCookieConfig } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      address,
      professionalInfo,
      dateOfBirth,
      gender
    } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields: firstName, lastName, email, password, role'
        },
        { status: 400 }
      );
    }
    
    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 6 characters long'
        },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ['admin', 'veterinarian', 'staff', 'customer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role. Must be one of: admin, veterinarian, staff, customer'
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
    
    // Validate professional info for veterinarians and staff
    if (['veterinarian', 'staff'].includes(role)) {
      if (!professionalInfo?.licenseNumber && role === 'veterinarian') {
        return NextResponse.json(
          {
            success: false,
            message: 'License number is required for veterinarians'
          },
          { status: 400 }
        );
      }
    }
    
    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      address,
      dateOfBirth,
      gender,
      isEmailVerified: false // In production, implement email verification
    };
    
    // Add professional info if provided
    if (professionalInfo && ['veterinarian', 'staff', 'admin'].includes(role)) {
      userData.professionalInfo = professionalInfo;
    }
    
    // Create new user
    const user = new User(userData);
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Prepare user data for response (exclude sensitive fields)
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      permissions: user.permissions,
      address: user.address,
      professionalInfo: user.professionalInfo,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
      createdAt: user.createdAt
    };
    
    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          user: userResponse,
          token
        }
      },
      { status: 201 }
    );
    
    // Set cookie with token
    const cookieConfig = getCookieConfig();
    response.cookies.set({
      ...cookieConfig,
      value: token
    });
    
    return response;
    
  } catch (error) {
    console.error('Signup error:', error);
    
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
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists'
        },
        { status: 409 }
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