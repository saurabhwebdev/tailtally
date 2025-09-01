import { NextResponse } from 'next/server';
import { getCookieConfig } from '@/lib/jwt';

export async function POST(request) {
  try {
    console.log('=== Logout API Called ===');
    
    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful'
      },
      { status: 200 }
    );
    
    // Clear the authentication cookie
    const cookieConfig = getCookieConfig();
    console.log('Clearing cookie with config:', { ...cookieConfig, value: '[CLEARED]' });
    
    response.cookies.set({
      ...cookieConfig,
      value: '',
      maxAge: 0
    });
    
    // Also try setting with expires in the past for better browser compatibility
    response.cookies.set({
      ...cookieConfig,
      value: '',
      expires: new Date(0)
    });
    
    console.log('Logout successful, cookie cleared');
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  // Allow GET method for logout as well
  return POST(request);
}