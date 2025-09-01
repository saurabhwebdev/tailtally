"use client"

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (options = {}) => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: options.limit || 20,
        skip: options.skip || 0,
        includeRead: options.includeRead !== false ? 'true' : 'false',
        ...(options.category && { category: options.category }),
        ...(options.priority && { priority: options.priority })
      });

      const response = await fetch(`/api/notifications?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        if (options.append) {
          setNotifications(prev => [...prev, ...data.notifications]);
        } else {
          setNotifications(data.notifications);
        }
        setUnreadCount(data.unreadCount);
        setLastFetched(new Date());
      } else {
        setError(data.error || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Fetch unread count only
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch('/api/notifications/count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notification count:', err);
    }
  }, [isAuthenticated, user]);

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: Array.isArray(notificationIds) ? notificationIds : [notificationIds]
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification._id)
              ? { ...notification, isRead: true, readAt: new Date().toISOString() }
              : notification
          )
        );
        
        // Update unread count
        const readCount = Array.isArray(notificationIds) ? notificationIds.length : 1;
        setUnreadCount(prev => Math.max(0, prev - readCount));
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to mark notifications as read');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
      setError('Failed to update notifications');
      return { success: false, error: 'Failed to update notifications' };
    }
  }, [isAuthenticated, user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markAllAsRead: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            isRead: true,
            readAt: new Date().toISOString()
          }))
        );
        setUnreadCount(0);
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to mark all notifications as read');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to update notifications');
      return { success: false, error: 'Failed to update notifications' };
    }
  }, [isAuthenticated, user]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    if (!isAuthenticated || !user) return;

    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const deletedNotification = notifications.find(n => n._id === notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        // Update unread count if deleted notification was unread
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return { success: true };
      } else {
        setError(data.error || 'Failed to delete notification');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
      return { success: false, error: 'Failed to delete notification' };
    }
  }, [isAuthenticated, user, notifications]);

  // Add a new notification to local state (for real-time updates)
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Refresh notifications
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Auto-fetch notifications on authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
    } else {
      // Reset state when not authenticated
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      setLastFetched(null);
    }
  }, [isAuthenticated, user, fetchNotifications]);

  // Periodically refresh unread count (every 2 minutes)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, user, fetchUnreadCount]);

  const value = {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    lastFetched,
    
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    refresh,
    
    // Clear error
    clearError: () => setError(null)
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Custom hook for notification count only (lighter weight)
export function useNotificationCount() {
  const { unreadCount, fetchUnreadCount } = useNotifications();
  return { unreadCount, fetchUnreadCount };
}
