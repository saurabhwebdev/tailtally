'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null
};

// Action types
const ActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.loading
      };
    
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null
      };
    
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload.token
      };
    
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // API helper function
  const apiRequest = async (url, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include', // Include cookies
      ...options
    };

    // Add Authorization header if we have a token
    if (state.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });

      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Store token in localStorage for persistence
      if (data.data.token) {
        localStorage.setItem('auth_token', data.data.token);
      }

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { 
          user: data.data.user,
          token: data.data.token
        }
      });

      // Redirect to dashboard after successful login only if not already there
      // This prevents unnecessary redirects when already on home page
      const currentPath = window.location.pathname;
      if (currentPath === '/auth' || currentPath === '/login') {
        router.push('/');
      }
      
      return data;
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      dispatch({ type: ActionTypes.LOGIN_START });

      const data = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { user: data.data.user }
      });

      // Redirect to dashboard after successful signup only if not already there
      // This prevents unnecessary redirects when already on home page
      const currentPath = window.location.pathname;
      if (currentPath === '/auth' || currentPath === '/login') {
        router.push('/');
      }
      
      return data;
    } catch (error) {
      dispatch({
        type: ActionTypes.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Starting logout process...');
      
      await apiRequest('/api/auth/logout', {
        method: 'POST'
      });

      console.log('Logout API call successful, clearing auth state...');
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
      dispatch({ type: ActionTypes.LOGOUT });
      
      // Redirect to auth page after successful logout
      console.log('Redirecting to /auth...');
      router.push('/auth');
    } catch (error) {
      // Even if logout request fails, clear local state and redirect
      console.error('Logout API error, but clearing state anyway:', error);
      // Clear token from localStorage
      localStorage.removeItem('auth_token');
      dispatch({ type: ActionTypes.LOGOUT });
      
      // Still redirect even if API call fails
      console.log('Redirecting to /auth after error...');
      router.push('/auth');
    }
  };

  // Get current user
  const getCurrentUser = async (retryCount = 0) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: true } });

      const data = await apiRequest('/api/auth/me');

      dispatch({
        type: ActionTypes.SET_USER,
        payload: { user: data.data.user }
      });

      return data.data.user;
    } catch (error) {
      // Retry logic for network errors (but not auth errors)
      if (retryCount < 2 && 
          !error.message.includes('401') && 
          !error.message.includes('Authentication') && 
          !error.message.includes('token') &&
          (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Progressive delay
        return getCurrentUser(retryCount + 1);
      }
      
      // For authentication errors (401, token issues), clear the user state
      if (error.message.includes('401') || 
          error.message.includes('Authentication') || 
          error.message.includes('token') ||
          error.message.includes('Unauthorized')) {
        console.log('Authentication failed, clearing user state:', error.message);
        dispatch({
          type: ActionTypes.SET_USER,
          payload: { user: null }
        });
      } else {
        // For other errors (network, server), keep the loading state but don't clear user
        console.warn('Network error during auth check:', error.message);
        dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: false } });
      }
      return null;
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      const data = await apiRequest('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      dispatch({
        type: ActionTypes.SET_USER,
        payload: { user: data.data.user }
      });

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  // Permission and role helpers
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!state.user) return false;
    return state.user.role === role;
  };

  const hasAnyRole = (roles) => {
    if (!state.user) return false;
    return roles.includes(state.user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isVeterinarian = () => hasRole('veterinarian');
  const isStaff = () => hasRole('staff');
  const isCustomer = () => hasRole('customer');

  // Check if user can access resource
  const canAccessResource = (resourceUserId) => {
    if (!state.user) return false;
    
    // Admin and staff can access any resource
    if (['admin', 'veterinarian', 'staff'].includes(state.user.role)) {
      return true;
    }
    
    // Users can access their own resources
    return state.user._id === resourceUserId;
  };

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Load token from localStorage if available
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          dispatch({ type: ActionTypes.SET_TOKEN, payload: { token: storedToken } });
        }
        
        await getCurrentUser();
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          dispatch({ type: ActionTypes.SET_LOADING, payload: { loading: false } });
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    signup,
    logout,
    getCurrentUser,
    updateProfile,
    clearError,
    apiRequest,
    
    // Helpers
    hasPermission,
    hasRole,
    hasAnyRole,
    isAdmin,
    isVeterinarian,
    isStaff,
    isCustomer,
    canAccessResource
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC for protected routes
export function withAuth(WrappedComponent, options = {}) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { requireRole, requirePermission, redirectTo = '/login' } = options;

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo;
        return;
      }

      if (isAuthenticated && user) {
        // Check role requirement
        if (requireRole && user.role !== requireRole) {
          window.location.href = '/unauthorized';
          return;
        }

        // Check permission requirement
        if (requirePermission && !user.permissions?.includes(requirePermission)) {
          window.location.href = '/unauthorized';
          return;
        }
      }
    }, [isAuthenticated, isLoading, user]);

    if (isLoading) {
      return <div>Loading...</div>; // Replace with your loading component
    }

    if (!isAuthenticated) {
      return null; // Will redirect
    }

    if (requireRole && user?.role !== requireRole) {
      return null; // Will redirect
    }

    if (requirePermission && !user?.permissions?.includes(requirePermission)) {
      return null; // Will redirect
    }

    return <WrappedComponent {...props} />;
  };
}

// Hook for protected routes
export function useRequireAuth(options = {}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { requireRole, requirePermission, redirectTo = '/login' } = options;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
      return;
    }

    if (isAuthenticated && user) {
      if (requireRole && user.role !== requireRole) {
        window.location.href = '/unauthorized';
        return;
      }

      if (requirePermission && !user.permissions?.includes(requirePermission)) {
        window.location.href = '/unauthorized';
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requireRole, requirePermission, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isAuthorized: isAuthenticated && 
      (!requireRole || user?.role === requireRole) &&
      (!requirePermission || user?.permissions?.includes(requirePermission))
  };
}