import React from 'react';
import { Trophy, LogOut } from 'lucide-react';

const Header = ({ user, onLogout, totalScore }) => {
  return (
    <div className="bg-white shadow-md p-4 mb-6 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-f1-red flex items-center space-x-2">
            <span>🏎️</span>
            <span>Birthday Treasure Hunt</span>
          </h1>
          {user.isAdmin && (
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold">
              ADMIN
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-lg">{totalScore} pts</span>
          </div>
          <span className="text-gray-600">Welcome, {user.username || user.name}!</span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;