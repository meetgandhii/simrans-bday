import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';
import { LOCATION_ARRAY } from '../utils/constants';
import ScoreDisplay from './Layout/ScoreDisplay';

// Import all game components
import WordSearch from './WordSearch';
import ShoppingList from './ShoppingList';
import QuickQuiz from './Game/QuickQuiz';
import TextInput from './Game/TextInput';
import ImageGuess from './Game/ImageGuess';
import VideoGuess from './Game/VideoGuess';
import Wordle from './Game/Wordle';
import Connections from './Game/Connections';
import Placeholder from './Game/Placeholder';
import MultipleChoice from './Game/MultipleChoice';
import AudioGuess from './Game/AudioGuess';

const NewGameBoard = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [completedGames, setCompletedGames] = useState({});
  const [stepCompleted, setStepCompleted] = useState({});
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showNextStep, setShowNextStep] = useState(false);
  const [clues, setClues] = useState([]);

  const loadGameProgress = async () => {
    try {
      const response = await gameAPI.getProgress();
      if (response.data) {
        const progress = response.data;
        setCurrentStep(progress.currentClue || 1);
        setCompletedGames(progress.completedGames || {});
        setStepCompleted(progress.completedTasks || []);
        setCurrentGameIndex(progress.currentGameIndex || 0);
        setClues(progress.clues || []);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      setError('Failed to load game progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameProgress();
  }, []);

  // Reset game index when step changes
  useEffect(() => {
    setShowFinalAnswer(false);
    setShowNextStep(false);
    setFinalAnswer('');
  }, [currentStep]);

  // Find the next incomplete game when step or completed games change
  useEffect(() => {
    const step = clues.find(c => c.id === currentStep);
    if (step && step.games) {
      // Special handling for final step (step 8) - no final answer input
      if (currentStep === 8) {
        setShowFinalAnswer(false);
        // Auto-complete step 8 if it has no games
        if (step.games.length === 0) {
          setStepCompleted(prev => ({ ...prev, [currentStep]: true }));
        }
        return;
      }
      
      // Find the first incomplete game
      const nextGameIndex = step.games.findIndex(game => {
        const gameKey = `${currentStep}-${game.id}`;
        const isCompleted = completedGames[gameKey];
        return !isCompleted;
      });
      
      if (nextGameIndex !== -1) {
        setCurrentGameIndex(nextGameIndex);
        setShowFinalAnswer(false);
      } else {
        // All games completed, show final answer
        setShowFinalAnswer(true);
      }
    }
  }, [currentStep, completedGames]);

  const handleGameComplete = async (stepId, gameId) => {
    try {
      const step = clues.find(c => c.id === stepId);
      const game = step?.games?.find(g => g.id === gameId);
      
      // Save to backend first
      await gameAPI.completeGame(stepId, gameId, game?.points);
      
      // Mark game as completed locally
      const gameKey = `${stepId}-${gameId}`;
      setCompletedGames(prev => ({
        ...prev,
        [gameKey]: true
      }));

      if (step && step.games) {
        const currentGameIndexInStep = step.games.findIndex(game => game.id === gameId);
        
        // Check if there are more games in this step
        if (currentGameIndexInStep < step.games.length - 1) {
          // Move to next game in the same step
          setCurrentGameIndex(currentGameIndexInStep + 1);
        } else {
          // All games completed in this step
          if (stepId === 8) {
            // Special handling for final step - auto-complete without final answer input
            await gameAPI.completeClue(stepId, 'celebration');
            setStepCompleted(prev => ({ ...prev, [stepId]: true }));
          } else {
            // Show final answer input for other steps
            setShowFinalAnswer(true);
          }
        }
      }
      
      // Refresh progress to get updated scores
      loadGameProgress();
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  const handleFinalAnswerSubmit = async (stepId, answer) => {
    try {
      const step = clues.find(c => c.id === stepId);
      if (step && answer.toLowerCase().includes(step.finalAnswer.toLowerCase())) {
        // Correct answer - complete the step
        await gameAPI.completeClue(stepId, answer);
        setStepCompleted(prev => ({ ...prev, [stepId]: true }));
        setShowFinalAnswer(false);
        setFinalAnswer('');
        setShowNextStep(true);
        
        // Show success message and move to next step after delay
        setTimeout(() => {
          setCurrentStep(stepId + 1);
          setCurrentGameIndex(0);
          setShowNextStep(false);
          loadGameProgress();
        }, 2000);
      } else {
        alert('Incorrect answer! Try again.');
      }
    } catch (error) {
      console.error('Error submitting final answer:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  const renderGameComponent = (step, game) => {
    const isCompleted = completedGames[`${step.id}-${game.id}`];
    
    const handleGameCompleteCallback = () => {
      handleGameComplete(step.id, game.id);
    };

    switch (game.component) {
      case 'WordSearch':
        return <WordSearch words={game.words} onWordsFound={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'ShoppingList':
        return <ShoppingList items={game.items} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'QuickQuiz':
        return <QuickQuiz questions={game.questions} timeLimit={game.timeLimit} requiredCorrect={game.requiredCorrect} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'TextInput':
        return <TextInput question={game.question} options={game.options} correctAnswer={game.answer} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'ImageGuess':
        return <ImageGuess imageUrl={game.imageUrl} question={game.question} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'VideoGuess':
        return <VideoGuess videoUrl={game.videoUrl} question={game.question} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'Wordle':
        return <Wordle answer={game.answer} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'Connections':
        return <Connections categories={game.categories} items={game.items} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'Placeholder':
        return <Placeholder description={game.description} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'MultipleChoice':
        return <MultipleChoice question={game.question} options={game.options} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      case 'AudioGuess':
        return <AudioGuess audioUrl={game.audioUrl} question={game.question} answers={game.answers} onComplete={handleGameCompleteCallback} isCompleted={isCompleted} />;
      default:
        return <div className="text-center text-gray-500">Unknown game component: {game.component}</div>;
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

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6">
          {/* F1 Theme Header */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">F1 Birthday Hunt</h1>
            <p className="text-sm sm:text-lg italic text-gray-600 mb-4">
              "Smooth operator... smooth operation" - Carlos Sainz
            </p>
            <div className="h-2 bg-gradient-to-r from-red-600 to-black rounded"></div>
          </div>

          <ScoreDisplay />

          {/* Render Steps */}
          {clues.map(step => {
            const isActive = currentStep === step.id;
            const isCompleted = stepCompleted[step.id];
            
            if (!isActive && !isCompleted) return null;

            return (
              <div key={step.id} className="mb-4 sm:mb-8">
                {/* Step Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold">{step.title}</h2>
                      <p className="text-sm sm:text-base text-red-100">{step.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{step.id}</div>
                      <div className="text-sm text-red-200">
                        {isCompleted ? 'Completed' : isActive ? 'Active' : 'Locked'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Game Only */}
                {isActive && step.games && step.games[currentGameIndex] && !showFinalAnswer && (
                  <div className="mb-6">
                    <div className="bg-white border-2 border-red-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {step.games[currentGameIndex].title} ({step.games[currentGameIndex].points} pts)
                        </h3>
                        <div className="text-sm text-gray-600">
                          Game {currentGameIndex + 1} of {step.games.length}
                        </div>
                      </div>
                      {renderGameComponent(step, step.games[currentGameIndex])}
                    </div>
                  </div>
                )}

                {/* Final Answer Input */}
                {isActive && showFinalAnswer && currentStep !== 8 && (
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">🎯 Final Challenge!</h3>
                    <p className="text-yellow-700 mb-3">
                      So guess your destination now!
                    </p>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={finalAnswer}
                        onChange={(e) => setFinalAnswer(e.target.value)}
                        placeholder="Enter the location name..."
                        className="flex-1 p-3 border-2 border-yellow-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleFinalAnswerSubmit(step.id, finalAnswer)}
                      />
                      <button
                        onClick={() => handleFinalAnswerSubmit(step.id, finalAnswer)}
                        disabled={!finalAnswer.trim()}
                        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors font-semibold disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {isActive && showNextStep && (
                  <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-4 text-center">
                    <h3 className="text-lg font-bold text-green-800 mb-2">✅ Correct!</h3>
                    <p className="text-green-700">
                      You go to {step.location.name}! Moving to next step...
                    </p>
                  </div>
                )}

                {/* Bonus Task */}
                {isCompleted && step.bonusTask && (
                  <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-800 mb-2">Bonus Task!</h3>
                    <p className="text-green-700">{step.bonusTask}</p>
                    <p className="text-sm text-green-600 mt-2">+{step.points.bonus} bonus points</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Final completion screen */}
          {stepCompleted[8] && (
            <div className="text-center p-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border-2 border-green-500">
              <h2 className="text-4xl font-bold text-green-600 mb-6">
                🎉 CONGRATULATIONS! 🎉
              </h2>
              <h3 className="text-3xl font-bold text-red-600 mb-6">
                🎂 HAPPY BIRTHDAY SIMRAN! 🎂
              </h3>
              
              {/* Birthday GIF */}
              <div className="mb-6">
                <img 
                  src="/images/saat-crore.gif" 
                  alt="Birthday Celebration" 
                  className="mx-auto max-w-full h-auto max-h-96 sm:max-h-[500px] rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('GIF failed to load:', '/images/saat-crore.gif');
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="space-y-2 text-lg">
                <p>Final Score: <span className="font-bold text-2xl text-red-600">{user?.totalScore || 0}</span> points</p>
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

export default NewGameBoard;
