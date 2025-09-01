"use client"

import { useState } from 'react';
import { Check, X, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  getCategoryIcon,
  getPriorityColor,
  onClose
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const CategoryIcon = getCategoryIcon(notification.category);
  const priorityColor = getPriorityColor(notification.priority);

  const handleMarkAsRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (notification.isRead || isMarkingRead) return;
    
    setIsMarkingRead(true);
    await onMarkAsRead();
    setIsMarkingRead(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDeleting) return;
    
    setIsDeleting(true);
    await onDelete();
  };

  const handleItemClick = () => {
    if (notification.actionUrl) {
      onClose?.();
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const NotificationContent = () => (
    <div className={cn(
      "flex items-start gap-3 p-4 hover:bg-accent/30 transition-colors duration-200 cursor-pointer",
      !notification.isRead && "bg-accent/20",
      (isDeleting || isMarkingRead) && "opacity-50 pointer-events-none"
    )}>
      {/* Category Icon with Priority Indicator */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          notification.isRead ? "bg-muted" : "bg-accent"
        )}>
          <CategoryIcon className={cn(
            "h-4 w-4",
            notification.isRead ? "text-muted-foreground" : "text-accent-foreground"
          )} />
        </div>
        
        {/* Priority indicator dot */}
        <div className={cn(
          "absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
          priorityColor
        )} />
        
        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            "text-sm font-medium leading-tight",
            notification.isRead ? "text-muted-foreground" : "text-foreground"
          )}>
            {notification.title}
          </h4>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {!notification.isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAsRead}
                disabled={isMarkingRead}
                className="h-6 w-6 p-0 hover:bg-accent/50"
                title="Mark as read"
              >
                <Check className={cn(
                  "h-3 w-3",
                  isMarkingRead && "animate-spin"
                )} />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
              title="Delete"
            >
              <X className={cn(
                "h-3 w-3",
                isDeleting && "animate-spin"
              )} />
            </Button>
          </div>
        </div>

        <p className={cn(
          "text-xs leading-relaxed",
          notification.isRead ? "text-muted-foreground" : "text-foreground/80"
        )}>
          {notification.message}
        </p>

        {/* Metadata row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-0.5 h-5"
            >
              {notification.category}
            </Badge>
            
            {notification.priority !== 'medium' && (
              <Badge 
                variant={notification.priority === 'urgent' ? 'destructive' : 'secondary'}
                className="text-xs px-2 py-0.5 h-5"
              >
                {notification.priority}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTimeAgo(notification.createdAt)}
            </div>
            
            {notification.actionUrl && (
              <ExternalLink className="h-3 w-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap with Link if actionUrl exists
  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl} onClick={handleItemClick}>
        <div className="group">
          <NotificationContent />
        </div>
      </Link>
    );
  }

  return (
    <div className="group">
      <NotificationContent />
    </div>
  );
}
