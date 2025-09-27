import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { CheckCircle, Lock, MapPin } from 'lucide-react';
import L from 'leaflet';

const LocationMarker = ({ location, userProgress, userLocation }) => {
  const isCompleted = userProgress?.completedClues?.includes(location.clueNumber);
  const isCurrent = location.clueNumber === userProgress?.currentClue;
  const isLocked = location.clueNumber > userProgress?.currentClue;

  const getMarkerColor = () => {
    if (isCompleted) return 'green';
    if (isCurrent) return 'red';
    return 'gray';
  };

  const getMarkerIcon = () => {
    const color = getMarkerColor();
    
    if (color === 'green') {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                 </svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    } else if (color === 'red') {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg">
                 ${location.clueNumber}
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    } else {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-lg">
                 <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                   <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                 </svg>
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    }
  };

  return (
    <Marker
      position={[location.coordinates.latitude, location.coordinates.longitude]}
      icon={getMarkerIcon()}
    >
      <Popup>
        <div className="min-w-[200px]">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              getMarkerColor() === 'green' ? 'bg-green-500' :
              getMarkerColor() === 'red' ? 'bg-red-500' : 'bg-gray-400'
            }`} />
            <h3 className="font-semibold text-gray-800">
              Clue #{location.clueNumber}
            </h3>
          </div>
          
          <h4 className="font-medium text-gray-700 mb-1">
            {location.title}
          </h4>
          
          {location.address && (
            <p className="text-sm text-gray-600 mb-2">
              {location.address}
            </p>
          )}

          <div className="flex items-center space-x-2 text-sm">
            {isCompleted && (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </span>
            )}
            {isCurrent && (
              <span className="text-red-600 font-medium">
                Current Target
              </span>
            )}
            {isLocked && (
              <span className="text-gray-500 flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Locked
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default LocationMarker;
