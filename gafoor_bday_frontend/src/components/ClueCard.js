import React, { useState } from 'react';
import { SkipForward, Trophy, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { formatPoints } from '../utils/helpers';
import WordSearch from './WordSearch';
import ShoppingList from './ShoppingList';
import TriviaQuestion from './Game/TriviaQuestion';
import JigsawPuzzle from './JigsawPuzzle';

const ClueCard = ({ 
  clue, 
  isActive, 
  isCompleted, 
  onAnswerSubmit, 
  onTaskComplete, 
  onClueComplete,
  isTaskCompleted = false
}) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();
  
  if (!isActive && !isCompleted) return null;

  const renderGameComponent = (clue) => {
    const handleGameComplete = () => {
      // Use the first answer from the clue's answers array
      const answer = clue.answers && clue.answers.length > 0 ? clue.answers[0] : '';
      onAnswerSubmit(clue.id, answer.toLowerCase().trim());
    };

    switch (clue.component) {
      case 'WordSearch':
        return <WordSearch onWordsFound={handleGameComplete} isCompleted={isCompleted} />;
      case 'ShoppingList':
        return <ShoppingList onComplete={handleGameComplete} isCompleted={isCompleted} />;
      case 'TriviaQuestion':
        return <TriviaQuestion questions={clue.questions} onComplete={handleGameComplete} isCompleted={isCompleted} />;
      case 'JigsawPuzzle':
        return <JigsawPuzzle imageUrl={clue.imageUrl} onComplete={handleGameComplete} isCompleted={isCompleted} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await onAnswerSubmit(clue.id, answer.toLowerCase().trim());
      if (result.success) {
        setAnswer('');
        onClueComplete && onClueComplete();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to submit answer');
    }
    
    setLoading(false);
  };

  const handleTaskComplete = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await onTaskComplete(clue.id);
      if (!result.success) {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to complete task');
    }
    
    setLoading(false);
  };

  const handleAdminSkip = async () => {
    if (!isAdmin()) return;
    
    setLoading(true);
    try {
      await gameAPI.skipClue(user.id, clue.id);
      onClueComplete && onClueComplete();
    } catch (error) {
      setError('Failed to skip clue');
    }
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 border-2 transition-all duration-300 ${
      isCompleted 
        ? 'border-green-500 opacity-80' 
        : 'border-red-600'
    }`}>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
            {clue.id}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{clue.title}</h2>
            <p className="text-sm text-gray-600">{clue.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <Trophy className="w-4 h-4 mr-1" />
            {formatPoints(clue.points?.base || 100)} pts
          </span>
          {isAdmin() && !isCompleted && (
            <button
              onClick={handleAdminSkip}
              disabled={loading}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 flex items-center space-x-1 transition duration-200 disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
              <span>Skip</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Game Component */}
      {clue.component && (
        <div className="mb-4">
          {renderGameComponent(clue)}
        </div>
      )}

      {clue.bonusTask && (
        <div className={`border-2 border-dashed p-4 rounded-lg mb-4 ${
          isTaskCompleted 
            ? 'bg-green-50 border-green-400' 
            : 'bg-yellow-50 border-yellow-400'
        }`}>
          <h3 className={`font-bold mb-2 flex items-center space-x-1 ${
            isTaskCompleted ? 'text-green-800' : 'text-yellow-800'
          }`}>
            <Star className="w-4 h-4" />
            <span>Bonus Challenge! (+{formatPoints(clue.points?.bonus || 50)} pts)</span>
          </h3>
          <p className={`mb-2 ${isTaskCompleted ? 'text-green-700' : 'text-yellow-700'}`}>
            {clue.bonusTask}
          </p>
          {!isTaskCompleted && (
            <button
              onClick={handleTaskComplete}
              disabled={loading}
              className="bg-yellow-400 text-gray-800 px-4 py-2 rounded hover:bg-yellow-500 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Task Complete'}
            </button>
          )}
          {isTaskCompleted && (
            <div className="text-green-700 font-medium flex items-center">
              <span className="mr-2">✅</span>
              Bonus task completed!
            </div>
          )}
        </div>
      )}

      {!isCompleted && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !answer.trim()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <span className="text-green-700 font-medium flex items-center justify-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Challenge Complete!</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ClueCard;