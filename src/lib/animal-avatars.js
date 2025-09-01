// Custom animal avatar system using SVG patterns and animal silhouettes

// Animal SVG templates
const animalSvgTemplates = {
  dog: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Dog silhouette -->
        <path d="M-20,-15 C-25,-20 -25,-25 -20,-25 C-15,-25 -15,-20 -10,-18 L-5,-15 L5,-15 L10,-18 C15,-20 15,-25 20,-25 C25,-25 25,-20 20,-15 L15,-10 L15,5 C15,15 10,20 0,20 C-10,20 -15,15 -15,5 L-15,-10 Z" 
              fill="#4682B4" stroke="#2C5282" stroke-width="1"/>
        <!-- Dog ears -->
        <path d="M-20,-15 C-22,-10 -25,-5 -25,0 C-25,5 -22,5 -20,0 C-18,-5 -15,-10 -15,-15" 
              fill="#5A91C4"/>
        <path d="M20,-15 C22,-10 25,-5 25,0 C25,5 22,5 20,0 C18,-5 15,-10 15,-15" 
              fill="#5A91C4"/>
        <!-- Dog nose -->
        <circle cx="0" cy="-5" r="3" fill="#2C5282"/>
        <!-- Dog eyes -->
        <circle cx="-8" cy="-10" r="2" fill="#1A365D"/>
        <circle cx="8" cy="-10" r="2" fill="#1A365D"/>
      </g>
    </svg>
  `,
  
  cat: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Cat head -->
        <circle cx="0" cy="0" r="20" fill="#9370DB" stroke="#7B5299" stroke-width="1"/>
        <!-- Cat ears -->
        <path d="M-20,-10 L-15,-25 L-5,-15" fill="#B19CD9"/>
        <path d="M20,-10 L15,-25 L5,-15" fill="#B19CD9"/>
        <!-- Inner ears -->
        <path d="M-15,-15 L-12,-20 L-9,-15" fill="#FFB6C1"/>
        <path d="M15,-15 L12,-20 L9,-15" fill="#FFB6C1"/>
        <!-- Cat eyes -->
        <ellipse cx="-8" cy="-5" rx="3" ry="5" fill="#4B0082"/>
        <ellipse cx="8" cy="-5" rx="3" ry="5" fill="#4B0082"/>
        <!-- Cat nose -->
        <path d="M0,0 L-2,3 L0,4 L2,3 Z" fill="#FF69B4"/>
        <!-- Cat whiskers -->
        <line x1="-20" y1="0" x2="-10" y2="-2" stroke="#7B5299" stroke-width="0.5"/>
        <line x1="-20" y1="5" x2="-10" y2="3" stroke="#7B5299" stroke-width="0.5"/>
        <line x1="20" y1="0" x2="10" y2="-2" stroke="#7B5299" stroke-width="0.5"/>
        <line x1="20" y1="5" x2="10" y2="3" stroke="#7B5299" stroke-width="0.5"/>
      </g>
    </svg>
  `,
  
  bird: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Bird body -->
        <ellipse cx="0" cy="5" rx="15" ry="20" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
        <!-- Bird head -->
        <circle cx="0" cy="-10" r="12" fill="#FFD700"/>
        <!-- Bird beak -->
        <path d="M-12,-10 L-18,-10 L-12,-5 Z" fill="#FF6347"/>
        <!-- Bird eye -->
        <circle cx="-5" cy="-10" r="3" fill="white"/>
        <circle cx="-5" cy="-10" r="2" fill="black"/>
        <!-- Bird wing -->
        <path d="M5,0 C15,0 20,5 15,15 C10,10 5,5 5,0" fill="#FFA500"/>
        <!-- Bird tail -->
        <path d="M0,20 L-5,25 L0,23 L5,25 Z" fill="#FFA500"/>
      </g>
    </svg>
  `,
  
  fish: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Fish body -->
        <ellipse cx="0" cy="0" rx="25" ry="15" fill="#00CED1" stroke="#008B8B" stroke-width="1"/>
        <!-- Fish tail -->
        <path d="M20,0 L30,-10 L30,10 Z" fill="#20B2AA"/>
        <!-- Fish fin -->
        <path d="M0,-15 L5,-20 L10,-15" fill="#20B2AA"/>
        <path d="M0,15 L5,20 L10,15" fill="#20B2AA"/>
        <!-- Fish eye -->
        <circle cx="-15" cy="0" r="4" fill="white"/>
        <circle cx="-15" cy="0" r="2" fill="black"/>
        <!-- Fish scales pattern -->
        <circle cx="-5" cy="0" r="3" fill="#48D1CC" opacity="0.5"/>
        <circle cx="5" cy="0" r="3" fill="#48D1CC" opacity="0.5"/>
        <circle cx="0" cy="-5" r="3" fill="#48D1CC" opacity="0.5"/>
        <circle cx="0" cy="5" r="3" fill="#48D1CC" opacity="0.5"/>
      </g>
    </svg>
  `,
  
  rabbit: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Rabbit body -->
        <ellipse cx="0" cy="10" rx="18" ry="15" fill="#90EE90" stroke="#228B22" stroke-width="1"/>
        <!-- Rabbit head -->
        <circle cx="0" cy="-5" r="15" fill="#90EE90"/>
        <!-- Rabbit ears -->
        <ellipse cx="-8" cy="-20" rx="5" ry="15" fill="#90EE90" stroke="#228B22" stroke-width="1"/>
        <ellipse cx="8" cy="-20" rx="5" ry="15" fill="#90EE90" stroke="#228B22" stroke-width="1"/>
        <!-- Inner ears -->
        <ellipse cx="-8" cy="-20" rx="2" ry="10" fill="#FFB6C1"/>
        <ellipse cx="8" cy="-20" rx="2" ry="10" fill="#FFB6C1"/>
        <!-- Rabbit eyes -->
        <circle cx="-6" cy="-5" r="2" fill="black"/>
        <circle cx="6" cy="-5" r="2" fill="black"/>
        <!-- Rabbit nose -->
        <circle cx="0" cy="0" r="2" fill="#FF69B4"/>
        <!-- Rabbit whiskers -->
        <line x1="-15" y1="0" x2="-8" y2="-2" stroke="#228B22" stroke-width="0.5"/>
        <line x1="15" y1="0" x2="8" y2="-2" stroke="#228B22" stroke-width="0.5"/>
      </g>
    </svg>
  `,
  
  hamster: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Hamster body -->
        <circle cx="0" cy="5" r="20" fill="#FFA07A" stroke="#FF7F50" stroke-width="1"/>
        <!-- Hamster head -->
        <circle cx="0" cy="-10" r="15" fill="#FFA07A"/>
        <!-- Hamster ears -->
        <circle cx="-10" cy="-20" r="6" fill="#FFB6A3"/>
        <circle cx="10" cy="-20" r="6" fill="#FFB6A3"/>
        <!-- Hamster cheeks (pouches) -->
        <ellipse cx="-12" cy="-5" rx="8" ry="6" fill="#FFDAB9"/>
        <ellipse cx="12" cy="-5" rx="8" ry="6" fill="#FFDAB9"/>
        <!-- Hamster eyes -->
        <circle cx="-5" cy="-10" r="3" fill="black"/>
        <circle cx="5" cy="-10" r="3" fill="black"/>
        <circle cx="-4" cy="-11" r="1" fill="white"/>
        <circle cx="6" cy="-11" r="1" fill="white"/>
        <!-- Hamster nose -->
        <circle cx="0" cy="-5" r="2" fill="#D2691E"/>
        <!-- Hamster paws -->
        <ellipse cx="-10" cy="15" rx="4" ry="6" fill="#FFB6A3"/>
        <ellipse cx="10" cy="15" rx="4" ry="6" fill="#FFB6A3"/>
      </g>
    </svg>
  `,
  
  other: (color) => `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="${color}" opacity="0.2"/>
      <g transform="translate(50, 50)">
        <!-- Generic paw print -->
        <ellipse cx="0" cy="-10" rx="8" ry="10" fill="#808080"/>
        <ellipse cx="-12" cy="-20" rx="6" ry="8" fill="#808080"/>
        <ellipse cx="12" cy="-20" rx="6" ry="8" fill="#808080"/>
        <ellipse cx="-8" cy="-25" rx="5" ry="6" fill="#808080"/>
        <ellipse cx="8" cy="-25" rx="5" ry="6" fill="#808080"/>
        <!-- Paw pads -->
        <ellipse cx="0" cy="-10" rx="5" ry="6" fill="#696969"/>
        <ellipse cx="-12" cy="-20" rx="3" ry="4" fill="#696969"/>
        <ellipse cx="12" cy="-20" rx="3" ry="4" fill="#696969"/>
        <ellipse cx="-8" cy="-25" rx="2.5" ry="3" fill="#696969"/>
        <ellipse cx="8" cy="-25" rx="2.5" ry="3" fill="#696969"/>
      </g>
    </svg>
  `
};

// Generate a color based on pet name for variety
function generatePetColor(petName, species) {
  const colors = {
    dog: ['#87CEEB', '#4682B4', '#6495ED', '#1E90FF', '#00BFFF'],
    cat: ['#DDA0DD', '#BA55D3', '#9370DB', '#8B7AB8', '#9966CC'],
    bird: ['#FFD700', '#FFA500', '#FF8C00', '#FFB347', '#FFCC5C'],
    fish: ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0', '#00CED1'],
    rabbit: ['#90EE90', '#32CD32', '#98FB98', '#00FF00', '#7CFC00'],
    hamster: ['#FFA07A', '#FF7F50', '#FF6347', '#FA8072', '#E9967A'],
    other: ['#D3D3D3', '#A9A9A9', '#808080', '#C0C0C0', '#B0B0B0']
  };
  
  const speciesColors = colors[species] || colors.other;
  const hash = petName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return speciesColors[hash % speciesColors.length];
}

// Generate SVG data URL for the pet avatar
export function generatePetAvatarDataUrl(pet, size = 100) {
  if (!pet) return null;
  
  const species = pet.species?.toLowerCase() || 'other';
  const backgroundColor = generatePetColor(pet.name || 'Unknown', species);
  
  // Get the appropriate SVG template
  const svgTemplate = animalSvgTemplates[species] || animalSvgTemplates.other;
  const svgString = svgTemplate(backgroundColor);
  
  // Convert to base64 data URL
  const base64 = btoa(unescape(encodeURIComponent(svgString)));
  return `data:image/svg+xml;base64,${base64}`;
}

// Alternative: Generate using an API service (for server-side rendering)
export function generatePetAvatarUrl(pet, size = 40) {
  if (!pet) return null;
  
  // For client-side, use the data URL approach
  if (typeof window !== 'undefined') {
    return generatePetAvatarDataUrl(pet, size);
  }
  
  // For server-side or as fallback, use a placeholder service
  const species = pet.species?.toLowerCase() || 'other';
  const color = generatePetColor(pet.name || 'Unknown', species).replace('#', '');
  const emoji = {
    dog: '🐕',
    cat: '🐱',
    bird: '🐦',
    fish: '🐠',
    rabbit: '🐰',
    hamster: '🐹',
    other: '🐾'
  }[species] || '🐾';
  
  // Use placeholder service as fallback
  return `https://via.placeholder.com/${size}x${size}/${color}/FFFFFF?text=${encodeURIComponent(emoji)}`;
}

// Get species color for consistent theming
export function getPetAvatarColor(pet) {
  const species = pet?.species?.toLowerCase() || 'other';
  return generatePetColor(pet?.name || 'Unknown', species);
}

export default {
  generatePetAvatarUrl,
  generatePetAvatarDataUrl,
  getPetAvatarColor
};
