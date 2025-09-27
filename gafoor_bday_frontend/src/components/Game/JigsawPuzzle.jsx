import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

const JigsawPuzzle = ({ imageUrl, onComplete, isCompleted = false }) => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const GRID_SIZE = 3; // 3x3 puzzle
  const PIECE_SIZE = 100;

  // Generate piece image URLs based on the base image name
  const getPieceImageUrl = (pieceId) => {
    const baseName = imageUrl.replace('/images/', '').replace(/\.[^/.]+$/, '');
    return `/images/${baseName}-piece-${pieceId}.jpg`;
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  // If completed, mark puzzle as solved
  useEffect(() => {
    if (isCompleted) {
      setCompleted(true);
      // Set all pieces to correct positions
      setPieces(prevPieces => 
        prevPieces.map(piece => ({
          ...piece,
          currentRow: piece.correctRow,
          currentCol: piece.correctCol
        }))
      );
    }
  }, [isCompleted]);

  const initializePuzzle = () => {
    const puzzlePieces = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isLastPiece = row === GRID_SIZE - 1 && col === GRID_SIZE - 1;
        
        puzzlePieces.push({
          id: `${row}-${col}`,
          correctRow: row,
          correctCol: col,
          currentRow: row,
          currentCol: col,
          isEmpty: isLastPiece,
          imageX: col * PIECE_SIZE,
          imageY: row * PIECE_SIZE
        });
      }
    }

    // Shuffle pieces (except the empty one)
    const shuffledPieces = [...puzzlePieces];
    for (let i = shuffledPieces.length - 2; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPieces[i].currentRow, shuffledPieces[i].currentCol] = 
      [shuffledPieces[j].currentRow, shuffledPieces[j].currentCol];
    }

    setPieces(shuffledPieces);
    setMoves(0);
    setCompleted(false);
  };

  const handlePieceClick = (piece) => {
    if (piece.isEmpty || completed || isCompleted) return;

    if (selectedPiece === null) {
      setSelectedPiece(piece);
    } else {
      // Try to move piece
      if (canMovePiece(selectedPiece, piece)) {
        movePiece(selectedPiece, piece);
        setMoves(moves + 1);
        checkCompletion();
      }
      setSelectedPiece(null);
    }
  };

  const canMovePiece = (fromPiece, toPiece) => {
    if (!toPiece.isEmpty) return false;

    const rowDiff = Math.abs(fromPiece.currentRow - toPiece.currentRow);
    const colDiff = Math.abs(fromPiece.currentCol - toPiece.currentCol);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const movePiece = (fromPiece, toPiece) => {
    setPieces(prevPieces => 
      prevPieces.map(piece => {
        if (piece.id === fromPiece.id) {
          return { ...piece, currentRow: toPiece.currentRow, currentCol: toPiece.currentCol, isEmpty: true };
        }
        if (piece.id === toPiece.id) {
          return { ...piece, currentRow: fromPiece.currentRow, currentCol: fromPiece.currentCol, isEmpty: false };
        }
        return piece;
      })
    );
  };

  const checkCompletion = () => {
    const isComplete = pieces.every(piece => 
      piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol
    );

    if (isComplete && !hasCalledCompletion && !isCompleted) {
      setCompleted(true);
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
    }
  };

  const renderPiece = (piece) => {
    const isSelected = selectedPiece && selectedPiece.id === piece.id;
    const isInCorrectPosition = piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol;

    return (
      <div
        key={piece.id}
        className={`w-24 h-24 border-2 transition-all duration-200 overflow-hidden relative ${
          piece.isEmpty 
            ? 'bg-gray-200 border-gray-300' 
            : isSelected 
              ? 'border-yellow-500 bg-yellow-100' 
              : isInCorrectPosition 
                ? 'border-green-500 bg-green-100' 
                : 'border-gray-400 bg-white hover:border-red-500'
        } ${(completed || isCompleted) ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={() => handlePieceClick(piece)}
      >
        {piece.isEmpty ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Empty
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={getPieceImageUrl(piece.id)}
              alt={`Puzzle piece ${piece.id}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Piece image failed to load:', getPieceImageUrl(piece.id));
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 hidden">
              {piece.id}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (completed || isCompleted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Puzzle Completed!' : 'Puzzle Complete!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'This puzzle has been solved!' : `You solved it in ${moves} moves!`}
          </p>
        </div>
        
        {!isCompleted && (
          <button
            onClick={initializePuzzle}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center mx-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Jigsaw Puzzle</h3>
        <p className="text-sm text-gray-600 mb-4">
          Click on a piece, then click on the empty space to move it. Complete the puzzle!
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Moves: {moves}</span>
          <button
            onClick={initializePuzzle}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {pieces.map(piece => renderPiece(piece))}
      </div>

      {selectedPiece && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Selected piece. Click on an adjacent empty space to move it.
          </p>
        </div>
      )}
    </div>
  );
};

export default JigsawPuzzle;
