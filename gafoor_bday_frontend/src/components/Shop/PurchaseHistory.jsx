import React from 'react';
import { ShoppingCart, Calendar, Gift } from 'lucide-react';
import { formatPoints, formatDate } from '../../utils/helpers';

const PurchaseHistory = ({ purchases }) => {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchases yet</h3>
        <p className="text-gray-500">Start shopping to see your purchase history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Your Purchases ({purchases.length})
        </h3>
        
        <div className="space-y-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Gift Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  {purchase.gift.imageUrl ? (
                    <img
                      src={purchase.gift.imageUrl}
                      alt={purchase.gift.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <Gift className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>

              {/* Purchase Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-800 truncate">
                  {purchase.gift.name}
                </h4>
                <p className="text-sm text-gray-600 truncate">
                  {purchase.gift.description}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(purchase.purchasedAt)}</span>
                  </div>
                  <div className="text-sm font-semibold text-red-600">
                    -{formatPoints(purchase.pointsSpent)} points
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Purchased
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Purchase Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {purchases.length}
            </div>
            <div className="text-sm text-gray-500">Total Purchases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatPoints(purchases.reduce((total, purchase) => total + purchase.pointsSpent, 0))}
            </div>
            <div className="text-sm text-gray-500">Points Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
