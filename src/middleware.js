import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only apply middleware to API routes (except auth endpoints)
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Public API paths that don't require authentication
  const publicApiPaths = [
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/logout',
    '/api/auth/me',
    '/api/auth/profile',
    '/api/health'
  ];
  
  // Check if the API path is public
  const isPublicApiPath = publicApiPaths.some(path => pathname.startsWith(path));
  
  // If it's a public API path, allow access
  if (isPublicApiPath) {
    return NextResponse.next();
  }
  
  // Get token from cookies using the correct cookie name
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // If no token for protected API route, return unauthorized
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  }

  // Do not verify JWT in middleware (Edge runtime). Let route handlers (Node runtime)
  // perform verification via requireAuth. If a token exists, proceed.
  return NextResponse.next();
}

// Configure middleware to run only on API routes
export const config = {
  matcher: [
    '/api/(.*)',
  ],
};