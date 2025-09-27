// Test script to verify the new progress tracking works
const mongoose = require('mongoose');
const User = require('./gafoor_bday_backend/models/User');
require('dotenv').config();

async function testProgress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find a test user
    const user = await User.findOne();
    if (!user) {
      console.log('No users found');
      return;
    }

    console.log('Current user progress:', {
      currentClue: user.gameProgress.currentClue,
      completedGames: user.gameProgress.completedGames,
      currentGameIndex: user.gameProgress.currentGameIndex,
      totalScore: user.totalScore
    });

    // Test adding a completed game
    if (!user.gameProgress.completedGames) {
      user.gameProgress.completedGames = {};
    }
    
    user.gameProgress.completedGames['1-1'] = true; // Step 1, Game 1 completed
    user.gameProgress.currentGameIndex = 1; // Now on game 2
    user.gameProgress.lastUpdated = new Date();
    
    await user.save();
    console.log('Updated progress:', {
      currentClue: user.gameProgress.currentClue,
      completedGames: user.gameProgress.completedGames,
      currentGameIndex: user.gameProgress.currentGameIndex,
      totalScore: user.totalScore
    });

    await mongoose.disconnect();
    console.log('Test completed');
  } catch (error) {
    console.error('Test error:', error);
  }
}

testProgress();
