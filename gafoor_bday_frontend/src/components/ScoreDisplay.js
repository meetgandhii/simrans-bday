import React from 'react';

const ScoreDisplay = ({ totalScore, currentClue }) => {
  const progress = Math.round(((currentClue - 1) / 7) * 100);
  
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-6 rounded-lg shadow-lg mb-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
          <span>🏆</span>
          <span>Race Points</span>
        </h2>
        <div className="text-4xl font-bold text-f1-red mb-2" id="scoreValue">
          {totalScore}
        </div>
        <div className="text-sm text-gray-700">Complete challenges to earn points!</div>
      </div>
      
      <div className="mt-4 bg-gray-300 rounded-full h-6 overflow-hidden">
        <div 
          className="bg-f1-red h-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;