// Re-export all modern avatar functions for backward compatibility
export * from './modern-avatar';

// Keep the old imports for any legacy code that might still use them
import { createAvatar } from '@dicebear/core';
import { avataaars, initials, pixelArt } from '@dicebear/collection';

/**
 * Generate avatar URL using DiceBear API
 * @param {Object} user - User object
 * @param {string} style - Avatar style ('avataaars', 'initials', 'pixelArt')
 * @param {number} size - Avatar size in pixels
 * @returns {string} Avatar URL or seed string
 */
export function generateAvatarUrl(user, style = 'avataaars', size = 64) {
  if (!user) return null;

  const seed = user.email || user._id || 'default';
  
  // For better performance and smaller URLs, return a seed-based identifier
  // instead of generating the full data URI
  return `avatar:${style}:${seed}:${size}`;
}

/**
 * Get actual avatar URL from seed or existing avatar
 * @param {Object} user - User object
 * @param {string} style - Avatar style
 * @param {number} size - Avatar size
 * @returns {string} Avatar URL
 */
export function getAvatarUrl(user, style = 'avataaars', size = 64) {
  // If user has a custom avatar, use it
  if (user?.avatar) {
    return user.avatar;
  }
  
  // Generate the seed-based identifier
  const seed = user?.email || user?._id || 'default';
  return `avatar:${style}:${seed}:${size}`;
}

/**
 * Generate actual avatar data URI from seed (for display purposes)
 * @param {string} avatarSeed - Avatar seed string
 * @returns {Promise<string>} Data URI
 */
export async function generateAvatarDataUri(avatarSeed) {
  if (!avatarSeed || !avatarSeed.startsWith('avatar:')) {
    return null;
  }

  const parts = avatarSeed.split(':');
  if (parts.length !== 4) return null;

  const [, style, seed, size] = parts;
  
  let collection;
  let options = {};

  switch (style) {
    case 'initials':
      collection = initials;
      options = {
        seed,
        backgroundColor: ['3b82f6', '8b5cf6', 'ef4444', '10b981', 'f59e0b', '6366f1'],
        fontSize: 50,
        fontColor: ['ffffff'],
      };
      break;
    case 'pixelArt':
      collection = pixelArt;
      options = {
        seed,
        backgroundColor: ['3b82f6', '8b5cf6', 'ef4444', '10b981', 'f59e0b', '6366f1', 'ec4899', '06b6d4'],
        pixelSize: 8,
        top: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40'],
        topChance: 100,
        accessories: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40'],
        accessoriesChance: 50,
        clothing: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40'],
        clothingChance: 80,
        eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40'],
        mouth: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30', 'variant31', 'variant32', 'variant33', 'variant34', 'variant35', 'variant36', 'variant37', 'variant38', 'variant39', 'variant40'],
        skinColor: ['ffdbac', 'f1c27d', 'e0ac69', 'c68642', '8d5524', '5c3836', '2d1810'],
      };
      break;
    case 'avataaars':
    default:
      collection = avataaars;
      options = {
        seed,
        backgroundColor: ['3b82f6', '8b5cf6', 'ef4444', '10b981', 'f59e0b', '6366f1', 'ec4899', '06b6d4', '84cc16', 'f97316'],
        // Force prominent hair styles that are clearly visible
        top: [
          'bigHair', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froAndBand',
          'longHairBigHair', 'longHairBob', 'longHairBun', 'longHairCurly', 'longHairCurvy',
          'longHairDreads', 'longHairFrida', 'longHairFro', 'longHairFroBand',
          'longHairNotTooLong', 'longHairShavedSides', 'longHairMiaWallace',
          'longHairStraight', 'longHairStraight2', 'longHairStraightStrand'
        ],
        topChance: 100, // Always include hair
        // Use darker, more visible hair colors
        hairColor: ['black', 'brown', 'brownDark', 'auburn', 'red'],
        // Force open eyes with clear features
        eyes: ['default', 'happy', 'surprised', 'wink', 'winkWacky'],
        // Add prominent eyebrows
        eyebrows: ['default', 'defaultNatural', 'raised', 'raisedNatural'],
        // Use expressive mouths
        mouth: ['default', 'smile', 'serious', 'twinkle'],
        // Add facial hair for more variety
        facialHair: ['blank', 'beardMedium', 'beardLight', 'beardMagestic'],
        facialHairChance: 30,
        facialHairColor: ['black', 'brown', 'brownDark', 'auburn'],
        // Minimal accessories to show more hair
        accessories: ['blank'],
        accessoriesChance: 0, // No accessories to show hair clearly
        // Clothing
        clothing: ['blazerShirt', 'blazerSweater', 'collarSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'],
        clothingColor: ['black', 'blue01', 'blue02', 'blue03', 'gray01', 'gray02', 'heather', 'pastelBlue', 'pastelGreen', 'pastelOrange', 'pastelRed', 'pastelYellow', 'pink', 'red', 'white'],
        // Skin colors
        skinColor: ['ffdbac', 'f1c27d', 'e0ac69', 'c68642', '8d5524', '5c3836', '2d1810'],
      };
      break;
  }

  try {
    const avatar = createAvatar(collection, options);
    // Use toDataUri() which returns a Promise according to the documentation
    return await avatar.toDataUri();
  } catch (error) {
    console.error('Error generating avatar:', error);
    return null;
  }
}

/**
 * Generate avatar using DiceBear HTTP API (alternative approach)
 * @param {string} seed - Avatar seed
 * @param {string} style - Avatar style
 * @param {number} size - Avatar size
 * @returns {string} Avatar URL
 */
export function generateAvatarHttpUrl(seed, style = 'avataaars', size = 64) {
  const baseUrl = 'https://api.dicebear.com/9.x';
  
  // Force hair and facial features using URL parameters
  const params = new URLSearchParams({
    seed: seed,
    size: size,
    backgroundColor: '3b82f6',
    // Force prominent hair styles
    top: ['bigHair', 'bob', 'bun', 'curly', 'dreads', 'fro', 'longHairBigHair', 'longHairBob', 'longHairCurly'],
    // Force dark hair colors for visibility
    hairColor: ['black', 'brown', 'brownDark'],
    // Force open eyes
    eyes: ['default', 'happy', 'surprised'],
    // Force eyebrows
    eyebrows: ['default', 'defaultNatural'],
    // Force expressive mouth
    mouth: ['default', 'smile'],
    // Add facial hair
    facialHair: ['blank', 'beardMedium', 'beardLight'],
    facialHairColor: ['black', 'brown'],
    // No accessories to show hair clearly
    accessories: ['blank']
  });
  
  return `${baseUrl}/${style}/svg?${params.toString()}`;
}

/**
 * Test function to verify avatar generation is working
 * @param {string} seed - Test seed
 * @returns {Promise<string>} Test avatar data URI
 */
export async function testAvatarGeneration(seed = 'test-seed-123') {
  try {
    const collection = avataaars;
    const options = {
      seed,
      backgroundColor: ['3b82f6'],
      // Force prominent hair
      top: ['bigHair', 'bob', 'bun', 'curly'],
      topChance: 100,
      hairColor: ['black', 'brown'],
      // Force open eyes
      eyes: ['default', 'happy'],
      eyebrows: ['default'],
      mouth: ['default', 'smile'],
      skinColor: ['ffdbac', 'f1c27d'],
    };
    
    const avatar = createAvatar(collection, options);
    const dataUri = await avatar.toDataUri();
    console.log('Test avatar generated successfully:', dataUri.substring(0, 50) + '...');
    return dataUri;
  } catch (error) {
    console.error('Test avatar generation failed:', error);
    return null;
  }
}

/**
 * Get user initials for fallback
 * @param {Object} user - User object
 * @returns {string} User initials
 */
export function getUserInitials(user) {
  if (!user) return 'U';
  
  if (user.firstName && user.lastName) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }
  
  if (user.fullName) {
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return user.fullName.charAt(0).toUpperCase();
  }
  
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
}