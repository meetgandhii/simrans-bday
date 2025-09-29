import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle } from 'lucide-react';

const Slideshow = ({ images, onComplete, isCompleted = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    if (isPlaying && !isCompleted) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= images.length) {
            // Slideshow complete
            if (!hasCalledCompletion) {
              setHasCalledCompletion(true);
              setTimeout(() => {
                onComplete && onComplete();
              }, 1000);
            }
            return prevIndex;
          }
          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, images.length, isCompleted, hasCalledCompletion, onComplete]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= images.length) {
        // Slideshow complete
        if (!hasCalledCompletion && !isCompleted) {
          setHasCalledCompletion(true);
          setTimeout(() => {
            onComplete && onComplete();
          }, 1000);
        }
        return prevIndex;
      }
      return nextIndex;
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
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

  if (isCompleted || hasCalledCompletion) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Welcome Complete!
          </h3>
          <p className="text-gray-600">
            Ready to start your birthday treasure hunt adventure!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-4 sm:p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Welcome Slideshow</h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Slideshow
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Sit back and enjoy the intro! ({currentIndex + 1} of {images.length})
        </p>
      </div>

      {/* Slideshow Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
        {/* Image */}
        <div className="relative">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-64 sm:h-80 md:h-96 object-cover"
            onError={(e) => {
              console.error('Image failed to load:', images[currentIndex]);
              e.target.style.display = 'none';
            }}
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center space-x-4 mb-4">
        <button
          onClick={togglePlayPause}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        <button
          onClick={goToPrevious}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        
        <button
          onClick={goToNext}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Skip Slideshow Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skip Slideshow</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter password to skip the slideshow:
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
                Skip Slideshow
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

      <div className="text-center text-sm text-gray-500">
        Use controls to navigate or let it play automatically
      </div>
    </div>
  );
};

export default Slideshow;
