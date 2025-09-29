import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Sparkles, Heart, Gift } from 'lucide-react';

const ImageSlideshow = ({ images, onComplete, title = "Welcome to Your Birthday Adventure!" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  }, [currentIndex, images.length, onComplete]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentIndex]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-4">
        {/* Image Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Image */}
          <div className={`relative transition-all duration-500 ${isTransitioning ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="w-full h-auto max-h-[70vh] object-contain"
              onError={(e) => {
                console.error('Image failed to load:', currentImage.src);
                e.target.style.display = 'none';
              }}
            />
            
            {/* Overlay with title and description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                  {currentImage.title || title}
                </h2>
                {currentImage.description && (
                  <p className="text-lg text-center text-white/90">
                    {currentImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          {showControls && (
            <>
              {/* Previous Button */}
              {currentIndex > 0 && (
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              )}

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
              >
                {currentIndex === images.length - 1 ? (
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                )}
              </button>
            </>
          )}

          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : index < currentIndex 
                      ? 'bg-white/60' 
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6 text-white/80">
          <p className="text-lg">
            {currentIndex === images.length - 1 
              ? "Click the play button or press space to start your adventure!" 
              : "Use arrow keys or click the buttons to navigate"
            }
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 text-yellow-300 animate-spin">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute -bottom-10 -right-10 text-pink-300 animate-bounce">
          <Heart className="w-8 h-8" />
        </div>
        <div className="absolute top-1/2 -left-16 text-purple-300 animate-pulse">
          <Gift className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default ImageSlideshow;
