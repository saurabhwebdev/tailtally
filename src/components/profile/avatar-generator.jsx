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
  Shuffle, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Palette,
  User,
  Check
} from 'lucide-react';
import { generateAvatarUrl, getUserInitials, generateAvatarDataUri, testAvatarGeneration, generateAvatarHttpUrl } from '@/lib/avatar';

const AVATAR_STYLES = [
  { 
    value: 'avataaars', 
    label: 'Avataaars', 
    description: 'Fun cartoon-style avatars',
    emoji: '😊'
  },
  { 
    value: 'pixelArt', 
    label: 'Pixel Art', 
    description: '8-bit retro style',
    emoji: '🎮'
  },
  { 
    value: 'initials', 
    label: 'Initials', 
    description: 'Simple letter-based',
    emoji: '✨'
  }
];

export default function AvatarGenerator({ user, isOpen, onClose, onSave }) {
  const [currentAvatars, setCurrentAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Generate multiple avatar options
  const generateAvatars = async () => {
    setIsGenerating(true);
    const avatars = [];
    
    // Generate 6 different avatars with better seed generation
    for (let i = 0; i < 6; i++) {
      // Create more diverse seeds for better avatar variety
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000000);
      const userPart = user.email || user._id || 'user';
      const randomSeed = `${userPart}-${timestamp}-${randomNum}-${i}`;
      
      const tempUser = { ...user, email: randomSeed };
      const avatarSeed = generateAvatarUrl(tempUser, selectedStyle, 32);
      
      if (avatarSeed) {
        avatars.push({
          id: i,
          seed: avatarSeed,
          style: selectedStyle
        });
      }
    }
    
    // Debug: Log the first avatar to check if it's generating correctly
    if (avatars.length > 0) {
      console.log('Generated avatar seed:', avatars[0].seed);
      try {
        const testDataUri = await generateAvatarDataUri(avatars[0].seed);
        console.log('Avatar data URI length:', testDataUri ? testDataUri.length : 'null');
      } catch (error) {
        console.error('Debug avatar generation failed:', error);
      }
    }
    
    setCurrentAvatars(avatars);
    setSelectedAvatar(avatars[0] || null);
    setIsGenerating(false);
  };

  // Generate avatars when style changes
  useEffect(() => {
    if (isOpen) {
      generateAvatars();
    }
  }, [selectedStyle, isOpen]);

  // Test avatar generation on component mount
  useEffect(() => {
    // Test the avatar generation to ensure it's working
    const testAvatar = async () => {
      const testResult = await testAvatarGeneration('test-user-123');
      if (testResult) {
        console.log('✅ Avatar generation test passed');
      } else {
        console.error('❌ Avatar generation test failed');
      }
    };
    testAvatar();
  }, []);

  // Handle saving selected avatar
  const handleSave = async () => {
    if (!selectedAvatar) return;
    
    // Check if avatar seed is too long (should be very short now)
    if (selectedAvatar.seed.length > 200) {
      alert('Avatar is too large. Please generate a new one.');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(selectedAvatar.seed);
      onClose();
    } catch (error) {
      console.error('Failed to save avatar:', error);
      // Show user-friendly error message
      if (error.message?.includes('Validation failed') || error.message?.includes('too long') || error.message?.includes('5000 characters')) {
        alert('Avatar is too large. Please generate a new one with a smaller size.');
      } else {
        alert('Failed to save avatar. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to current user avatar
  const handleReset = () => {
    setSelectedAvatar(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Choose Your Avatar
          </DialogTitle>
          <DialogDescription>
            Select a style and pick your favorite avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Style Selection */}
          <div className="flex gap-2">
            {AVATAR_STYLES.map((style) => (
              <Button
                key={style.value}
                variant={selectedStyle === style.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style.value)}
                className="flex items-center gap-2"
              >
                <span className="text-lg">{style.emoji}</span>
                {style.label}
              </Button>
            ))}
          </div>

          {/* Avatar Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Click to select</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateAvatars}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                <Shuffle className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'New'}
              </Button>
            </div>

            {isGenerating ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {currentAvatars.map((avatar) => (
                  <AvatarDisplay
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
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!selectedAvatar || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Separate component for avatar display with proper data URI generation
function AvatarDisplay({ avatar, isSelected, onSelect, user }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateAvatar = async () => {
      if (avatar?.seed) {
        setIsLoading(true);
        
        try {
          // Try the local generation first
          let dataUri = await generateAvatarDataUri(avatar.seed);
          
          // If local generation fails or produces minimal features, use HTTP API
          if (!dataUri || dataUri.length < 1000) {
            const parts = avatar.seed.split(':');
            if (parts.length === 4) {
              const [, style, seed, size] = parts;
              const httpUrl = generateAvatarHttpUrl(seed, style, parseInt(size));
              console.log('Using HTTP API fallback:', httpUrl);
              setImageUrl(httpUrl);
            } else {
              setImageUrl(dataUri);
            }
          } else {
            setImageUrl(dataUri);
          }
        } catch (error) {
          console.error('Error generating avatar:', error);
          // Fallback to HTTP API
          const parts = avatar.seed.split(':');
          if (parts.length === 4) {
            const [, style, seed, size] = parts;
            const httpUrl = generateAvatarHttpUrl(seed, style, parseInt(size));
            setImageUrl(httpUrl);
          }
        }
        
        setIsLoading(false);
      }
    };

    generateAvatar();
  }, [avatar?.seed]);

  return (
    <div
      className={`relative cursor-pointer transition-all hover:scale-105 rounded-lg p-2 ${
        isSelected
          ? 'ring-2 ring-primary bg-primary/5'
          : 'hover:bg-accent/50'
      }`}
      onClick={onSelect}
    >
      <Avatar className="w-full h-full">
        {isLoading ? (
          <div className="w-full h-full bg-muted animate-pulse rounded-full" />
        ) : (
          <AvatarImage src={imageUrl} />
        )}
        <AvatarFallback>
          {getUserInitials(user)}
        </AvatarFallback>
      </Avatar>
      {isSelected && (
        <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
}
