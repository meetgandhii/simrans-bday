import React, { useState } from 'react';
import { Send, CheckCircle, Video, Play } from 'lucide-react';

const VideoGuess = ({ videoUrl, question, onComplete, isCompleted = false }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
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

  if (isCompleted || submitted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : 'Answer Submitted!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great observation!' : 'Your answer has been recorded!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Video Guessing Challenge</h3>
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
            placeholder="Guess the place/theme from this video"
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

export default VideoGuess;
