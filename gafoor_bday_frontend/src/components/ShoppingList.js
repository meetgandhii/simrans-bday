import React, { useState, useEffect } from 'react';

const ShoppingList = ({ onComplete, isCompleted = false }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  
  const items = [
    'Dried mangoes',
    'Unsweetened coconut chips', 
    'Nuts (any kind)',
    'Kale chips (or your jerk/chili lime chips!)',
    'Italian sparkling water',
    'Naan crackers'
  ];

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
        alert('D-U-N-K-I-N! All items collected! The first letters spell your next destination.');
      }, 300);
    }
  }, [checkedItems.size, items.length, onComplete, hasCalledCompletion, isCompleted]);

  const getFirstLetters = () => {
    const firstLetters = items.map(item => item.charAt(0)).join('');
    return firstLetters;
  };

  return (
    <div className="bg-white border-2 border-f1-red rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-3 text-center">
        Shopping List Challenge
      </h3>
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
              {isCompleted ? '✅ Clue completed!' : '🎉 D-U-N-K-I-N! All items collected!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;