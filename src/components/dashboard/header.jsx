"use client"

import { useState, useEffect, useRef } from "react"
import { User, ArrowRight, Shield, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Navigation } from "./navigation"
import { useAuth } from "@/contexts/auth-context"
import LogoutButton from "@/components/auth/logout-button"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { getModernAvatarUrl, getUserInitials, generateModernAvatarDataUri, generateModernAvatarHttpUrl } from "@/lib/modern-avatar"
import ComprehensiveHelpModal from "@/components/help/comprehensive-help-modal"
import Link from "next/link"

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const [avatarImageUrl, setAvatarImageUrl] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  
  const userInitials = getUserInitials(user);

  // Generate the actual image URL from the seed
  useEffect(() => {
    const generateAvatar = async () => {
      const avatarSeed = getModernAvatarUrl(user, 'lorelei', 64);
      if (avatarSeed) {
        try {
          // For modern avatars, prioritize HTTP API for better performance
          const parts = avatarSeed.split(':');
          if (parts.length === 4) {
            const [, style, seed, size] = parts;
            const httpUrl = generateModernAvatarHttpUrl(seed, style, parseInt(size));
            setAvatarImageUrl(httpUrl);
          } else {
            const dataUri = await generateModernAvatarDataUri(avatarSeed);
            setAvatarImageUrl(dataUri);
          }
        } catch (error) {
          console.error('Error generating avatar:', error);
        }
      }
    };

    generateAvatar();
  }, [user, user?.avatar]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass-card animate-slide-up shadow-sm shadow-black/5 dark:shadow-white/5">
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      {/* Enhanced bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      <div className="flex h-16 items-center px-6">
        {/* Logo - Cursive font styling */}
        <div className="flex items-center">
          <div className="flex items-center group">
            <span className="text-2xl font-bold hover:scale-105 transition-transform duration-200" style={{fontFamily: 'Brush Script MT, cursive', color: '#e63946'}}>
              TailTally
            </span>
          </div>
        </div>

        {/* Spacer to push navigation to the right */}
        <div className="flex-1"></div>

        {/* Navigation Menu - moved to the right */}
        <div className="mr-4">
          <Navigation />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelpModal(true)}
            className="relative hover:bg-accent/80 transition-all duration-200 hover:scale-105"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* User Profile Dropdown with enhanced styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full hover:bg-accent/80 transition-all duration-200 hover:scale-105 active:scale-95 hover-lift"
              >
                <Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                  <AvatarImage src={avatarImageUrl} alt={user?.fullName || user?.email || '@user'} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card animate-scale-in" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2 p-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarImageUrl} alt={user?.fullName || user?.email || '@user'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold leading-none">{user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground mt-1">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 group" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-accent/50 transition-colors duration-200 group" asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Help Modal */}
      <ComprehensiveHelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </header>
  )
}
