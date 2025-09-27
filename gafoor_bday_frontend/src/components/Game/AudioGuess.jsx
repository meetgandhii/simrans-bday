import React, { useState } from 'react';
import { Send, CheckCircle, Volume2, Play, Pause } from 'lucide-react';

const AudioGuess = ({ audioUrl, question, onComplete, isCompleted = false }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim() || submitted || isCompleted) return;
    
    setSubmitted(true);
    
    if (!hasCalledCompletion && !isCompleted) {
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (isCompleted || submitted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : 'Answer Submitted!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great ear for music!' : 'Your answer has been recorded!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Audio Guessing Challenge</h3>
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
                <p className="text-xs text-gray-400">Placeholder for {audioUrl}</p>
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
    </div>
  );
};

export default AudioGuess;
