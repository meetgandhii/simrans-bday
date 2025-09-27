import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import GameBoard from './components/GameBoard';
import ShopPage from './components/Shop/ShopPage';
import AdminPanel from './components/Admin/AdminPanel';
import Header from './components/Layout/Header';
import FloatingButtons from './components/Layout/FloatingButtons';
import CameraInterface from './components/Camera/CameraInterface';
import MapInterface from './components/Maps/MapInterface';
import { CLUES } from './utils/constants';
import './index.css';

const AppContent = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState('game');
  const [showCamera, setShowCamera] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentClue, setCurrentClue] = useState(null);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">F1 Birthday Hunt</h2>
          <p className="text-red-200">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleCameraOpen = () => {
    // Find current clue based on user progress
    const clue = CLUES.find(c => c.id === user.gameProgress.currentClue);
    setCurrentClue(clue);
    setShowCamera(true);
  };

  const handleMapOpen = () => {
    setShowMap(true);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'game':
        return <GameBoard />;
      case 'shop':
        return <ShopPage />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <GameBoard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} />
      
      <main className="pb-20">
        {renderCurrentPage()}
      </main>

      <FloatingButtons 
        onCameraOpen={handleCameraOpen}
        onMapOpen={handleMapOpen}
      />

      {showCamera && (
        <CameraInterface
          isOpen={showCamera}
          onClose={() => setShowCamera(false)}
          currentClue={currentClue}
        />
      )}

      {showMap && (
        <MapInterface
          isOpen={showMap}
          onClose={() => setShowMap(false)}
          currentClue={currentClue}
          userProgress={user.gameProgress}
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;