import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, getCookieConfig } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide email and password'
        },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const authResult = await User.authenticate(email, password);
    
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message
        },
        { status: 401 }
      );
    }
    
    const { user } = authResult;
    
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
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };
    
    // Create response with cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: userResponse,
          token
        }
      },
      { status: 200 }
    );
    
    // Set cookie with token
    const cookieConfig = getCookieConfig();
    
    response.cookies.set(cookieConfig.name, token, {
      httpOnly: true,
      secure: false, // Allow over HTTP in development
      sameSite: 'lax',
      path: '/',
      maxAge: cookieConfig.maxAge
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}