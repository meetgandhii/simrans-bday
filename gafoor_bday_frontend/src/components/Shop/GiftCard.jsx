import React from 'react';
import { Gift, ShoppingCart, Lock } from 'lucide-react';
import { formatPoints } from '../../utils/helpers';

const GiftCard = ({ gift, userPoints, onPurchase }) => {
  const canAfford = userPoints >= gift.pointsCost;
  const isAvailable = gift.isAvailable && (gift.stock === -1 || gift.stock > 0);

  const handlePurchase = () => {
    if (canAfford && isAvailable) {
      onPurchase(gift._id);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl ${
      !isAvailable ? 'opacity-60' : ''
    }`}>
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
        {gift.imageUrl ? (
          <img
            src={gift.imageUrl}
            alt={gift.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Gift className="w-16 h-16 text-red-400" />
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{gift.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            gift.category === 'mystery' ? 'bg-purple-100 text-purple-800' :
            gift.category === 'food' ? 'bg-orange-100 text-orange-800' :
            gift.category === 'experience' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {gift.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {gift.description}
        </p>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-red-600">
              {formatPoints(gift.pointsCost)}
            </span>
            <span className="text-sm text-gray-500">points</span>
          </div>
          
          {gift.stock !== -1 && (
            <div className="text-sm text-gray-500">
              {gift.stock > 0 ? `${gift.stock} left` : 'Out of stock'}
            </div>
          )}
        </div>

        {/* Purchase Button */}
        <button
          onClick={handlePurchase}
          disabled={!canAfford || !isAvailable}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            canAfford && isAvailable
              ? 'bg-red-600 text-white hover:bg-red-700 transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {!isAvailable ? (
            <>
              <Lock className="w-5 h-5" />
              <span>Not Available</span>
            </>
          ) : !canAfford ? (
            <>
              <Lock className="w-5 h-5" />
              <span>Insufficient Points</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Purchase</span>
            </>
          )}
        </button>

        {/* Points needed indicator */}
        {!canAfford && isAvailable && (
          <div className="mt-2 text-center">
            <p className="text-sm text-gray-500">
              Need {formatPoints(gift.pointsCost - userPoints)} more points
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCard;
