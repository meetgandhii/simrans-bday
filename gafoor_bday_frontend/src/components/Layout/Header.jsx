import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Car, Menu, X, User, LogOut, Trophy, Gift } from 'lucide-react';
import { formatPoints } from '../../utils/helpers';

const Header = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const menuItems = [
    { id: 'game', label: 'Game', icon: Car },
    { id: 'shop', label: 'Shop', icon: Gift },
    ...(isAdmin() ? [{ id: 'admin', label: 'Admin', icon: User }] : [])
  ];

  return (
    <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full">
              <Car className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Birthday Treasure Hunt</h1>
              <p className="text-xs text-red-200">Smooth Operator</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Score Display */}
            <div className="hidden sm:flex items-center space-x-2 bg-red-700 px-3 py-2 rounded-lg">
              <Trophy className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {formatPoints(user?.availablePoints || 0)} pts
              </span>
            </div>

            {/* User Name */}
            <div className="hidden sm:block">
              <span className="text-sm font-medium">
                {user?.name || 'Player'}
              </span>
            </div>

            {/* Logout Button - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-red-500 py-4">
            <div className="space-y-2">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onNavigate(id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors text-left"
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
              
              <div className="border-t border-red-500 pt-2 mt-2">
                <div className="px-4 py-2 text-sm text-red-200">
                  <div className="flex items-center justify-between">
                    <span>Points:</span>
                    <span className="font-semibold">
                      {formatPoints(user?.availablePoints || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Total Score:</span>
                    <span className="font-semibold">
                      {formatPoints(user?.totalScore || 0)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors text-left mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
