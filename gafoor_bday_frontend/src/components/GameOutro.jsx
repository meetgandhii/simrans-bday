import React, { useState, useEffect } from 'react';
import { Trophy, Star, Heart, Gift, Sparkles } from 'lucide-react';

const GameOutro = ({ user, onRestart }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    
    // Show stats after a delay
    const timer = setTimeout(() => {
      setShowStats(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const finalImage = {
    src: "/images/outro-6.jpg", // Final birthday wishes image
    alt: "Final Birthday Wishes",
    title: "Final Birthday Wishes",
    description: "Happy Birthday! 🎂"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <span className="text-2xl">
                {['🎉', '🎊', '🎈', '🎁', '⭐', '💫', '✨'][Math.floor(Math.random() * 7)]}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Final Image Display */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <img
              src={finalImage.src}
              alt={finalImage.alt}
              className="w-full max-h-96 object-contain rounded-2xl shadow-xl"
              onError={(e) => {
                console.error('Final image failed to load:', finalImage.src);
                e.target.style.display = 'none';
              }}
            />
            <div className="mt-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {finalImage.title}
              </h2>
              <p className="text-xl text-white/90">
                {finalImage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Stats */}
        {showStats && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 mb-8">
            <div className="flex items-center justify-center mb-6">
              <Trophy className="w-12 h-12 text-yellow-400 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                🎉 CONGRATULATIONS! 🎉
              </h2>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-pink-300 mb-6">
              🎂 HAPPY BIRTHDAY SIMRAN! 🎂
            </h3>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Star className="w-8 h-8 text-yellow-400 mr-2" />
                  <span className="text-2xl font-bold text-white">
                    {user?.totalScore || 0}
                  </span>
                </div>
                <p className="text-white/80">Total Points Earned</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Heart className="w-8 h-8 text-red-400 mr-2" />
                  <span className="text-2xl font-bold text-white">
                    {user?.gameProgress?.completedClues?.length || 0}
                  </span>
                </div>
                <p className="text-white/80">Locations Visited</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <Gift className="w-8 h-8 text-purple-400 mr-2" />
                  <span className="text-2xl font-bold text-white">
                    {user?.gameProgress?.completedTasks?.length || 0}
                  </span>
                </div>
                <p className="text-white/80">Bonus Tasks Completed</p>
              </div>
            </div>

            {/* Achievement Message */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-6">
              <p className="text-2xl font-bold text-white">
                🏆 F1 Champion! 🏆
              </p>
              <p className="text-lg text-white/90 mt-2">
                You've completed the ultimate birthday treasure hunt!
              </p>
            </div>

            {/* Final Message */}
            <div className="text-center">
              <p className="text-xl text-white/90 mb-4">
                Time for sunset at Charles River! 🌅
              </p>
              <p className="text-lg text-white/80">
                Thank you for playing and making this birthday special!
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showStats && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Play Again</span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-lg font-bold py-3 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>🏠</span>
              <span>Go Home</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Decorative Elements */}
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
  );
};

export default GameOutro;
