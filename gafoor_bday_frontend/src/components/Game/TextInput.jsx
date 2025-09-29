import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const TextInput = ({ question, options, correctAnswer, onComplete, isCompleted = false }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || submitted || isCompleted) return;
    
    setSubmitted(true);
    setShowResult(true);
    
    // Check if answer is correct
    const userAnswer = answer.toLowerCase().trim();
    const correct = correctAnswer ? correctAnswer.toLowerCase().trim() : '';
    
    let answerIsCorrect = false;
    if (correct) {
      // Handle multiple correct answers (array)
      if (Array.isArray(correct)) {
        answerIsCorrect = correct.some(correctAns => 
          userAnswer.includes(correctAns.toLowerCase().trim())
        );
      } else {
        answerIsCorrect = userAnswer.includes(correct);
      }
    }
    
    setIsCorrect(answerIsCorrect);
    
    if (answerIsCorrect) {
      // Correct answer - proceed after delay
      if (!hasCalledCompletion && !isCompleted) {
        setHasCalledCompletion(true);
        setTimeout(() => {
          onComplete && onComplete();
        }, 1500);
      }
    }
  };

  const handleRetry = () => {
    setAnswer('');
    setSubmitted(false);
    setShowResult(false);
    setIsCorrect(null);
    setHasCalledCompletion(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setSubmitted(true);
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

  if (isCompleted || (submitted && isCorrect)) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : 'Correct Answer!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great job on this challenge!' : 'Moving to next step...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Guess</h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
        <p className="text-gray-600 mb-4 whitespace-pre-line">{question}</p>
      </div>

      {/* Display options if provided */}
      {options && options.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((option, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <span className="text-gray-700 font-medium">{option}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            rows={4}
            disabled={submitted}
          />
        </div>

        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || submitted}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>Submit Answer</span>
          </button>
        ) : (
          <div className="space-y-4">
            {/* Result Display */}
            <div className="text-center">
              {isCorrect ? (
                <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Correct! Moving to next step...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                  <XCircle className="w-6 h-6" />
                  <span className="text-lg font-semibold">Incorrect answer. Try again!</span>
                </div>
              )}
            </div>

            {/* Retry Button for incorrect answers */}
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Press Enter or click Submit to send your answer
      </div>

      {/* Skip Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skip This Game</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter password to skip this game:
            </p>
            <input
              type="password"
              value={skipPassword}
              onChange={(e) => setSkipPassword(e.target.value)}
              onKeyPress={handleSkipKeyPress}
              placeholder="Password: 5555"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSkipModal(false);
                  setSkipPassword('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipGame}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Skip Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInput;
