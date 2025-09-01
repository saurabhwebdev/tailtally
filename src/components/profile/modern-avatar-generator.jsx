'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  Palette,
  Check,
  Loader2
} from 'lucide-react';
import { 
  MODERN_AVATAR_STYLES,
  generateModernAvatarOptions,
  generateModernAvatarDataUri,
  generateModernAvatarHttpUrl,
  getUserInitials
} from '@/lib/modern-avatar';

export default function ModernAvatarGenerator({ user, isOpen, onClose, onSave }) {
  const [currentAvatars, setCurrentAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('lorelei');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate multiple avatar options
  const generateAvatars = async () => {
    setIsGenerating(true);
    try {
      const avatars = await generateModernAvatarOptions(user, selectedStyle, 6);
      setCurrentAvatars(avatars);
      setSelectedAvatar(avatars[0] || null);
    } catch (error) {
      console.error('Failed to generate avatars:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate avatars when style changes or dialog opens
  useEffect(() => {
    if (isOpen) {
      generateAvatars();
    }
  }, [selectedStyle, isOpen]);

  // Handle saving selected avatar
  const handleSave = async () => {
    if (!selectedAvatar) return;
    
    setIsSaving(true);
    try {
      await onSave(selectedAvatar.seed);
      onClose();
    } catch (error) {
      console.error('Failed to save avatar:', error);
      alert('Failed to save avatar. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Choose Your Avatar Style
          </DialogTitle>
          <DialogDescription>
            Select an avatar style and pick your favorite design
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pb-4">
          {/* Style Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Avatar Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {MODERN_AVATAR_STYLES.slice(0, 4).map((style) => (
                <Button
                  key={style.value}
                  variant={selectedStyle === style.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStyle(style.value)}
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <span className="text-xl">{style.emoji}</span>
                  <span className="text-xs font-medium">{style.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Avatar Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Choose an avatar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAvatars}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Generate New
              </Button>
            </div>

            {isGenerating ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto pr-2">
                {currentAvatars.slice(0, 6).map((avatar) => (
                  <ModernAvatarDisplay
                    key={avatar.id}
                    avatar={avatar}
                    isSelected={selectedAvatar?.id === avatar.id}
                    onSelect={() => setSelectedAvatar(avatar)}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedAvatar || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Avatar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Component for displaying individual avatar
function ModernAvatarDisplay({ avatar, isSelected, onSelect, user }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAvatar = async () => {
      if (avatar?.seed) {
        setIsLoading(true);
        
        try {
          // For modern avatars, prioritize HTTP API for better performance
          const parts = avatar.seed.split(':');
          if (parts.length === 4) {
            const [, style, seed, size] = parts;
            const httpUrl = generateModernAvatarHttpUrl(seed, style, parseInt(size));
            setImageUrl(httpUrl);
          } else {
            // Fallback to data URI generation
            const dataUri = await generateModernAvatarDataUri(avatar.seed);
            setImageUrl(dataUri);
          }
        } catch (error) {
          console.error('Error generating avatar:', error);
        }
        
        setIsLoading(false);
      }
    };

    generateAvatar();
  }, [avatar?.seed]);

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-200 
        rounded-xl overflow-hidden group
        ${isSelected 
          ? 'ring-2 ring-primary ring-offset-2 transform scale-105' 
          : 'hover:transform hover:scale-105'
        }
      `}
      onClick={onSelect}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <img 
            src={imageUrl} 
            alt="Avatar option"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Hover overlay */}
      <div className={`
        absolute inset-0 bg-black/0 group-hover:bg-black/10 
        transition-colors duration-200 pointer-events-none
      `} />
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}
