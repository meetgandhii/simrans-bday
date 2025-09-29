import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Star, Target } from 'lucide-react';
import { formatPoints } from '../../utils/helpers';

const ScoreDisplay = ({ className = '' }) => {
  const { user } = useAuth();

  if (!user) return null;

  const progress = user.gameProgress;
  const completedClues = progress.completedClues.length;
  const completedTasks = progress.completedTasks.length;
  const totalClues = 8; // Total number of clues in the game

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Your Progress
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">
            {formatPoints(user.availablePoints)}
          </div>
          <div className="text-xs text-gray-500">Available Points</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Game Progress</span>
          <span>{completedClues}/{totalClues} clues</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-red-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedClues / totalClues) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {formatPoints(user.totalScore)}
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <Trophy className="w-3 h-3 mr-1" />
            Total Score
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {completedTasks}
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <Star className="w-3 h-3 mr-1" />
            Bonus Tasks
          </div>
        </div>
      </div>

      {/* Current Clue */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="w-4 h-4 mr-2 text-red-600" />
            <span className="text-sm text-gray-600">Current Clue:</span>
          </div>
          <span className="text-lg font-bold text-red-600">
            #{progress.currentClue}
          </span>
        </div>
      </div>

      {/* Achievement Badges */}
      {completedClues > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {completedClues >= 1 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                🏁 First Clue
              </span>
            )}
            {completedClues >= 3 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                🏎️ Halfway There
              </span>
            )}
            {completedClues >= 5 && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                🏆 Almost Champion
              </span>
            )}
            {completedClues >= 7 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                👑 F1 Champion
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
