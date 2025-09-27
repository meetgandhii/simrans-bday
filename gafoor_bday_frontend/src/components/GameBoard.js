import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { CLUES } from '../utils/constants';
import ScoreDisplay from './Layout/ScoreDisplay';
import ClueCard from './ClueCard';
import WordSearch from './WordSearch';
import ShoppingList from './ShoppingList';
import TriviaQuestion from './Game/TriviaQuestion';
import JigsawPuzzle from './JigsawPuzzle';

const GameBoard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGameProgress();
  }, []);

  const loadGameProgress = async () => {
    try {
      const response = await gameAPI.getProgress();
      const progress = response.data;
      
      // Update user with latest progress
      const updatedUser = {
        ...user,
        gameProgress: progress,
        totalScore: progress.totalScore,
        availablePoints: progress.availablePoints
      };
      updateUser(updatedUser);
      
    } catch (error) {
      console.error('Error loading game progress:', error);
      setError('Failed to load game progress');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (clueId, answer) => {
    // Prevent duplicate submissions
    if (completedClues.includes(clueId)) {
      console.log('Clue already completed, skipping submission');
      return { success: true };
    }

    try {
      const response = await gameAPI.completeClue(clueId, answer);
      
      if (response.data) {
        // Update user with new progress
        const updatedUser = {
          ...user,
          totalScore: response.data.totalScore,
          availablePoints: response.data.availablePoints,
          gameProgress: {
            ...user.gameProgress,
            currentClue: response.data.nextClue,
            completedClues: [...user.gameProgress.completedClues, clueId]
          }
        };
        updateUser(updatedUser);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to submit answer' 
      };
    }
  };

  const handleTaskComplete = async (clueId) => {
    try {
      const response = await gameAPI.completeTask(clueId);
      
      if (response.data) {
        // Update user with new progress
        const updatedUser = {
          ...user,
          totalScore: response.data.totalScore,
          availablePoints: response.data.availablePoints,
          gameProgress: {
            ...user.gameProgress,
            completedTasks: [...user.gameProgress.completedTasks, clueId]
          }
        };
        updateUser(updatedUser);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Error completing task:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to complete task' 
      };
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadGameProgress}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentClue = user.gameProgress.currentClue;
  const completedClues = user.gameProgress.completedClues;
  const completedTasks = user.gameProgress.completedTasks;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* F1 Theme Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">F1 Birthday Hunt</h1>
            <p className="text-lg italic text-gray-600 mb-4">
              "Smooth operator... smooth operation" - Carlos Sainz
            </p>
            <div className="h-2 bg-gradient-to-r from-red-600 to-black rounded"></div>
          </div>

          <ScoreDisplay />

          {/* Render active and completed clues */}
          {CLUES.map(clue => (
            <ClueCard
              key={clue.id}
              clue={clue}
              isActive={currentClue === clue.id}
              isCompleted={completedClues.includes(clue.id)}
              isTaskCompleted={completedTasks.includes(clue.id)}
              onAnswerSubmit={handleAnswerSubmit}
              onTaskComplete={handleTaskComplete}
              onClueComplete={loadGameProgress}
            />
          ))}

          {/* Final completion screen */}
          {completedClues.length >= 7 && (
            <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-500">
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                🎉 HAPPY BIRTHDAY SIMRAN! 🎉
              </h2>
              <div className="space-y-2 text-lg">
                <p>Final Score: <span className="font-bold text-2xl text-red-600">{user.totalScore}</span> points</p>
                <p className="text-xl font-medium text-green-700">F1 Champion! 🏆</p>
                <p className="text-gray-700 mt-4">Time for sunset at Charles River! 🌅</p>
              </div>

              {/* Celebration confetti effect */}
              <div className="mt-6">
                <div className="inline-flex space-x-2 text-2xl animate-bounce">
                  <span>🎊</span>
                  <span>🏁</span>
                  <span>🏆</span>
                  <span>🎂</span>
                  <span>🎊</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;