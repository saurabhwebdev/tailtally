'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Code, 
  Database, 
  Server, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle
} from 'lucide-react';

// Inspirational quotes about software and pets
const quotes = [
  "Building bridges between pets and their people, one feature at a time.",
  "Where technology meets tail wags and purrs.",
  "Crafted with love for those who care for our furry friends.",
  "Because every pet deserves the best care, powered by the best technology.",
  "Simplifying pet care through thoughtful innovation.",
  "From database to doghouse, we've got you covered.",
  "Paws, claws, and clean code - the perfect combination.",
  "Making veterinary care as smooth as a cat's purr.",
  "Built by pet lovers, for pet lovers.",
  "Where every byte counts towards better pet care."
];

// Get a random quote that changes daily
function getDailyQuote() {
  const today = new Date().toDateString();
  const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return quotes[hash % quotes.length];
}

export default function VersionPage() {
  const dailyQuote = getDailyQuote();

  const techStack = [
    { name: 'Frontend', tech: 'Next.js 14', icon: Code, color: 'text-blue-500' },
    { name: 'Database', tech: 'MongoDB', icon: Database, color: 'text-green-500' },
    { name: 'Backend', tech: 'Node.js', icon: Server, color: 'text-yellow-500' },
    { name: 'Security', tech: 'JWT Auth', icon: Shield, color: 'text-purple-500' },
    { name: 'Performance', tech: 'Optimized', icon: Zap, color: 'text-orange-500' }
  ];

  const features = [
    'Pet Management System',
    'Medical Records Tracking',
    'Appointment Scheduling',
    'Inventory Management',
    'Owner Communication',
    'Invoice & Billing',
    'Real-time Dashboard',
    'Multi-role Authentication'
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-2xl mx-auto px-6">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12">
              {/* Logo Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block group">
                  {/* Subtle glow effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-red-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"
                    style={{ transform: 'scale(1.5)' }}
                  />
                  
                  {/* Logo with advanced effects */}
                  <h1 
                    className="relative text-6xl font-bold inline-block cursor-default transform transition-all duration-700 ease-out hover:scale-[1.02] select-none"
                    style={{
                      fontFamily: 'Brush Script MT, cursive', 
                      background: 'linear-gradient(135deg, #e63946 0%, #ff6b6b 50%, #e63946 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 0 40px rgba(230, 57, 70, 0.3)',
                      animation: 'shimmer 3s ease-in-out infinite',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                  >
                    TailTally
                  </h1>
                  
                  {/* Subtle shine effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)',
                      animation: 'shine 1s ease-out',
                    }}
                  />
                </div>
                
                {/* Tagline with fade-in */}
                <p 
                  className="text-muted-foreground mt-3 text-sm opacity-0 animate-fadeIn"
                  style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                >
                  Comprehensive Veterinary Management System
                </p>
              </div>
              
              <style jsx>{`
                @keyframes shimmer {
                  0%, 100% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                }
                
                @keyframes shine {
                  0% { transform: translateX(-100%) skewX(-15deg); }
                  100% { transform: translateX(200%) skewX(-15deg); }
                }
                
                @keyframes fadeIn {
                  to { opacity: 1; }
                }
              `}</style>

              {/* Version Section */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Version 0.1
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Beta
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Released: {new Date().toLocaleDateString()}
                </p>
              </div>

              <Separator className="my-8" />

              {/* Daily Quote */}
              <div className="text-center mb-10">
                <blockquote className="italic text-lg text-muted-foreground relative">
                  <span className="text-4xl text-primary/20 absolute -top-2 -left-2">"</span>
                  {dailyQuote}
                  <span className="text-4xl text-primary/20 absolute -bottom-2 -right-2">"</span>
                </blockquote>
              </div>

              <Separator className="my-8" />

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-center mb-4 text-muted-foreground uppercase tracking-wider">
                  Built With
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {techStack.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="text-center group cursor-default">
                        <div className="flex justify-center mb-2">
                          <Icon className={`h-8 w-8 ${item.color} group-hover:scale-110 transition-transform`} />
                        </div>
                        <p className="text-xs font-medium">{item.tech}</p>
                        <p className="text-xs text-muted-foreground">{item.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Features Grid */}
              <div>
                <h3 className="text-sm font-semibold text-center mb-4 text-muted-foreground uppercase tracking-wider">
                  Core Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-10 text-center">
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <span>Made with</span>
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  <span>for pet care professionals</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  © 2024 TailTally. All rights reserved.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
