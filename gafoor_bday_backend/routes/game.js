const express = require('express');
const User = require('../models/User');
const GameLocation = require('../models/GameLocation');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Game clues configuration
const CLUES = [
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

// Get user progress
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      currentClue: user.gameProgress.currentClue,
      completedClues: user.gameProgress.completedClues,
      completedTasks: user.gameProgress.completedTasks,
      totalScore: user.totalScore,
      availablePoints: user.availablePoints
    });
  } catch (error) {
    console.error('Get progress error:', error);
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
    const isCorrect = clue.answers.some(correctAnswer => 
      answer.toLowerCase().includes(correctAnswer.toLowerCase())
    );

    if (!isCorrect) {
      return res.status(400).json({ message: 'Incorrect answer' });
    }

    // Add points and update progress
    user.addPoints(clue.points.base);
    user.gameProgress.completedClues.push(clueId);
    
    // Find the next available clue
    const nextClue = CLUES.find(c => c.id > clueId);
    user.gameProgress.currentClue = nextClue ? nextClue.id : null; // null if no more clues
    user.gameProgress.lastUpdated = new Date();

    await user.save();

    res.json({
      message: 'Clue completed successfully!',
      pointsEarned: clue.points.base,
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

module.exports = router;
