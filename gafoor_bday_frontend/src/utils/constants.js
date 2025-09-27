// CLUES are now fetched from the backend API to avoid duplication
// The CLUES array has been moved to the backend as the single source of truth

// Location array for map pins and links
export const LOCATION_ARRAY = {
  1: { coordinates: [42.3515, -71.0795], link: "https://maps.google.com/?q=trader+joes+boylston" },
  2: { coordinates: [42.3502, -71.0759], link: "https://maps.google.com/?q=nike+store+boston" },
  3: { coordinates: [42.3467, -71.0707], link: "https://maps.google.com/?q=jp+licks+boston" },
  4: { coordinates: [42.3501, -71.0764], link: "https://maps.google.com/?q=tj+maxx+boston" },
  5: { coordinates: [42.3014, -71.1249], link: "https://maps.google.com/?q=arnold+arboretum" },
  6: { coordinates: [42.3601, -71.0589], link: "https://maps.google.com/?q=charles+river+esplanade" },
  7: { coordinates: [42.3601, -71.0589], link: "https://maps.google.com/?q=charles+river+esplanade" }
};

// F1 Theme Colors
export const THEME_COLORS = {
  primary: '#e10600', // F1 Red
  secondary: '#000000', // Black
  accent: '#ffffff', // White
  success: '#00ff00', // Green
  warning: '#ffaa00', // Orange
  error: '#ff0000', // Red
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#333333',
  textLight: '#666666'
};

// Snapchat Filter Positions
export const FILTER_POSITIONS = {
  top: 'top-4 left-1/2 transform -translate-x-1/2',
  bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
  center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  corner: 'top-4 right-4'
};

// Game States
export const GAME_STATES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// User Roles
export const USER_ROLES = {
  PLAYER: 'player',
  ADMIN: 'admin'
};
