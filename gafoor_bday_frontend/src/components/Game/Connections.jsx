import React, { useState } from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';

const Connections = ({ categories, items: allItems, onComplete, isCompleted = false }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [completedCategories, setCompletedCategories] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');

  // Randomize items on component mount
  const [items] = useState(() => {
    return [...allItems].sort(() => Math.random() - 0.5);
  });

  const handleItemClick = (item) => {
    if (gameCompleted || isCompleted) return;
    
    if (selectedItems.includes(item.text)) {
      setSelectedItems(selectedItems.filter(i => i !== item.text));
    } else if (selectedItems.length < 4) {
      setSelectedItems([...selectedItems, item.text]);
    }
  };

  const checkSelection = () => {
    if (selectedItems.length !== 4) return;

    const selectedCategories = selectedItems.map(item => 
      items.find(i => i.text === item)?.category
    );

    if (selectedCategories.every(cat => cat === selectedCategories[0])) {
      const categoryIndex = selectedCategories[0];
      if (!completedCategories.includes(categoryIndex)) {
        setCompletedCategories([...completedCategories, categoryIndex]);
        setSelectedItems([]);
        
        if (completedCategories.length + 1 === categories.length) {
          setGameCompleted(true);
          if (!hasCalledCompletion && !isCompleted) {
            setHasCalledCompletion(true);
            setTimeout(() => onComplete && onComplete(), 1000);
          }
        }
      }
    } else {
      setSelectedItems([]);
    }
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setGameCompleted(true);
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

  const getItemStyle = (item) => {
    const isSelected = selectedItems.includes(item.text);
    const isCompleted = completedCategories.includes(item.category);
    
    if (isCompleted) {
      return 'bg-green-100 border-green-500 text-green-800 opacity-60';
    }
    if (isSelected) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-white border-gray-300 hover:border-red-500 hover:bg-red-50';
  };

  if (isCompleted || gameCompleted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Connections Complete!' : 'Congratulations!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'You found all the connections!' : 'You found all 4 connections!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Connections Game</h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Find groups of four items that share something in common. Select 4 items and click "Check" to see if they're connected.
        </p>
      </div>

      {/* Completed Categories */}
      {completedCategories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Completed Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {completedCategories.map(catIndex => (
              <span key={catIndex} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {categories[catIndex]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {items.map((item, index) => {
          const isCompleted = completedCategories.includes(item.category);
          const isSelected = selectedItems.includes(item.text);
          
          if (isCompleted) return null;
          
          return (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              disabled={gameCompleted || isCompleted}
              className={`p-3 text-left border-2 rounded-lg transition-all duration-200 ${getItemStyle(item)} ${
                (gameCompleted || isCompleted) ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {item.text}
            </button>
          );
        })}
      </div>

      {/* Selection Status */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Selected: {selectedItems.length}/4
        </p>
      </div>

      {/* Check Button */}
      <button
        onClick={checkSelection}
        disabled={selectedItems.length !== 4 || gameCompleted || isCompleted}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Check Selection
      </button>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Select 4 items that belong to the same category
      </div>

      {/* Skip Game Modal */}
      {showSkipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skip Game</h3>
            <p className="text-sm text-gray-600 mb-4">
              Enter password to skip this game:
            </p>
            <input
              type="password"
              value={skipPassword}
              onChange={(e) => setSkipPassword(e.target.value)}
              onKeyPress={handleSkipKeyPress}
              placeholder="Password: 5555"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSkipGame}
                className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
              >
                Skip Game
              </button>
              <button
                onClick={() => {
                  setShowSkipModal(false);
                  setSkipPassword('');
                }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
