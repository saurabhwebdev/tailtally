"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  PawPrint,
  Calendar,
  FileText,
  Shield,
  Crown,
  UserCog,
  UserCheck,
  HelpCircle,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const getNavigationItems = (userRole) => {
  const mainNavigation = [
    { 
      category: "Main",
      items: [
        { name: "Dashboard", href: "/", icon: Home, description: "Overview & insights" },
        { name: "Pets", href: "/pets", icon: PawPrint, description: "Manage pet records" },
        { name: "Owners", href: "/owners", icon: UserCheck, description: "Customer management" },
        { name: "Appointments", href: "/appointments", icon: Calendar, description: "Schedule & bookings" }
      ]
    },
    {
      category: "Business",
      items: [
        { name: "Inventory", href: "/inventory", icon: Package, description: "Stock & products" },
        { name: "Sales", href: "/sales", icon: ShoppingCart, description: "POS & transactions" },
        { name: "Reports", href: "/reports", icon: BarChart3, description: "Analytics & insights" }
      ]
    },
    {
      category: "Support",
      items: [
        { name: "Help Center", href: "/help", icon: HelpCircle, description: "Get assistance" },
        { name: "Settings", href: "/settings", icon: Settings, description: "Preferences & config" }
      ]
    }
  ];

  // Add admin section for admin users
  if (userRole === 'admin') {
    mainNavigation.splice(-1, 0, {
      category: "Administration",
      isAdmin: true,
      items: [
        { name: "Admin Dashboard", href: "/admin?tab=dashboard", icon: Crown, description: "System overview", isAdmin: true },
        { name: "User Management", href: "/admin?tab=users", icon: UserCog, description: "Manage users", isAdmin: true },
        { name: "Role Management", href: "/admin?tab=roles", icon: Shield, description: "Permissions & roles", isAdmin: true }
      ]
    });
  }

  return mainNavigation;
}

export function Navigation() {
  const { user } = useAuth();
  const pathname = usePathname();
  const navigation = getNavigationItems(user?.role);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Update current tab from URL params on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab') || 'dashboard';
      setCurrentTab(tab);
    }
  }, [pathname]);

  // Get current page name for the trigger button
  const getCurrentPageName = () => {
    for (const category of navigation) {
      for (const item of category.items) {
        // Check for exact match first
        if (item.href === pathname || (pathname === '/' && item.href === '/')) {
          return item.name;
        }
        // Check for admin tab matches
        if (pathname.startsWith('/admin') && item.href.startsWith('/admin')) {
          const urlParams = new URLSearchParams(item.href.split('?')[1] || '');
          const itemTab = urlParams.get('tab');
          
          if (itemTab === currentTab) {
            return item.name;
          }
        }
      }
    }
    return 'Dashboard';
  };

  const currentPageName = getCurrentPageName();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="group relative h-9 px-4 bg-background/80 border border-border/40 hover:bg-accent/80 hover:border-border/60 transition-all duration-200 backdrop-blur-sm shadow-sm"
        >
          <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
            {currentPageName}
          </span>
          <ChevronDown className={`ml-2 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 border-border/40 bg-background/95 backdrop-blur-xl shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-100px)] flex flex-col" 
        align="start"
        sideOffset={8}
        side="bottom"
        avoidCollisions={true}
        collisionPadding={20}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-1">
            {navigation.map((category, categoryIndex) => (
              <div key={category.category} className={categoryIndex > 0 ? 'mt-1' : ''}>
                {/* Category Header */}
                <div className="flex items-center px-3 py-2 mb-1">
                  <div className="flex items-center space-x-2">
                    {category.isAdmin && (
                      <div className="p-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-md">
                        <Sparkles className="h-3 w-3 text-amber-600" />
                      </div>
                    )}
                    <span className={`text-xs font-semibold tracking-wide uppercase ${
                      category.isAdmin 
                        ? 'text-amber-700 dark:text-amber-400' 
                        : 'text-muted-foreground'
                    }`}>
                      {category.category}
                    </span>
                    {category.isAdmin && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 border-0">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Category Items */}
                <div className="space-y-0.5">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    let isActive = pathname === item.href || (pathname === '/' && item.href === '/');
                    
                    // Check for admin tab active state
                    if (pathname.startsWith('/admin') && item.href.startsWith('/admin')) {
                      const urlParams = new URLSearchParams(item.href.split('?')[1] || '');
                      const itemTab = urlParams.get('tab');
                      isActive = itemTab === currentTab;
                    }
                    
                    return (
                      <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                        <div className={`group relative flex items-center px-3 py-2.5 mx-1 rounded-lg transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? item.isAdmin
                              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 shadow-sm'
                              : 'bg-primary/10 text-primary shadow-sm'
                            : 'hover:bg-accent/60 text-foreground/70 hover:text-foreground'
                        }`}>
                          {/* Icon */}
                          <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                            isActive 
                              ? item.isAdmin 
                                ? 'bg-amber-500/20 text-amber-600'
                                : 'bg-primary/20 text-primary'
                              : 'text-muted-foreground group-hover:text-foreground group-hover:bg-accent/80'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 ml-3 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium truncate ${
                                isActive ? 'font-semibold' : ''
                              }`}>
                                {item.name}
                              </span>
                              {isActive && (
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  item.isAdmin ? 'bg-amber-500' : 'bg-primary'
                                }`} />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                
                {/* Category Separator */}
                {categoryIndex < navigation.length - 1 && (
                  <div className="h-px bg-border/40 mx-3 my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Fixed Footer - Always Visible */}
        <div className="flex-shrink-0 border-t border-border/40 p-3 bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Welcome, {user?.firstName || 'User'}</span>
            <Badge variant="outline" className="text-xs">
              {user?.role || 'user'}
            </Badge>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
