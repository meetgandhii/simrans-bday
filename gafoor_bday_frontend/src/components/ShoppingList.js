import React, { useState, useEffect } from 'react';

const ShoppingList = ({ items, onComplete, isCompleted = false }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');

  const handleCheck = (index) => {
    if (isCompleted) return;
    
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  // If completed, mark all items as checked
  useEffect(() => {
    if (isCompleted) {
      setCheckedItems(new Set(items.map((_, index) => index)));
    }
  }, [isCompleted]);

  useEffect(() => {
    if (checkedItems.size === items.length && !hasCalledCompletion && !isCompleted) {
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete();
        alert(`${getFirstLetters()}! All items collected! The first letters spell your next destination.`);
      }, 300);
    }
  }, [checkedItems.size, items.length, onComplete, hasCalledCompletion, isCompleted]);

  const getFirstLetters = () => {
    const firstLetters = items.map(item => item.charAt(0)).join('');
    return firstLetters;
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      // Mark all items as checked
      const allItemsChecked = new Set(items.map((_, index) => index));
      setCheckedItems(allItemsChecked);
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
      setShowSkipModal(false);
      setSkipPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleSkipKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSkipGame();
    }
  };

  return (
    <div className="bg-white border-2 border-f1-red rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">
          Shopping List Challenge
        </h3>
        <button
          onClick={() => setShowSkipModal(true)}
          className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
        >
          Skip Game
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Check all items to reveal the hidden message!
      </p>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center p-3 rounded transition-colors duration-200 ${
              checkedItems.has(index) ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={checkedItems.has(index)}
              onChange={() => handleCheck(index)}
              disabled={isCompleted}
              className={`mr-3 w-5 h-5 text-f1-red focus:ring-f1-red ${isCompleted ? 'opacity-50 cursor-default' : ''}`}
              id={`item-${index}`}
            />
            <label 
              htmlFor={`item-${index}`}
              className={`flex-1 ${isCompleted ? 'cursor-default' : 'cursor-pointer'} ${
                checkedItems.has(index) 
                  ? 'text-green-700 font-medium line-through' 
                  : 'text-gray-800'
              }`}
            >
              <span className="font-bold text-f1-red mr-2">
                {item.charAt(0)}
              </span>
              {item.slice(1)}
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          First letters: <span className="font-mono font-bold text-f1-red">
            {getFirstLetters()}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {checkedItems.size}/{items.length} items checked
        </div>
        
        {(checkedItems.size === items.length || isCompleted) && (
          <div className="mt-3 p-2 bg-green-100 border border-green-400 rounded-lg">
            <p className="text-green-800 font-medium text-sm">
              {isCompleted ? '✅ Clue completed!' : '🎉 N-I-K-E! All items collected!'}
            </p>
          </div>
        )}
      </div>

      {/* Skip Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skip This Game</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter password to skip this game:
            </p>
            <input
              type="password"
              value={skipPassword}
              onChange={(e) => setSkipPassword(e.target.value)}
              onKeyPress={handleSkipKeyPress}
              placeholder="Password: 5555"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSkipModal(false);
                  setSkipPassword('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSkipGame}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Skip Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;