const express = require('express');
const User = require('../models/User');
const GameLocation = require('../models/GameLocation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Game clues configuration - NEW MEGA UPDATE!
const CLUES = [
  {
    id: 0,
    title: "Step 0: Welcome",
    description: "Welcome to the Birthday Treasure Hunt!",
    games: [
      {
        id: 1,
        title: "Intro Slideshow",
        component: "Slideshow",
        images: [
          "/images/slideshow/intro-1.jpg",
          "/images/slideshow/intro-2.jpg", 
          "/images/slideshow/intro-3.jpg",
          "/images/slideshow/intro-4.jpg",
          "/images/slideshow/intro-5.jpg",
        ],
        points: 0
      }
    ],
    finalAnswer: null,
    location: { lat: 0, lng: 0, name: "Starting Point" },
    points: { bonus: 0 }
  },
  {
    id: 1,
    title: "Step 1:",
    description: "Complete 1 game to unlock the location!",
    games: [
      {
        id: 1,
        title: "Guess",
        component: "TextInput",
        question: "Birthday girl, don't overthinkin', \nWe're not off hiking or mountain sinkin'. \nFollow the clues, keep on winkin', \nIt's where the mugs are warm and we're sippin'!",
        answer: "dunkin",
        points: 100
      }
    ],
    finalAnswer: "dunkin",
    location: { lat: 42.3515, lng: -71.0795, name: "Dunkin'" },
    points: { bonus: 50 }
  },
  {
    id: 2,
    title: "Step 2",
    description: "Complete 3 games to unlock the first location!",
    games: [
      {
        id: 1,
        title: "Word Search Challenge",
        component: "WordSearch",
        words: ["CHILI", "LIME", "CHIPS", "GARLIC", "DIP", "VEGETABLE", "ROOT", "STRAWBERRY", "POPCORN", "CRUNCHY", "OKRA", "JERK", "STYLE", "PLANTAIN"],
        points: 100
      },
      {
        id: 2,
        title: "Quick Quiz (60 seconds)",
        component: "QuickQuiz",
        questions: [
          { question: "What is Carlos Sainz's number?", options: ["55", "16", "3", "77"], correct: 0 },
          { question: "Which team does Carlos drive for in 2024?", options: ["Ferrari", "Red Bull", "Mercedes", "McLaren"], correct: 0 },
          { question: "What is the maximum speed in F1?", options: ["200 mph", "220 mph", "240 mph", "260 mph"], correct: 2 },
          { question: "How many races in a F1 season?", options: ["20", "22", "24", "26"], correct: 2 },
          { question: "What does DRS stand for?", options: ["Drag Reduction System", "Downforce Reduction System", "Drive Reduction System", "Draft Reduction System"], correct: 0 }
        ],
        timeLimit: 60,
        requiredCorrect: 3,
        points: 100
      },
      {
        id: 3,
        title: "Answer the Question",
        component: "TextInput",
        question: "What kinda hoe you like to be?",
        answer: "trader",
        points: 100
      }
    ],
    finalAnswer: "trader joes",
    location: { lat: 42.3515, lng: -71.0795, name: "Trader Joe's Boylston" },
    points: { bonus: 50 }
  },
  {
    id: 3,
    title: "Step 3",
    description: "Complete 2 games to unlock the location!",
    games: [
      {
        id: 1,
        title: "Image Guessing",
        component: "ImageGuess",
        imageUrl: "/images/nike.png",
        question: "Guess the product from this image",
        answers: ["nike shoes"],
        points: 100
      },
    ],
    finalAnswer: "nike",
    location: { lat: 42.3502, lng: -71.0759, name: "Nike Store" },
    points: { bonus: 50 }
  },
  {
    id: 4,
    title: "Step 4",
    description: "Complete 2 challenges to unlock the location!",
    games: [
      {
        id: 1,
        title: "Video Guessing",
        component: "VideoGuess",
        videoUrl: "/images/reel.mp4",
        question: "Guess the animal from this reel",
        answers: ["cow", "cows", "cattle"],
        points: 100
      },
      {
        id: 2,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "mai hu veeru tu hai JAI\nmai chahu aditi tujhe mil jaye apna JAI \nye surya ke KIRAN mai phigal jaye ice bhi \nmai chahu tu kashmir jaa kar khayie ye bhi \nye next location mai enter karne se pehle chillana AMBE MAATE KI …..",
        answer: "jai prakash",
        points: 100
      }
    ],
    finalAnswer: "jp licks",
    location: { lat: 42.3467, lng: -71.0707, name: "JP Licks" },
    points: { bonus: 50 }
  },
  {
    id: 5,
    title: "Step 5",
    description: "Complete 2 games to unlock the location!",
    games: [
      {
        id: 1,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "Not MIN but the MAX of birthday cheer for our sister,\nClearance and treasures that sparkle and glitter,\nVerstappen should be sued for stealing this name,\nTwo letters and double X win the bargain game.\nTwo letters and double X win the bargain game.",
        answer: "tj maxx",
        points: 100
      },
      {
        id: 2,
        title: "Connections Game",
        component: "Connections",
        categories: ["Home Décor", "Women's Fashion", "Kitchen & Dining", "Beauty & Skincare"],
        items: [
          // Home Décor - category 0
          { text: "Marble lamp", category: 0 },
          { text: "Velvet throw", category: 0 },
          { text: "Glass holders", category: 0 },
          { text: "Jute stool", category: 0 },

          // Women's Fashion - category 1
          { text: "Faux bag", category: 1 },
          { text: "Linen blazer", category: 1 },
          { text: "Velvet skirt", category: 1 },
          { text: "Suede boots", category: 1 },

          // Kitchen & Dining - category 2
          { text: "Salt jar", category: 2 },
          { text: "Stone plates", category: 2 },
          { text: "Linen napkins", category: 2 },
          { text: "Copper tongs", category: 2 },

          // Beauty & Skincare - category 3
          { text: "Charcoal bar", category: 3 },
          { text: "Velvet powder", category: 3 },
          { text: "Argan cream", category: 3 },
          { text: "Jade roller", category: 3 }
        ],
        points: 100
      },
      {
        id: 3,
        title: "Wordle Challenge",
        component: "Wordle",
        answer: "TJMAX",
        points: 100
      },
    ],
    finalAnswer: "tj maxx",
    location: { lat: 42.3501, lng: -71.0764, name: "TJ Maxx" },
    points: { bonus: 50 }
  },
  {
    id: 6,
    title: "Step 6",
    description: "Complete challenges to unlock the location!",
    games: [
      {
        id: 1,
        title: "Shayari Challenge",
        component: "TextInput",
        question: "jungle jungle pata chala hai, \nrase pe chaddi fata pada hai, \nhiran sallu bhai se bhaga hai, \nbhaagke dakshin raaste me gaya hai.",
        answer: "arboretum",
        points: 100
      },
    ],
    finalAnswer: "arnold arboretum",
    location: { lat: 42.3014, lng: -71.1249, name: "Arnold Arboretum" },
    points: { bonus: 50 }
  },
  {
    id: 7,
    title: "Step 7",
    description: "Complete 2 final challenges!",
    games: [
      {
        id: 1,
        title: "Go To Arnold Arboretum and Paint on the Canvas",
        component: "TextInput",
        question: "Type 'bhaang bhosda' when done",
        answer: "bhaang bhosda",
        points: 100
      },
      // {
      //   id: 2,
      //   title: "Common Thing Identification",
      //   component: "TextInput",
      //   question: "Look at these items and identify what they have in common:",
      //   options: ["Monaco", "Red", "Leo", "16"],
      //   answer: "charles",
      //   points: 100
      // },
      // {
      //   id: 3,
      //   title: "Song Theme Guessing",
      //   component: "AudioGuess",
      //   audioUrl: "/images/song.mp3",
      //   question: "Identify the theme from this song",
      //   answers: ["charles", "water", "paani", "river", "charles river"],
      //   points: 100
      // },
      {
        id: 2,
        title: "Wordle Challenge",
        component: "Wordle",
        answer: "RIVER",
        points: 100
      }
    ],
    finalAnswer: "charles river",
    location: { lat: 42.3601, lng: -71.0589, name: "Charles River" },
    points: { bonus: 50 }
  },
  {
    id: 8,
    title: "Step 8: Final Celebration",
    description: "You've completed the journey! Time to celebrate!",
    games: [],
    finalAnswer: "celebration",
    location: { lat: 42.3601, lng: -71.0589, name: "Charles River Esplanade" },
    points: { bonus: 100 }
  }
];

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Convert Map to plain object for JSON serialization
    const completedGamesObj = {};
    if (user.gameProgress.completedGames) {
      user.gameProgress.completedGames.forEach((value, key) => {
        completedGamesObj[key] = value;
      });
    }

    res.json({
      currentClue: user.gameProgress.currentClue,
      completedClues: user.gameProgress.completedClues,
      completedTasks: user.gameProgress.completedTasks,
      completedGames: completedGamesObj,
      currentGameIndex: user.gameProgress.currentGameIndex || 0,
      totalScore: user.totalScore,
      availablePoints: user.availablePoints,
      clues: CLUES // Include the clues data
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete individual game within a step
router.post('/complete-game', auth, async (req, res) => {
  try {
    const { stepId, gameId, points } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize completedGames if it doesn't exist
    if (!user.gameProgress.completedGames) {
      user.gameProgress.completedGames = new Map();
    }

    // Mark this specific game as completed
    const gameKey = `${stepId}-${gameId}`;
    if (!user.gameProgress.completedGames.get(gameKey)) {
      user.gameProgress.completedGames.set(gameKey, true);
      user.addPoints(points || 100);
    }

    // Find current game index for this step
    const step = CLUES.find(c => c.id === stepId);
    if (step && step.games) {
      const currentGameIndex = step.games.findIndex(game => game.id === gameId);
      user.gameProgress.currentGameIndex = currentGameIndex;
    }

    user.gameProgress.lastUpdated = new Date();
    await user.save();

    res.json({
      message: 'Game completed successfully!',
      pointsEarned: points || 100,
      totalScore: user.totalScore,
      availablePoints: user.availablePoints,
      completedGames: user.gameProgress.completedGames
    });
  } catch (error) {
    console.error('Complete game error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete clue
router.post('/complete-clue', auth, async (req, res) => {
  try {
    const { clueId, answer } = req.body;
    const user = await User.findById(req.user._id);

    const clue = CLUES.find(c => c.id === clueId);
    if (!clue) {
      return res.status(400).json({ message: 'Invalid clue ID' });
    }

    // Check if clue is already completed
    if (user.gameProgress.completedClues.includes(clueId)) {
      return res.status(400).json({ message: 'Clue already completed' });
    }

    // Validate answer
    let isCorrect = false;
    
    // Special case for Step 0 (slideshow) - no validation needed
    if (clueId === 0) {
      isCorrect = true;
    } else if (clue.finalAnswer) {
      const answerLower = answer.toLowerCase();
      const finalAnswerLower = clue.finalAnswer.toLowerCase();

      // Special case for Nike - accept multiple variations
      if (finalAnswerLower === "nike") {
        isCorrect = answerLower.includes("nike") ||
          answerLower.includes("nike outlet") ||
          answerLower.includes("nike store");
      } else {
        isCorrect = answerLower.includes(finalAnswerLower);
      }
    }

    if (!isCorrect) {
      return res.status(400).json({ message: 'Incorrect answer' });
    }

    // Add points and update progress
    user.addPoints(clue.points.bonus || 50);
    user.gameProgress.completedClues.push(clueId);

    // Find the next available clue
    const nextClue = CLUES.find(c => c.id > clueId);
    user.gameProgress.currentClue = nextClue ? nextClue.id : null; // null if no more clues
    user.gameProgress.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Clue completed successfully!',
      pointsEarned: clue.points.bonus || 50,
      nextClue: user.gameProgress.currentClue,
      totalScore: user.totalScore,
      availablePoints: user.availablePoints
    });
  } catch (error) {
    console.error('Complete clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete bonus task
router.post('/complete-task', auth, async (req, res) => {
  try {
    const { clueId } = req.body;
    const user = await User.findById(req.user._id);

    const clue = CLUES.find(c => c.id === clueId);
    if (!clue) {
      return res.status(400).json({ message: 'Invalid clue ID' });
    }

    // Check if task is already completed
    if (user.gameProgress.completedTasks.includes(clueId)) {
      return res.status(400).json({ message: 'Task already completed' });
    }

    // Check if clue is completed first
    if (!user.gameProgress.completedClues.includes(clueId)) {
      return res.status(400).json({ message: 'Complete the clue first' });
    }

    // Add bonus points
    user.addPoints(clue.points.bonus);
    user.gameProgress.completedTasks.push(clueId);
    user.gameProgress.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Bonus task completed!',
      pointsEarned: clue.points.bonus,
      totalScore: user.totalScore,
      availablePoints: user.availablePoints
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get accessible locations
router.get('/locations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const currentClue = user.gameProgress.currentClue;

    // Get all locations
    const locations = await GameLocation.find().sort({ clueNumber: 1 });

    // Filter based on user progress
    const accessibleLocations = locations.map(location => ({
      ...location.toObject(),
      isCompleted: user.gameProgress.completedClues.includes(location.clueNumber),
      isCurrent: location.clueNumber === currentClue,
      isLocked: location.clueNumber > currentClue
    }));

    res.json(accessibleLocations);
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get clue details
router.get('/clue/:clueId', auth, async (req, res) => {
  try {
    const { clueId } = req.params;
    const clue = CLUES.find(c => c.id === parseInt(clueId));

    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    res.json(clue);
  } catch (error) {
    console.error('Get clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Skip to next clue
router.post('/admin/skip-clue', auth, adminAuth, async (req, res) => {
  try {
    const { userId, clueId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add clue to completed list
    if (!user.gameProgress.completedClues.includes(clueId)) {
      user.gameProgress.completedClues.push(clueId);
    }

    // Find the next available clue
    const nextClue = CLUES.find(c => c.id > clueId);
    user.gameProgress.currentClue = nextClue ? nextClue.id : null; // null if no more clues
    user.gameProgress.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Clue skipped successfully',
      currentClue: user.gameProgress.currentClue
    });
  } catch (error) {
    console.error('Skip clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin endpoint to reset user progress by email
router.post('/admin/reset-progress', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Reset user progress
    user.gameProgress = {
      currentClue: 0,
      completedClues: [],
      completedTasks: [],
      completedGames: new Map(),
      currentGameIndex: 0,
      lastUpdated: new Date()
    };

    user.totalScore = 0;
    user.availablePoints = 0;

    await user.save();

    res.json({
      message: 'User progress reset successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        currentClue: user.gameProgress.currentClue,
        completedClues: user.gameProgress.completedClues,
        totalScore: user.totalScore
      }
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User endpoint to reset their own progress
router.post('/reset-progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Reset user progress
    user.gameProgress = {
      currentClue: 0,
      completedClues: [],
      completedTasks: [],
      completedGames: new Map(),
      currentGameIndex: 0,
      lastUpdated: new Date()
    };

    user.totalScore = 0;
    user.availablePoints = 0;

    await user.save();

    res.json({
      message: 'Your progress has been reset successfully',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        currentClue: user.gameProgress.currentClue,
        completedClues: user.gameProgress.completedClues,
        totalScore: user.totalScore
      }
    });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
