import { NextResponse } from 'next/server';
import { optionalAuth } from '@/lib/auth-middleware';

export async function GET(request) {
  try {
    const authResult = await optionalAuth(request);
    
    const { user } = authResult;
    
    // If no user authenticated, return null user
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          data: {
            user: null
          }
        },
        { status: 200 }
      );
    }
    
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
      avatar: user.avatar,
      bio: user.bio,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return NextResponse.json(
      {
        success: true,
        data: {
          user: userResponse
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get current user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}