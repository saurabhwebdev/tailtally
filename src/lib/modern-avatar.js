import { createAvatar } from '@dicebear/core';
import { 
  lorelei,
  loreleiNeutral,
  notionists,
  notionistsNeutral,
  openPeeps,
  personas,
  avataaars,
  avataaarsNeutral,
  funEmoji,
  shapes
} from '@dicebear/collection';

// Modern avatar styles with better visuals
export const MODERN_AVATAR_STYLES = [
  { 
    value: 'lorelei', 
    label: 'Modern',
    description: 'Clean and minimal avatars',
    collection: lorelei,
    emoji: '✨'
  },
  { 
    value: 'notionists', 
    label: 'Illustrated',
    description: 'Hand-drawn style avatars',
    collection: notionists,
    emoji: '🎨'
  },
  { 
    value: 'personas', 
    label: 'Personas',
    description: 'Professional avatars',
    collection: personas,
    emoji: '👔'
  },
  { 
    value: 'openPeeps', 
    label: 'Peeps',
    description: 'Diverse character styles',
    collection: openPeeps,
    emoji: '🌈'
  },
  {
    value: 'avataaarsNeutral',
    label: 'Neutral',
    description: 'Clean cartoon avatars',
    collection: avataaarsNeutral,
    emoji: '😊'
  },
  {
    value: 'funEmoji',
    label: 'Emoji',
    description: 'Fun emoji-style avatars',
    collection: funEmoji,
    emoji: '😄'
  },
  {
    value: 'shapes',
    label: 'Abstract',
    description: 'Geometric shapes',
    collection: shapes,
    emoji: '🔷'
  }
];

// Get user initials for fallback
export function getUserInitials(user) {
  if (!user) return 'U';
  
  const firstName = user.firstName || user.fullName?.split(' ')[0] || '';
  const lastName = user.lastName || user.fullName?.split(' ')[1] || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  } else if (firstName) {
    return firstName.slice(0, 2).toUpperCase();
  } else if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }
  return 'U';
}

// Generate a modern avatar URL/seed
export function generateModernAvatarSeed(user, style = 'lorelei', size = 128) {
  if (!user) return null;
  const seed = user.email || user._id || 'default';
  return `modern:${style}:${seed}:${size}`;
}

// Get avatar URL (checks for existing avatar first)
export function getModernAvatarUrl(user, style = 'lorelei', size = 128) {
  if (!user) return null;
  
  // If user has a custom avatar URL (not a seed format)
  if (user.avatar && !user.avatar.startsWith('modern:') && !user.avatar.startsWith('avatar:')) {
    return user.avatar;
  }
  
  // If user has a saved modern avatar seed, use it
  if (user.avatar && user.avatar.startsWith('modern:')) {
    // Parse the saved avatar to potentially adjust size if needed
    const parts = user.avatar.split(':');
    if (parts.length === 4) {
      const [, savedStyle, savedSeed, ] = parts;
      return `modern:${savedStyle}:${savedSeed}:${size}`;
    }
    return user.avatar;
  }
  
  // Otherwise, generate a default avatar based on user data
  const seed = user.email || user._id || 'default';
  return `modern:${style}:${seed}:${size}`;
}

// Generate avatar data URI from seed
export async function generateModernAvatarDataUri(avatarSeed) {
  if (!avatarSeed || !avatarSeed.startsWith('modern:')) {
    return null;
  }

  const parts = avatarSeed.split(':');
  if (parts.length !== 4) return null;

  const [, styleName, seed, size] = parts;
  
  // Find the style configuration
  const styleConfig = MODERN_AVATAR_STYLES.find(s => s.value === styleName);
  if (!styleConfig) return null;

  let options = {
    seed,
    size: parseInt(size) || 128,
    scale: 100,
  };

  // Style-specific options for better appearance
  switch (styleName) {
    case 'lorelei':
    case 'loreleiNeutral':
      options = {
        ...options,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
        backgroundType: ['gradientLinear'],
        backgroundRotation: [0, 90, 180, 270],
      };
      break;
      
    case 'notionists':
    case 'notionistsNeutral':
      options = {
        ...options,
        backgroundColor: ['ffffff'],
        strokeColor: ['000000'],
      };
      break;
      
    case 'personas':
      options = {
        ...options,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      };
      break;
      
    case 'openPeeps':
      options = {
        ...options,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
        face: ['calm', 'cute', 'smile', 'smileBig', 'smileTeethGap', 'solemn'],
      };
      break;
      
    case 'avataaarsNeutral':
      options = {
        ...options,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
        backgroundType: ['gradientLinear'],
        eyes: ['default', 'happy', 'wink', 'surprised'],
        eyebrows: ['default', 'defaultNatural', 'raised', 'raisedNatural'],
        mouth: ['default', 'smile', 'twinkle'],
        top: [
          'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet',
          'shortCurly', 'shortFlat', 'shortRound', 'shortWaved',
          'theCaesar', 'theCaesarSidePart'
        ],
      };
      break;
      
    case 'funEmoji':
      options = {
        ...options,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
        backgroundType: ['gradientLinear'],
      };
      break;
      
    case 'shapes':
      options = {
        ...options,
        backgroundColor: ['0a5b83', '1c799f', '69d2e7', 'f7f7f7'],
        shape1Color: ['0a5b83', '1c799f', '69d2e7', 'ffffff'],
        shape2Color: ['0a5b83', '1c799f', '69d2e7', 'ffffff'],
        shape3Color: ['0a5b83', '1c799f', '69d2e7', 'ffffff'],
      };
      break;
  }

  try {
    const avatar = createAvatar(styleConfig.collection, options);
    return await avatar.toDataUri();
  } catch (error) {
    console.error('Error generating modern avatar:', error);
    return null;
  }
}

// Generate multiple avatar options with variation
export async function generateModernAvatarOptions(user, style = 'lorelei', count = 6) {
  const avatars = [];
  const baseUser = user || { email: 'user@example.com' };
  
  for (let i = 0; i < count; i++) {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    const userPart = baseUser.email || baseUser._id || 'user';
    const randomSeed = `${userPart}-${timestamp}-${randomNum}-${i}`;
    
    const tempUser = { ...baseUser, email: randomSeed };
    const avatarSeed = generateModernAvatarSeed(tempUser, style, 128);
    
    if (avatarSeed) {
      avatars.push({
        id: i,
        seed: avatarSeed,
        style: style
      });
    }
  }
  
  return avatars;
}

// HTTP API fallback for better performance
export function generateModernAvatarHttpUrl(seed, style = 'lorelei', size = 128) {
  const baseUrl = 'https://api.dicebear.com/9.x';
  
  const params = new URLSearchParams({
    seed: seed,
    size: size,
    scale: 100,
  });
  
  // Add style-specific parameters
  switch (style) {
    case 'lorelei':
    case 'loreleiNeutral':
      params.append('backgroundColor', 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf');
      params.append('backgroundType', 'gradientLinear');
      break;
      
    case 'notionists':
    case 'notionistsNeutral':
      params.append('backgroundColor', 'ffffff');
      break;
      
    case 'personas':
      params.append('backgroundColor', 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf');
      break;
      
    case 'openPeeps':
      params.append('backgroundColor', 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf');
      params.append('face', 'calm,cute,smile,smileBig');
      break;
      
    case 'avataaarsNeutral':
      params.append('backgroundColor', 'b6e3f4,c0aede,d1d4f9');
      params.append('backgroundType', 'gradientLinear');
      params.append('eyes', 'default,happy,wink');
      params.append('mouth', 'default,smile,twinkle');
      break;
  }
  
  // Map style names to API endpoints
  const styleMap = {
    'lorelei': 'lorelei',
    'loreleiNeutral': 'lorelei-neutral',
    'notionists': 'notionists',
    'notionistsNeutral': 'notionists-neutral',
    'openPeeps': 'open-peeps',
    'personas': 'personas',
    'avataaarsNeutral': 'avataaars-neutral',
    'funEmoji': 'fun-emoji',
    'shapes': 'shapes'
  };
  
  const apiStyle = styleMap[style] || style;
  return `${baseUrl}/${apiStyle}/svg?${params.toString()}`;
}

// Export compatibility functions for existing code
export const generateAvatarUrl = generateModernAvatarSeed;
export const getAvatarUrl = getModernAvatarUrl;
export const generateAvatarDataUri = generateModernAvatarDataUri;
export const generateAvatarHttpUrl = generateModernAvatarHttpUrl;
