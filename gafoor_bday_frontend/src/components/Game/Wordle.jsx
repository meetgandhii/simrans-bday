import React, { useState } from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';

const Wordle = ({ answer, onComplete, isCompleted = false }) => {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');

  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  const handleGuess = () => {
    if (currentGuess.length !== WORD_LENGTH || gameCompleted || isCompleted) return;

    const newGuesses = [...guesses, currentGuess.toUpperCase()];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess.toUpperCase() === answer.toUpperCase()) {
      setGameCompleted(true);
      if (!hasCalledCompletion && !isCompleted) {
        setHasCalledCompletion(true);
        setTimeout(() => onComplete && onComplete(), 1000);
      }
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameCompleted(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    } else if (e.key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (e.key.match(/[A-Za-z]/) && currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + e.key.toUpperCase());
    }
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setGameCompleted(true);
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
      setShowSkipModal(false);
      setSkipPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleSkipKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSkipGame();
    }
  };

  const getLetterStatus = (letter, position, guess) => {
    if (letter === answer[position]) return 'correct';
    if (answer.includes(letter)) return 'present';
    return 'absent';
  };

  if (isCompleted || gameCompleted) {
    const won = guesses.some(guess => guess === answer.toUpperCase()) || isCompleted;
    
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${won ? 'text-green-500' : 'text-gray-400'}`} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Wordle Completed!' : (won ? 'Congratulations!' : 'Game Over!')}
          </h3>
          <p className="text-gray-600 mb-4">
            {isCompleted ? `The word was: ${answer}` : (won ? `You guessed it in ${guesses.length} tries!` : `The word was: ${answer}`)}
          </p>
          {!isCompleted && !won && (
            <button
              onClick={() => {
                setGuesses([]);
                setCurrentGuess('');
                setGameCompleted(false);
                setHasCalledCompletion(false);
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center mx-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Wordle Challenge</h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Guess the 5-letter word. You have {MAX_GUESSES - guesses.length} guesses left.
        </p>
      </div>

      {/* Game Grid */}
      <div className="space-y-2 mb-4">
        {Array.from({ length: MAX_GUESSES }, (_, i) => (
          <div key={i} className="flex gap-2 justify-center">
            {Array.from({ length: WORD_LENGTH }, (_, j) => {
              const letter = guesses[i]?.[j] || '';
              const status = guesses[i] ? getLetterStatus(letter, j, guesses[i]) : '';
              
              return (
                <div
                  key={j}
                  className={`w-12 h-12 border-2 flex items-center justify-center font-bold text-lg ${
                    status === 'correct'
                      ? 'bg-green-500 border-green-500 text-white'
                      : status === 'present'
                        ? 'bg-yellow-500 border-yellow-500 text-white'
                        : status === 'absent'
                          ? 'bg-gray-500 border-gray-500 text-white'
                          : i === guesses.length && j < currentGuess.length
                            ? 'border-red-500'
                            : 'border-gray-300'
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Current Guess Input */}
      <div className="text-center">
        <input
          type="text"
          value={currentGuess}
          onKeyDown={handleKeyPress}
          placeholder="Enter your guess..."
          className="p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center font-mono text-lg uppercase tracking-wider"
          maxLength={WORD_LENGTH}
          disabled={gameCompleted}
        />
        <button
          onClick={handleGuess}
          disabled={currentGuess.length !== WORD_LENGTH || gameCompleted}
          className="mt-3 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guess
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Type your guess and press Enter or click Guess
      </div>

      {/* Skip Game Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skip Game</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter password to skip this game:
            </p>
            <input
              type="password"
              value={skipPassword}
              onChange={(e) => setSkipPassword(e.target.value)}
              onKeyPress={handleSkipKeyPress}
              placeholder="Password: 5555"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSkipGame}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Skip Game
              </button>
              <button
                onClick={() => {
                  setShowSkipModal(false);
                  setSkipPassword('');
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wordle;
