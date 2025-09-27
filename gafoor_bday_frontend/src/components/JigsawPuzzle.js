import React, { useState } from 'react';

const JigsawPuzzle = ({ onComplete }) => {
  const [carlosCompleted, setCarlosCompleted] = useState(false);
  const [catCompleted, setCatCompleted] = useState(false);
  const [activePuzzle, setActivePuzzle] = useState(null);

  const handlePuzzleComplete = (type) => {
    if (type === 'carlos' && !carlosCompleted) {
      setCarlosCompleted(true);
      alert('Perfect! Carlos victory celebration complete!\n\nThis reminds you of the Public Garden with its famous duck statues!');
      if (!catCompleted) {
        onComplete();
      }
    } else if (type === 'cat' && !catCompleted) {
      setCatCompleted(true);
      alert('Perfect! Cat puzzle complete!\n\nThis reminds you of the Public Garden with its famous duck statues!');
      if (!carlosCompleted) {
        onComplete();
      }
    }

    if (carlosCompleted && catCompleted) {
      // Both puzzles completed - bonus points
      setTimeout(() => {
        alert('Amazing! Both puzzles completed! Bonus points earned!');
      }, 1000);
    }
  };

  const PuzzleGrid = ({ type, isCompleted }) => {
    const [pieces, setPieces] = useState(
      Array.from({ length: 9 }, (_, i) => ({ id: i, position: null }))
    );
    const [availablePieces, setAvailablePieces] = useState(
      Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5)
    );

    const handlePieceClick = (pieceId) => {
      if (isCompleted) return;
      
      const emptySlot = pieces.findIndex(p => p.position === null);
      if (emptySlot !== -1) {
        const newPieces = [...pieces];
        newPieces[emptySlot] = { id: pieceId, position: emptySlot };
        setPieces(newPieces);
        
        setAvailablePieces(prev => prev.filter(id => id !== pieceId));
        
        // Check if puzzle is complete
        const isComplete = newPieces.every((piece, index) => 
          piece.position === index && piece.id === index
        );
        
        if (isComplete) {
          handlePuzzleComplete(type);
        }
      }
    };

    const resetPuzzle = () => {
      setPieces(Array.from({ length: 9 }, (_, i) => ({ id: i, position: null })));
      setAvailablePieces(Array.from({ length: 9 }, (_, i) => i).sort(() => Math.random() - 0.5));
    };

    return (
      <div className="bg-white p-4 rounded-lg border-2 border-gray-300">
        <h4 className="font-bold mb-3 text-center">
          {type === 'carlos' ? '🏆 Carlos Victory Puzzle' : '🐱 Mystery Cat Puzzle'}
        </h4>
        
        <div className="grid grid-cols-3 gap-1 w-48 h-48 mx-auto mb-4 border-2 border-gray-400">
          {pieces.map((piece, index) => (
            <div
              key={index}
              className={`border border-gray-300 flex items-center justify-center text-xs font-bold ${
                piece.position !== null 
                  ? (piece.id === index ? 'bg-green-200' : 'bg-red-200')
                  : 'bg-gray-100'
              }`}
            >
              {piece.position !== null && (
                <span>{type === 'carlos' ? '🏎️' : '🐱'}</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-3">
          {availablePieces.map(pieceId => (
            <button
              key={pieceId}
              onClick={() => handlePieceClick(pieceId)}
              className="w-12 h-12 bg-blue-200 border border-blue-400 rounded hover:bg-blue-300 text-xs font-bold"
              disabled={isCompleted}
            >
              {pieceId + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-center space-x-2">
          <button
            onClick={resetPuzzle}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            disabled={isCompleted}
          >
            Reset
          </button>
          <button
            onClick={() => handlePuzzleComplete(type)}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            {isCompleted ? 'Completed!' : 'Auto-Solve'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="text-center mb-4">
        <h3 className="font-bold text-gray-800 mb-3">🧩 Jigsaw Puzzle Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose a puzzle to solve and discover your next destination!
        </p>
        
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setActivePuzzle('carlos')}
            className={`px-4 py-2 rounded border-2 transition-colors ${
              activePuzzle === 'carlos' 
                ? 'border-f1-red bg-red-50 text-f1-red' 
                : 'border-gray-300 hover:border-f1-red'
            }`}
          >
            Carlos Puzzle 🏆
          </button>
          <button
            onClick={() => setActivePuzzle('cat')}
            className={`px-4 py-2 rounded border-2 transition-colors ${
              activePuzzle === 'cat' 
                ? 'border-purple-600 bg-purple-50 text-purple-600' 
                : 'border-gray-300 hover:border-purple-600'
            }`}
          >
            Mystery Cat Puzzle 🐱
          </button>
        </div>
      </div>

      {activePuzzle && (
        <div className="flex justify-center">
          <PuzzleGrid 
            type={activePuzzle} 
            isCompleted={
              activePuzzle === 'carlos' ? carlosCompleted : catCompleted
            } 
          />
        </div>
      )}

      <div className="text-center mt-4">
        <div className="text-sm text-gray-600">
          Progress: {(carlosCompleted ? 1 : 0) + (catCompleted ? 1 : 0)}/2 puzzles completed
        </div>
        {carlosCompleted && catCompleted && (
          <div className="text-green-600 font-bold mt-2">
            🎉 Both puzzles complete! Bonus points earned!
          </div>
        )}
      </div>
    </div>
  );
};

export default JigsawPuzzle;