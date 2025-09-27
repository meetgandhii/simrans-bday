// Game clues configuration - NEW MEGA UPDATE!
export const CLUES = [
  {
    id: 1,
    title: "Step 1: Trader Joe's Adventure",
    description: "Complete 3 games to unlock the first location!",
    games: [
      {
        id: 1,
        title: "Word Search Challenge",
        component: "WordSearch",
        words: ["TRADER", "JOES", "BOYLSTON", "CHIPS", "JERK"],
        points: 100
      },
      {
        id: 2,
        title: "Quick Quiz (30 seconds)",
        component: "QuickQuiz",
        questions: [
          { question: "What is Carlos Sainz's number?", options: ["55", "16", "3", "77"], correct: 0 },
          { question: "Which team does Carlos drive for?", options: ["Ferrari", "Red Bull", "Mercedes", "McLaren"], correct: 0 },
          { question: "What is the maximum speed in F1?", options: ["200 mph", "220 mph", "240 mph", "260 mph"], correct: 2 },
          { question: "How many races in a F1 season?", options: ["20", "22", "24", "26"], correct: 2 },
          { question: "What does DRS stand for?", options: ["Drag Reduction System", "Downforce Reduction System", "Drive Reduction System", "Draft Reduction System"], correct: 0 }
        ],
        timeLimit: 30,
        requiredCorrect: 3,
        points: 100
      },
      {
        id: 3,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "What kinda hoe you like to be?",
        points: 100
      }
    ],
    finalAnswer: "trader joes",
    location: { lat: 42.3515, lng: -71.0795, name: "Trader Joe's Boylston" },
    bonusTask: "Do 55 jumping jacks (Carlos's number)",
    points: { bonus: 50 }
  },
  {
    id: 2,
    title: "Step 2: Nike Discovery",
    description: "Complete 2 games to unlock the Nike location!",
    games: [
      {
        id: 1,
        title: "Image Guessing",
        component: "ImageGuess",
        imageUrl: "/images/nike.png",
        question: "What's common in this image?",
        points: 100
      },
      {
        id: 2,
        title: "N.I.K.E. Shopping List",
        component: "ShoppingList",
        items: ["Nuts", "Italian water", "Kale chips", "Energy bars"],
        points: 100
      }
    ],
    finalAnswer: "nike outlet",
    location: { lat: 42.3502, lng: -71.0759, name: "Nike Store" },
    bonusTask: "Take a victory lap around the store",
    points: { bonus: 50 }
  },
  {
    id: 3,
    title: "Step 3: JP Licks Mystery",
    description: "Complete 2 challenges to unlock JP Licks!",
    games: [
      {
        id: 1,
        title: "Video Guessing",
        component: "VideoGuess",
        videoUrl: "/images/reel.mp4",
        question: "Guess the place/theme from this reel",
        points: 100
      },
      {
        id: 2,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "mai hu veeru tu hAi JAI\nmai chahu aditi tujhe mil jaye apna JAI \nye surya ke Kiran mai phigal jaye ice bhi \nmai chahu tu kashmir jaa kar khayie ye bhi \nye next location mai enter karne se pehle chillana Ambe maate ki …..",
        points: 100
      }
    ],
    finalAnswer: "jp licks",
    location: { lat: 42.3467, lng: -71.0707, name: "JP Licks" },
    bonusTask: "Order a birthday flavor",
    points: { bonus: 50 }
  },
  {
    id: 4,
    title: "Step 4: TJ Maxx Adventure",
    description: "Complete 2 games to unlock TJ Maxx!",
    games: [
      {
        id: 1,
        title: "Wordle Challenge",
        component: "Wordle",
        answer: "TJMAX",
        points: 100
      },
      {
        id: 2,
        title: "Connections Game",
        component: "Connections",
        categories: ["TJ Maxx Items", "Categories", "Placeholder", "Placeholder"],
        points: 100
      }
    ],
    finalAnswer: "tj maxx",
    location: { lat: 42.3501, lng: -71.0764, name: "TJ Maxx" },
    bonusTask: "Find a hidden treasure",
    points: { bonus: 50 }
  },
  {
    id: 5,
    title: "Step 5: Arnold Arboretum",
    description: "Complete challenges to unlock the Arboretum!",
    games: [
      {
        id: 1,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "shayari abc",
        points: 100
      },
      {
        id: 2,
        title: "Placeholder Game",
        component: "Placeholder",
        description: "Coming soon...",
        points: 100
      }
    ],
    finalAnswer: "arboretum",
    location: { lat: 42.3014, lng: -71.1249, name: "Arnold Arboretum" },
    bonusTask: "Make a birthday wish",
    points: { bonus: 50 }
  },
  {
    id: 6,
    title: "Step 6: Charles River Quest",
    description: "Complete 2 final challenges!",
    games: [
      {
        id: 1,
        title: "Common Thing Identification",
        component: "MultipleChoice",
        options: ["placeholder_1", "placeholder_2", "placeholder_3", "placeholder_4"],
        question: "Identify the common thing here",
        points: 100
      },
      {
        id: 2,
        title: "Song Theme Guessing",
        component: "AudioGuess",
        audioUrl: "/images/paani-da-rang.mp3",
        question: "Identify the theme from this song",
        points: 100
      }
    ],
    finalAnswer: "charles",
    location: { lat: 42.3601, lng: -71.0589, name: "Charles River" },
    bonusTask: "Watch the sunset and celebrate!",
    points: { bonus: 50 }
  },
  {
    id: 7,
    title: "Step 7: Final Celebration",
    description: "You've completed the journey! Time to celebrate!",
    games: [],
    finalAnswer: "celebration",
    location: { lat: 42.3601, lng: -71.0589, name: "Charles River Esplanade" },
    bonusTask: "Take a group photo!",
    points: { bonus: 100 }
  }
];

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
