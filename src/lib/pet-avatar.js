// Animal avatar services that provide actual animal avatars
const ANIMAL_AVATAR_SERVICES = {
  // Pet Avatar Service - provides various animal avatars
  petAvatar: {
    baseUrl: 'https://pet-avatars.com',
    species: {
      dog: 'dog',
      cat: 'cat',
      bird: 'bird',
      fish: 'fish',
      rabbit: 'rabbit',
      hamster: 'hamster',
      other: 'paw'
    }
  },
  // Fallback: Use placeholder service with animal-themed colors
  placeholder: {
    baseUrl: 'https://via.placeholder.com',
    getUrl: (size, color, text) => `${this.baseUrl}/${size}/${color}/FFFFFF?text=${text}`
  }
};

// Get the appropriate avatar style for a pet species
export function getPetAvatarStyle(species) {
  return species?.toLowerCase() || 'other';
}

// Generate a pet-specific avatar URL using various strategies
export function generatePetAvatarUrl(pet, size = 40) {
  if (!pet) return null;
  
  const species = pet.species?.toLowerCase() || 'other';
  
  // Strategy 1: Use RoboHash with set4 (cats) or set3 (robots that look like animals)
  // RoboHash is a free service that generates unique avatars
  if (species === 'cat') {
    // RoboHash set4 generates cat avatars
    return `https://robohash.org/${pet.name}-${pet._id}.png?set=set4&size=${size}x${size}`;
  }
  
  // Strategy 2: Use animal-specific placeholder with species emoji
  const speciesEmoji = {
    dog: '🐕',
    cat: '🐱', 
    bird: '🐦',
    fish: '🐠',
    rabbit: '🐰',
    hamster: '🐹',
    other: '🐾'
  }[species] || '🐾';
  
  // Strategy 3: Use DiceBear with animal-friendly styles
  // Using 'thumbs' collection which has cute, simple avatars
  if (species === 'dog' || species === 'rabbit' || species === 'hamster') {
    return `https://api.dicebear.com/9.x/thumbs/svg?seed=${pet.name}-${pet._id}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&shapeColor=0a5b83,1c799f,69d2e7`;
  }
  
  // Strategy 4: Use Adorable Avatars (now served by DiceBear) for other animals
  // These are cute, colorful avatars that work well for pets
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${pet.name}-${pet._id}&size=${size}&backgroundColor=${speciesColorPalettes[species]?.[0] || 'b6e3f4'}`;
}

// Species-specific color palettes for avatar backgrounds
export const speciesColorPalettes = {
  dog: ['87CEEB', '4682B4', '6495ED'], // Blue tones
  cat: ['DDA0DD', 'BA55D3', '9370DB'], // Purple tones
  bird: ['FFD700', 'FFA500', 'FF6347'], // Yellow/orange tones
  fish: ['00CED1', '20B2AA', '48D1CC'], // Cyan tones
  rabbit: ['90EE90', '32CD32', '228B22'], // Green tones
  hamster: ['FFA07A', 'FF7F50', 'FF6347'], // Orange tones
  other: ['D3D3D3', 'A9A9A9', '808080'] // Gray tones
};

export default {
  getPetAvatarStyle,
  generatePetAvatarUrl,
  speciesColorPalettes
};
