import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'tailtally_fallback_secret_key_please_change_in_production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
const COOKIE_SECURE = process.env.NODE_ENV === 'production'; // Only secure in production

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: 'tailtally-app',
    audience: 'tailtally-users'
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'tailtally-app',
      audience: 'tailtally-users'
    });
  } catch (error) {
    return null;
  }
}

/**
 * Get token from cookies (server-side)
 */
export function getTokenFromCookies() {
  try {
    const cookieStore = cookies();
    return cookieStore.get(COOKIE_NAME)?.value || null;
  } catch (error) {
    return null;
  }
}

/**
 * Get cookie configuration
 */
export function getCookieConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    name: COOKIE_NAME,
    secure: false, // Disable secure for localhost development
    httpOnly: true,
    sameSite: 'lax', // Use lax for development
    path: '/',
    maxAge: getTokenExpireTime(),
    domain: undefined // Let browser handle domain automatically
  };
}

/**
 * Get token expiration time in seconds
 */
function getTokenExpireTime() {
  const expire = JWT_EXPIRE;
  
  if (expire.endsWith('d')) {
    return parseInt(expire) * 24 * 60 * 60; // days to seconds
  } else if (expire.endsWith('h')) {
    return parseInt(expire) * 60 * 60; // hours to seconds
  } else if (expire.endsWith('m')) {
    return parseInt(expire) * 60; // minutes to seconds
  } else if (expire.endsWith('s')) {
    return parseInt(expire); // seconds
  }
  
  return 7 * 24 * 60 * 60; // default 7 days
}

/**
 * Decode token without verification (for client-side)
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Extract user info from token
 */
export function getUserFromToken(token) {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
    permissions: decoded.permissions
  };
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userToken, permission) {
  const user = getUserFromToken(userToken);
  if (!user) return false;
  
  return user.permissions && user.permissions.includes(permission);
}

/**
 * Check if user has specific role
 */
export function hasRole(userToken, role) {
  const user = getUserFromToken(userToken);
  if (!user) return false;
  
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userToken, roles) {
  const user = getUserFromToken(userToken);
  if (!user) return false;
  
  return roles.includes(user.role);
}