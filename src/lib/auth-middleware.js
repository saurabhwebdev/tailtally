import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Authentication middleware to protect API routes
 */
export async function requireAuth(request) {
  try {
    // Get token from cookies in the request
    const cookieName = process.env.COOKIE_NAME || 'auth_token';
    let token = request.cookies.get(cookieName)?.value;
    
    // If no cookie token, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return { success: false, message: 'Authentication required' };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return { success: false, message: 'Invalid or expired token' };
    }
    
    // Connect to database and verify user still exists and is active
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return { success: false, message: 'User not found or inactive' };
    }
    
    // Return user data for use in the route handler
    return { success: true, user, token };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return { success: false, message: 'Authentication failed' };
  }
}

/**
 * Role-based authorization middleware
 */
export async function requireRole(request, allowedRoles) {
  const authResult = await requireAuth(request);
  
  // If auth failed, return the error response
  if (!authResult.success) {
    return authResult;
  }
  
  const { user } = authResult;
  
  if (!allowedRoles.includes(user.role)) {
    return { success: false, message: 'Insufficient permissions' };
  }
  
  return authResult;
}

/**
 * Permission-based authorization middleware
 */
export async function requirePermission(request, requiredPermissions) {
  const authResult = await requireAuth(request);
  
  // If auth failed, return the error response
  if (!authResult.success) {
    return authResult;
  }
  
  const { user } = authResult;
  
  // Check if user has all required permissions
  const hasAllPermissions = requiredPermissions.every(permission => 
    user.permissions && user.permissions.includes(permission)
  );
  
  if (!hasAllPermissions) {
    return { success: false, message: 'Insufficient permissions' };
  }
  
  return authResult;
}

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export async function optionalAuth(request) {
  try {
    // Get token from cookies in the request
    const cookieName = process.env.COOKIE_NAME || 'auth_token';
    const token = request.cookies.get(cookieName)?.value;
    
    if (!token) {
      return { user: null, token: null };
    }
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return { user: null, token: null };
    }
    
    // Connect to database and verify user
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return { user: null, token: null };
    }
    
    return { user, token };
  } catch (error) {
    console.error('Optional auth error:', error);
    return { user: null, token: null };
  }
}

/**
 * Get current user from request
 */
export async function getCurrentUser(request) {
  const authResult = await optionalAuth(request);
  return authResult.user;
}

/**
 * Admin-only middleware
 */
export async function requireAdmin(request) {
  return await requireRole(request, ['admin']);
}

/**
 * Staff and above middleware (staff, veterinarian, admin)
 */
export async function requireStaff(request) {
  return await requireRole(request, ['staff', 'veterinarian', 'admin']);
}

/**
 * Veterinarian and above middleware (veterinarian, admin)
 */
export async function requireVeterinarian(request) {
  return await requireRole(request, ['veterinarian', 'admin']);
}

/**
 * Owner or staff middleware - user can access their own data or staff can access any
 */
export async function requireOwnerOrStaff(request, resourceUserId) {
  const authResult = await requireAuth(request);
  
  // If auth failed, return the error response
  if (!authResult.success) {
    return authResult;
  }
  
  const { user } = authResult;
  
  // Admin and staff can access any resource
  if (['admin', 'veterinarian', 'staff'].includes(user.role)) {
    return authResult;
  }
  
  // Users can only access their own resources
  if (user._id.toString() !== resourceUserId.toString()) {
    return { success: false, message: 'Access denied' };
  }
  
  return authResult;
}