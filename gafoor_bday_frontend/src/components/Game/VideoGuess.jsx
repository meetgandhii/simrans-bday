import React, { useState } from 'react';
import { Send, CheckCircle, Video, Play } from 'lucide-react';

const VideoGuess = ({ videoUrl, question, answers, onComplete, isCompleted = false }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (!answer.trim() || submitted || isCompleted) return;
    
    setSubmitted(true);
    
    // Check if answer is correct (only if answers array is provided)
    if (answers && answers.length > 0) {
      const userAnswer = answer.trim().toLowerCase();
      const correctAnswers = answers.map(a => a.toLowerCase());
      const isAnswerCorrect = correctAnswers.includes(userAnswer);
      setIsCorrect(isAnswerCorrect);
      
      // Only complete the game if answer is correct
      if (!hasCalledCompletion && !isCompleted && isAnswerCorrect) {
        setHasCalledCompletion(true);
        setTimeout(() => {
          onComplete && onComplete();
        }, 1000);
      }
    } else {
      // If no answers provided, complete the game anyway (legacy behavior)
      if (!hasCalledCompletion && !isCompleted) {
        setHasCalledCompletion(true);
        setTimeout(() => {
          onComplete && onComplete();
        }, 1000);
      }
    }
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

  if (isCompleted || submitted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${isCompleted ? 'text-green-500' : (isCorrect === true ? 'text-green-500' : (isCorrect === false ? 'text-red-500' : 'text-gray-400'))}`} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : (isCorrect === true ? 'Correct Answer!' : (isCorrect === false ? 'Incorrect Answer' : 'Answer Submitted!'))}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great observation!' : (isCorrect === true ? 'You got it right! Well done!' : (isCorrect === false ? 'Try again with a different answer.' : 'Your answer has been recorded!'))}
          </p>
          {isCorrect === false && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setIsCorrect(null);
                  setAnswer('');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-3 sm:p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Video Guessing Challenge</h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
        <p className="text-gray-600 mb-4">{question}</p>
      </div>

      <div className="space-y-4">
        {/* Video Display */}
        <div className="text-center">
          <div className="relative inline-block">
            <video
              src={videoUrl}
              controls
              className="max-w-full h-auto max-h-64 rounded-lg border-2 border-gray-300"
              onError={(e) => {
                console.error('Video failed to load:', videoUrl);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            >
              Your browser does not support the video tag.
            </video>
            <div className="w-full h-32 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hidden">
              <div className="text-center">
                <Video className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Video not available</p>
                <p className="text-xs text-gray-400">Placeholder for {videoUrl}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        <div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Guess the animal"
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={submitted}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || submitted}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
          <span>Submit Answer</span>
        </button>
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

export default VideoGuess;
