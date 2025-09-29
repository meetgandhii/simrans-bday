import React, { useState } from 'react';
import { Send, CheckCircle, Volume2, Play, Pause } from 'lucide-react';

const AudioGuess = ({ audioUrl, question, answers, onComplete, isCompleted = false }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [audio, setAudio] = useState(null);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (!answer.trim() || submitted || isCompleted) return;
    
    setSubmitted(true);
    
    // Check if answer is correct
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswers = answers ? answers.map(a => a.toLowerCase()) : [];
    const isAnswerCorrect = correctAnswers.includes(userAnswer);
    setIsCorrect(isAnswerCorrect);
    
    if (!hasCalledCompletion && !isCompleted && isAnswerCorrect) {
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Initialize audio on component mount
  React.useEffect(() => {
    if (audioUrl) {
      const audioElement = new Audio(audioUrl);
      audioElement.addEventListener('ended', () => setIsPlaying(false));
      audioElement.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        setIsPlaying(false);
      });
      setAudio(audioElement);
    }

    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
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
            {isCompleted ? 'Great ear for music!' : (isCorrect === true ? 'You got it right! Well done!' : (isCorrect === false ? 'Try again with a different answer.' : 'Your answer has been recorded!'))}
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
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Audio Guessing Challenge</h3>
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
        {/* Audio Player */}
        <div className="text-center">
          <div className="bg-gray-100 rounded-lg p-6 border-2 border-gray-300">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={togglePlayPause}
                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <div className="text-center">
                <Volume2 className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Audio Player</p>
                <p className="text-xs text-gray-400">Click play to listen</p>
                {audio && (
                  <p className="text-xs text-green-600 mt-1">✓ Audio loaded</p>
                )}
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
            placeholder="What's the theme of this song?"
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

export default AudioGuess;
