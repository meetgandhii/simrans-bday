import React, { useState } from 'react';
import ImageSlideshow from './ImageSlideshow';

const GameIntro = ({ onStartGame }) => {
  const [showSlideshow, setShowSlideshow] = useState(true);

  const introImages = [
    {
      src: "/images/intro-1.jpg", // Birthday card image
      alt: "Happy Birthday Simran",
      title: "Happy Birthday, Simran!",
      description: "It's Your Special Day"
    },
    {
      src: "/images/intro-2.jpg", // Personalized birthday card
      alt: "24th Birthday Wishes",
      title: "Happy 24th Birthday, Simran Ramesh Patel!",
      description: "Wishing you an amazing year ahead filled with joy, success, and unforgettable moments."
    },
    {
      src: "/images/intro-3.jpg", // What's Next image
      alt: "What's Next",
      title: "What's Next?",
      description: "Get ready for an exciting adventure!"
    },
    {
      src: "/images/intro-4.jpg", // Support message
      alt: "We Are Here For You",
      title: "We Are Here For You",
      description: "No matter where life takes you, remember you've got family and friends who love and support you every step of the way."
    },
    {
      src: "/images/intro-5.jpg", // Adventure ahead
      alt: "Exciting Adventure Ahead",
      title: "Exciting Adventure Ahead",
      description: "7 locations. 7 surprises. 1 unforgettable day. Follow the clues, complete the challenges, and unlock each destination across Boston."
    }
  ];

  const handleSlideshowComplete = () => {
    setShowSlideshow(false);
  };

  if (showSlideshow) {
    return (
      <ImageSlideshow 
        images={introImages}
        onComplete={handleSlideshowComplete}
        title="Welcome to Your Birthday Adventure!"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* Animated Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
              🎉 Ready for Your Adventure? 🎉
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              Your birthday treasure hunt awaits!
            </p>
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">7 Locations</h3>
              <p className="text-white/80">Discover amazing places across Boston</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-xl font-bold text-white mb-2">7 Surprises</h3>
              <p className="text-white/80">Special treats and gifts at every stop</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-white mb-2">Challenges</h3>
              <p className="text-white/80">Fun games and puzzles to solve</p>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartGame}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl font-bold py-4 px-12 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
          >
            <span>🚀</span>
            <span>Start Your Adventure!</span>
            <span>🎂</span>
          </button>

          {/* Instructions */}
          <div className="mt-8 text-white/70">
            <p className="text-lg">
              Complete challenges, unlock locations, and collect points along the way!
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 text-yellow-300 animate-bounce">
          <span className="text-4xl">🎈</span>
        </div>
        <div className="absolute top-20 right-20 text-pink-300 animate-pulse">
          <span className="text-3xl">🎁</span>
        </div>
        <div className="absolute bottom-20 left-20 text-purple-300 animate-spin">
          <span className="text-2xl">🎊</span>
        </div>
        <div className="absolute bottom-10 right-10 text-red-300 animate-bounce">
          <span className="text-3xl">🎉</span>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;
