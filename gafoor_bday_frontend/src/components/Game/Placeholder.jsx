import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder = ({ description, onComplete, isCompleted = false }) => {
  if (isCompleted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Game Completed!</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
      <div className="mb-4">
        <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Game Coming Soon!</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <p className="text-sm text-gray-500">
          This game is still under development. For now, you can proceed to the next challenge!
        </p>
      </div>
      
      <button
        onClick={() => onComplete && onComplete()}
        className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Skip for Now
      </button>
    </div>
  );
};

export default Placeholder;
