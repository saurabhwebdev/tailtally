"use client"

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X, Calendar, Package, FileText, CreditCard, PawPrint, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/notification-context';
import { NotificationItem } from './notification-item';
import Link from 'next/link';

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    clearError
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, category filters

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (open && unreadCount > 0) {
      const unreadNotifications = notifications
        .filter(n => !n.isRead)
        .map(n => n._id);
      
      if (unreadNotifications.length > 0) {
        // Mark as read after a short delay to improve UX
        const timer = setTimeout(() => {
          markAsRead(unreadNotifications);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [open, notifications, unreadCount, markAsRead]);

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'all') return true;
    return notification.category === filter;
  });

  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      appointment: Calendar,
      inventory: Package,
      invoice: FileText,
      payment: CreditCard,
      pet: PawPrint,
      system: AlertTriangle,
      general: Bell
    };
    return iconMap[category] || Bell;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colorMap = {
      urgent: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-blue-500',
      low: 'bg-gray-500'
    };
    return colorMap[priority] || 'bg-blue-500';
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleRefresh = () => {
    fetchNotifications();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent/80 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold min-w-[20px] animate-pulse"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full animate-ping opacity-75"></span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-96 glass-card animate-scale-in" 
        align="end" 
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="h-8 text-xs hover:bg-accent/50"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="h-8 text-xs hover:bg-accent/50"
            >
              <Bell className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 p-3 border-b">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="h-7 text-xs px-3"
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="h-7 text-xs px-3"
          >
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === 'appointment' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('appointment')}
            className="h-7 text-xs px-3"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Appointments
          </Button>
          <Button
            variant={filter === 'inventory' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('inventory')}
            className="h-7 text-xs px-3"
          >
            <Package className="h-3 w-3 mr-1" />
            Inventory
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 border-b bg-destructive/10 border-destructive/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification._id)}
                  onDelete={() => deleteNotification(notification._id)}
                  getCategoryIcon={getCategoryIcon}
                  getPriorityColor={getPriorityColor}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-3">
              <Link href="/notifications" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-center text-sm hover:bg-accent/50">
                  View all notifications
                </Button>
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
