import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, Download, RotateCcw, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { photosAPI } from '../../services/api';
import { getCurrentLocation, compressImage } from '../../utils/helpers';
import FilterOverlay from './FilterOverlay';

const CameraInterface = ({ isOpen, onClose, currentClue }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front, 'environment' for back
  const webcamRef = useRef(null);
  const { user } = useAuth();

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setError('');
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleSavePhoto = async () => {
    if (!capturedImage || !currentClue) return;

    setLoading(true);
    setError('');

    try {
      // Try to get current location, but don't fail if denied
      let userLocation = null;
      try {
        userLocation = await getCurrentLocation();
        setLocation(userLocation);
      } catch (locationError) {
        console.warn('Geolocation denied or failed:', locationError);
        // Continue without location
      }

      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();

      // Compress image
      const compressedBlob = await compressImage(blob);

      // Create form data
      const formData = new FormData();
      formData.append('photo', compressedBlob, 'photo.jpg');
      formData.append('clueNumber', currentClue.id);
      
      // Add location if available
      if (userLocation) {
        formData.append('latitude', userLocation.latitude);
        formData.append('longitude', userLocation.longitude);
      } else {
        // Use default Boston coordinates if no location
        formData.append('latitude', 42.3601);
        formData.append('longitude', -71.0589);
      }

      // Upload photo
      const result = await photosAPI.uploadPhoto(formData);
      
      if (result.data) {
        // Success - close camera and show success message
        onClose();
        alert('Photo saved successfully!');
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      setError('Failed to save photo. Please try again.');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Camera</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera/Image Display */}
        <div className="relative bg-black">
          {!capturedImage ? (
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-64 object-cover"
              />
              
              {/* Filter Overlay */}
              <FilterOverlay clue={currentClue} />
              
              {/* Camera Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={switchCamera}
                  className="bg-white bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <RotateCcw className="w-6 h-6 text-gray-800" />
                </button>
                
                <button
                  onClick={capture}
                  className="bg-white p-4 rounded-full hover:bg-gray-100 transition-all"
                >
                  <Camera className="w-8 h-8 text-gray-800" />
                </button>
                
                <button
                  onClick={onClose}
                  className="bg-white bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-64 object-cover"
              />
              
              {/* Filter Overlay on captured image */}
              <FilterOverlay clue={currentClue} />
              
              {/* Image Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={retake}
                  className="bg-white bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <RotateCcw className="w-6 h-6 text-gray-800" />
                </button>
                
                <button
                  onClick={handleSavePhoto}
                  disabled={loading}
                  className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-8 h-8" />
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="bg-white bg-opacity-80 p-3 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {currentClue && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Clue #{currentClue.id}: {currentClue.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {currentClue.description}
              </p>
              {currentClue.bonusTask && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Bonus:</strong> {currentClue.bonusTask}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
            </div>
          )}

          {!location && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Location: Not available</span>
              </div>
              <button
                onClick={async () => {
                  try {
                    const loc = await getCurrentLocation();
                    setLocation(loc);
                  } catch (error) {
                    console.warn('Location still denied:', error);
                  }
                }}
                className="text-blue-600 hover:text-blue-700 text-xs underline"
              >
                Enable Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraInterface;
