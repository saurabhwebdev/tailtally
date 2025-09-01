// Owner avatar generation based on gender
// Using DiceBear API with different styles for different genders

const AVATAR_STYLES = {
  male: 'adventurer',
  female: 'adventurer',
  other: 'bottts',
  unspecified: 'initials'
};

// Color palettes for different genders
const AVATAR_COLORS = {
  male: ['1e40af', '1e3a8a', '1e293b', '334155', '475569'],
  female: ['be123c', 'be185d', 'a21caf', '7e22ce', '6d28d9'],
  other: ['0891b2', '0e7490', '047857', '059669', '16a34a'],
  unspecified: ['64748b', '475569', '334155', '1e293b', '0f172a']
};

/**
 * Get the avatar style for a given gender
 * @param {string} gender - The owner's gender
 * @returns {string} The avatar style to use
 */
export function getAvatarStyle(gender) {
  const normalizedGender = (gender || 'unspecified').toLowerCase();
  return AVATAR_STYLES[normalizedGender] || AVATAR_STYLES.unspecified;
}

/**
 * Get background colors for a given gender
 * @param {string} gender - The owner's gender
 * @returns {string[]} Array of color codes
 */
export function getAvatarColors(gender) {
  const normalizedGender = (gender || 'unspecified').toLowerCase();
  return AVATAR_COLORS[normalizedGender] || AVATAR_COLORS.unspecified;
}

/**
 * Generate avatar URL for an owner
 * @param {Object} owner - The owner object
 * @param {string} owner.firstName - Owner's first name
 * @param {string} owner.lastName - Owner's last name
 * @param {string} owner.gender - Owner's gender
 * @param {string} owner._id - Owner's ID
 * @returns {string} The avatar URL
 */
export function generateOwnerAvatarUrl(owner) {
  const style = getAvatarStyle(owner.gender);
  const colors = getAvatarColors(owner.gender);
  const seed = `${owner.firstName || 'Owner'}-${owner.lastName || ''}-${owner._id}`;
  
  // For initials style (unspecified gender), use the name
  if (style === 'initials') {
    const initials = `${owner.firstName?.charAt(0) || 'O'}${owner.lastName?.charAt(0) || ''}`;
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(initials)}&backgroundColor=${colors.join(',')}&fontSize=42`;
  }
  
  // For other styles
  const backgroundColor = colors.join(',');
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;
}

/**
 * Get a readable label for gender
 * @param {string} gender - The gender value
 * @returns {string} Readable gender label
 */
export function getGenderLabel(gender) {
  const genderMap = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    unspecified: 'Not Specified'
  };
  
  return genderMap[gender?.toLowerCase()] || 'Not Specified';
}

/**
 * Get a color scheme for gender badges
 * @param {string} gender - The gender value
 * @returns {string} Tailwind color classes
 */
export function getGenderBadgeColor(gender) {
  const colorMap = {
    male: 'bg-blue-100 text-blue-700',
    female: 'bg-pink-100 text-pink-700',
    other: 'bg-green-100 text-green-700',
    unspecified: 'bg-gray-100 text-gray-700'
  };
  
  return colorMap[gender?.toLowerCase()] || colorMap.unspecified;
}
