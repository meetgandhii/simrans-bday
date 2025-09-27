import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { gameAPI, shopAPI } from '../../services/api';
import { formatPoints } from '../../utils/helpers';
import { Users, Trophy, Gift, BarChart3, SkipForward } from 'lucide-react';
import UserManagement from './UserManagement';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    completedClues: 0,
    totalPurchases: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      loadStats();
    }
  }, [isAdmin]);

  const loadStats = async () => {
    try {
      // This would typically come from an admin API endpoint
      // For now, we'll use mock data
      setStats({
        totalUsers: 12,
        totalPoints: 4500,
        completedClues: 45,
        totalPurchases: 8
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedGifts = async () => {
    try {
      await shopAPI.seedGifts();
      alert('Gifts seeded successfully!');
    } catch (error) {
      console.error('Error seeding gifts:', error);
      alert('Failed to seed gifts');
    }
  };

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-red-200">Manage the F1 Birthday Hunt game</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'users'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'game'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Game</span>
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'shop'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>Shop</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPoints(stats.totalPoints)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <SkipForward className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Clues</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedClues}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Gift className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={handleSeedGifts}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <Gift className="w-8 h-8 text-gray-400 mb-2" />
                  <h4 className="font-semibold text-gray-800">Seed Gifts</h4>
                  <p className="text-sm text-gray-600">Add default gifts to the shop</p>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <Users className="w-8 h-8 text-gray-400 mb-2" />
                  <h4 className="font-semibold text-gray-800">Manage Users</h4>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </button>

                <button
                  onClick={() => setActiveTab('game')}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <Trophy className="w-8 h-8 text-gray-400 mb-2" />
                  <h4 className="font-semibold text-gray-800">Game Management</h4>
                  <p className="text-sm text-gray-600">Monitor game progress and clues</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && <UserManagement />}

        {/* Game Tab */}
        {activeTab === 'game' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Management</h3>
            <p className="text-gray-600">Game management features coming soon...</p>
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop Management</h3>
            <div className="space-y-4">
              <button
                onClick={handleSeedGifts}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Seed Default Gifts
              </button>
              <p className="text-gray-600">Shop management features coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
