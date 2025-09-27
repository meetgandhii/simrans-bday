import React, { useState } from 'react';
import { Camera, Map, X } from 'lucide-react';

const FloatingButtons = ({ onCameraOpen, onMapOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-3">
          <button
            onClick={() => {
              onCameraOpen();
              setIsExpanded(false);
            }}
            className="flex items-center space-x-3 bg-red-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
          >
            <Camera className="w-5 h-5" />
            <span className="text-sm font-medium">Camera</span>
          </button>
          
          <button
            onClick={() => {
              onMapOpen();
              setIsExpanded(false);
            }}
            className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            <Map className="w-5 h-5" />
            <span className="text-sm font-medium">Map</span>
          </button>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-red-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-white rounded-full mb-1"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        )}
      </button>

      {/* Quick Access Buttons (when collapsed) */}
      {!isExpanded && (
        <div className="absolute bottom-16 right-0 space-y-2">
          <button
            onClick={() => onCameraOpen()}
            className="bg-red-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            title="Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onMapOpen()}
            className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            title="Map"
          >
            <Map className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingButtons;
