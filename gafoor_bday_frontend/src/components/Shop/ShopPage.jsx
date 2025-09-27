import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { shopAPI } from '../../services/api';
import { formatPoints } from '../../utils/helpers';
import { Gift, ShoppingCart, Trophy, Star } from 'lucide-react';
import GiftCard from './GiftCard';
import PurchaseHistory from './PurchaseHistory';

const ShopPage = () => {
  const [gifts, setGifts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('shop');
  const { user, updateUser } = useAuth();

  useEffect(() => {
    loadGifts();
    loadPurchases();
  }, []);

  const loadGifts = async () => {
    try {
      const response = await shopAPI.getGifts();
      setGifts(response.data);
    } catch (error) {
      console.error('Error loading gifts:', error);
      setError('Failed to load gifts');
    }
  };

  const loadPurchases = async () => {
    try {
      const response = await shopAPI.getPurchases();
      setPurchases(response.data);
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (giftId) => {
    try {
      const response = await shopAPI.purchaseGift(giftId);
      
      // Update user points
      const updatedUser = {
        ...user,
        availablePoints: user.availablePoints - response.data.gift.pointsSpent
      };
      updateUser(updatedUser);
      
      // Reload gifts and purchases
      await loadGifts();
      await loadPurchases();
      
      // Show success message
      alert(`Successfully purchased ${response.data.gift.name}!`);
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.message || 'Failed to purchase gift');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gift Shop</h1>
              <p className="text-red-200">Spend your hard-earned points on amazing gifts!</p>
            </div>
            <div className="text-right">
              <div className="bg-red-700 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {formatPoints(user?.availablePoints || 0)}
                  </span>
                </div>
                <p className="text-sm text-red-200">Available Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
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
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Purchase History</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div>
            {gifts.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No gifts available</h3>
                <p className="text-gray-500">Check back later for new items!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gifts.map((gift) => (
                  <GiftCard
                    key={gift._id}
                    gift={gift}
                    userPoints={user?.availablePoints || 0}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <PurchaseHistory purchases={purchases} />
        )}
      </div>
    </div>
  );
};

export default ShopPage;
