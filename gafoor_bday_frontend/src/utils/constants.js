// Game clues configuration
export const CLUES = [
  {
    id: 1,
    title: "Pit Stop Word Search",
    description: "Find words that reveal where champions fuel their drive",
    component: "WordSearch",
    words: ["TRADER", "JOES", "BOYLSTON", "CHIPS", "JERK"],
    answers: ["trader joes", "trader joe's"],
    location: { lat: 42.3515, lng: -71.0795, name: "Trader Joe's Boylston" },
    bonusTask: "Do 55 jumping jacks (Carlos's number)",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 2,
    title: "Smooth Operator Shopping",
    description: "Items whose first letters spell your destination",
    component: "ShoppingList",
    items: ["Dried mangoes", "Unsweetened chips", "Nuts", "Kale chips", "Italian water", "Naan crackers"],
    answers: ["dunkin", "dunkin donuts"],
    location: { lat: 42.3501, lng: -71.0764, name: "Dunkin'" },
    bonusTask: "Text 'Smooth Operator 🏎️' to group chat",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 4,
    title: "🍦 Sweet Victory",
    description: "Enjoy your salted caramel ice cream at JP Licks! While you eat, solve these puzzles to find your next destination.",
    component: "JigsawPuzzle",
    imageUrl: "/images/smooth-operator.jpg",
    answers: ["jp licks", "j.p. licks"],
    location: { lat: 42.3467, lng: -71.0707, name: "JP Licks" },
    bonusTask: "Order a birthday flavor",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 5,
    title: "👟 Racing Shoes",
    description: "Head to NIKE on Newbury! Check the Air Max section, box 55 (like Carlos's number)!",
    component: null,
    answers: ["nike", "nike store"],
    location: { lat: 42.3502, lng: -71.0759, name: "Nike Store" },
    bonusTask: "Take a victory podium pose with your new miniature 'shoes'!",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 6,
    title: "🦆 Duck Podium",
    description: "Great job finding the Public Garden! Recreate Carlos's podium celebration with the famous Make Way for Ducklings statues!",
    component: null,
    answers: ["public garden", "boston public garden"],
    location: { lat: 42.3541, lng: -71.0655, name: "Boston Public Garden" },
    bonusTask: "Record a 10-second victory dance with the ducks!",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 7,
    title: "🎨 Artistic Finish Line",
    description: "Welcome to Arnold Arboretum! Where trees race to the sky, create your masterpiece!",
    component: null,
    answers: ["arnold arboretum", "arboretum"],
    location: { lat: 42.3014, lng: -71.1249, name: "Arnold Arboretum" },
    bonusTask: "Make a birthday wish and paint your favorite moment!",
    points: { base: 100, bonus: 50 }
  },
  {
    id: 8,
    title: "Championship Finale",
    description: "The final challenge - complete the word search",
    component: "WordSearch",
    words: ["CHARLES", "RIVER", "SUNSET", "CHAMPION", "BIRTHDAY"],
    answers: ["charles river", "charles river esplanade"],
    location: { lat: 42.3601, lng: -71.0589, name: "Charles River" },
    bonusTask: "Watch the sunset and celebrate!",
    points: { base: 200, bonus: 100 }
  }
];

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
