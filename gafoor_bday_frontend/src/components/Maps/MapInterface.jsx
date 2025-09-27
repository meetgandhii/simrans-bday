import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, CheckCircle, Lock, X } from 'lucide-react';
import { gameAPI } from '../../services/api';
import { getCurrentLocation, calculateDistance, formatDistance } from '../../utils/helpers';
import LocationMarker from './LocationMarker';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapInterface = ({ isOpen, onClose, currentClue, userProgress }) => {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadLocations();
      getCurrentUserLocation();
    }
  }, [isOpen]);

  const loadLocations = async () => {
    try {
      const response = await gameAPI.getLocations();
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
      setError('Failed to load locations');
    }
  };

  const getCurrentUserLocation = async () => {
    try {
      // Clear any cached location permission
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          if (permission.state === 'denied') {
            console.log('Location permission previously denied');
            setLoading(false);
            return;
          }
        } catch (permError) {
          console.log('Permission API not supported');
        }
      }

      const location = await getCurrentLocation();
      setUserLocation([location.latitude, location.longitude]);
    } catch (error) {
      console.error('Error getting location:', error);
      console.log('Using default Boston center');
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      // Force a fresh location request
      const location = await getCurrentLocation();
      setUserLocation([location.latitude, location.longitude]);
    } catch (error) {
      console.error('Location request failed:', error);
      alert('Location access denied. You can still use the map to see all game locations.');
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (location) => {
    if (userProgress?.completedClues?.includes(location.clueNumber)) {
      return 'green'; // Completed
    } else if (location.clueNumber === userProgress?.currentClue) {
      return 'red'; // Current
    } else {
      return 'gray'; // Locked
    }
  };

  const getMarkerIcon = (location) => {
    const color = getMarkerColor(location);
    
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

  if (!isOpen) return null;

  const center = userLocation || [42.3601, -71.0589]; // Default to Boston

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <MapPin className="w-6 h-6 text-red-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Game Map</h2>
            <p className="text-sm text-gray-600">Find your next destination</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!userLocation && (
            <button
              onClick={requestLocationPermission}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Enable Location
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  loadLocations();
                  getCurrentUserLocation();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Location */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  <div className="text-center">
                    <Navigation className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold">Your Location</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Game Locations */}
            {locations.map((location) => (
              <Marker
                key={location._id}
                position={[location.coordinates.latitude, location.coordinates.longitude]}
                icon={getMarkerIcon(location)}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        getMarkerColor(location) === 'green' ? 'bg-green-500' :
                        getMarkerColor(location) === 'red' ? 'bg-red-500' : 'bg-gray-400'
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

                    {userLocation && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Distance:</strong> {formatDistance(
                          calculateDistance(
                            userLocation[0], userLocation[1],
                            location.coordinates.latitude, location.coordinates.longitude
                          )
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm">
                      {getMarkerColor(location) === 'green' && (
                        <span className="text-green-600 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </span>
                      )}
                      {getMarkerColor(location) === 'red' && (
                        <span className="text-red-600 font-medium">
                          Current Target
                        </span>
                      )}
                      {getMarkerColor(location) === 'gray' && (
                        <span className="text-gray-500 flex items-center">
                          <Lock className="w-4 h-4 mr-1" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full" />
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-400 rounded-full" />
              <span>Locked</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className={userLocation ? 'text-green-600' : 'text-gray-500'}>
              {userLocation ? 'Location enabled' : 'Location disabled - Click Enable Location above'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapInterface;
