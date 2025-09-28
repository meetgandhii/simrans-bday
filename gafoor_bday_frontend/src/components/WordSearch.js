import React, { useState, useEffect, useCallback, useRef } from 'react';

const WordSearch = ({ words, onWordsFound, isCompleted = false }) => {
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [wordPlacements, setWordPlacements] = useState([]); // Track where each word is placed
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const gridRef = useRef(null);
  
  const wordsToFind = words || ['CHILI', 'LIME', 'CHIPS', 'GARLIC', 'DIP', 'VEGETABLE', 'ROOT', 'STRAWBERRY', 'POPCORN', 'CRUNCHY', 'OKRA', 'JERK', 'STYLE', 'PLANTAIN'];
  const gridSize = 16; // Larger grid to avoid overlaps

  const initGrid = useCallback(() => {
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const directions = ['horizontal', 'vertical', 'diagonal-down', 'diagonal-up'];
    const newPlacements = [];
    
    // Try to place each word randomly
    wordsToFind.forEach(word => {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        attempts++;
        
        // Random position and direction
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const maxRow = gridSize - (direction.includes('vertical') || direction.includes('diagonal') ? word.length : 0);
        const maxCol = gridSize - (direction.includes('horizontal') || direction.includes('diagonal') ? word.length : 0);
        
        const row = Math.floor(Math.random() * Math.max(1, maxRow));
        const col = Math.floor(Math.random() * Math.max(1, maxCol));
        
        const wordCells = [];
        let canPlace = true;
        
        // Check if word can be placed at this position
        for (let i = 0; i < word.length; i++) {
          let targetRow = row;
          let targetCol = col;
          
          switch (direction) {
            case 'horizontal':
              targetRow = row;
              targetCol = col + i;
              break;
            case 'vertical':
              targetRow = row + i;
              targetCol = col;
              break;
            case 'diagonal-down':
              targetRow = row + i;
              targetCol = col + i;
              break;
            case 'diagonal-up':
              targetRow = row - i;
              targetCol = col + i;
              break;
          }
          
          // Check bounds
          if (targetRow < 0 || targetRow >= gridSize || targetCol < 0 || targetCol >= gridSize) {
            canPlace = false;
            break;
          }
          
          // Check if cell is already occupied
          if (newGrid[targetRow][targetCol] !== '') {
            canPlace = false;
            break;
          }
          
          wordCells.push({ row: targetRow, col: targetCol });
        }
        
        // Place the word if it fits
        if (canPlace) {
          wordCells.forEach(({ row, col }, i) => {
            newGrid[row][col] = word[i];
          });
          
          newPlacements.push({
            word,
            direction,
            cells: wordCells
          });
          
          placed = true;
        }
      }
      
      // If word couldn't be placed, try placing it anyway (overlap allowed for difficult placement)
      if (!placed) {
        console.warn(`Could not place word "${word}" without overlap, placing anyway`);
        const direction = 'horizontal';
        const row = Math.floor(Math.random() * (gridSize - word.length));
        const col = Math.floor(Math.random() * (gridSize - word.length));
        
        const wordCells = [];
        for (let i = 0; i < word.length; i++) {
          const targetRow = row;
          const targetCol = col + i;
          newGrid[targetRow][targetCol] = word[i];
          wordCells.push({ row: targetRow, col: targetCol });
        }
        
        newPlacements.push({
          word,
          direction,
          cells: wordCells
        });
      }
    });

    // Fill empty cells with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    setGrid(newGrid);
    setWordPlacements(newPlacements);
    setFoundWords([]); // Reset found words for new grid
    setHasCalledCompletion(false);
    setShowSkipModal(false);
    setSkipPassword('');
    
    // Debug: Log placed words
    console.log('Words placed in grid:', newPlacements.map(p => `${p.word} (${p.direction})`));
  }, [gridSize, wordsToFind]);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // If completed, mark all words as found
  useEffect(() => {
    if (isCompleted) {
      setFoundWords(wordsToFind);
    }
  }, [isCompleted, wordsToFind]);

  const checkWord = useCallback((startRow, startCol, endRow, endCol) => {
    // Check if selection is valid (straight line)
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    const isDiagonalDown = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff * colDiff > 0;
    const isDiagonalUp = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff * colDiff < 0;
    
    // Debug logging
    if (Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff !== 0 && colDiff !== 0) {
      console.log(`Diagonal detection: rowDiff=${rowDiff}, colDiff=${colDiff}, isDiagonalDown=${isDiagonalDown}, isDiagonalUp=${isDiagonalUp}`);
    }

    if (!isHorizontal && !isVertical && !isDiagonalDown && !isDiagonalUp) {
      return null;
    }

    // Build the word from selection
    let word = '';
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

    for (let i = 0; i < steps; i++) {
      let row, col;
      if (isHorizontal) {
        row = startRow;
        col = startCol + (colDiff > 0 ? i : -i);
      } else if (isVertical) {
        row = startRow + (rowDiff > 0 ? i : -i);
        col = startCol;
      } else if (isDiagonalDown) {
        // Diagonal down (top-left to bottom-right or bottom-right to top-left)
        row = startRow + (rowDiff > 0 ? i : -i);
        col = startCol + (colDiff > 0 ? i : -i);
      } else if (isDiagonalUp) {
        // Diagonal up (bottom-left to top-right or top-right to bottom-left)
        row = startRow + (rowDiff > 0 ? i : -i);
        col = startCol + (colDiff > 0 ? i : -i);
      }

      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        word += grid[row][col];
      }
    }

    // Check both forward and reverse
    const forwardWord = word;
    const reverseWord = word.split('').reverse().join('');

    // Check if word matches any of the words to find
    const foundWord = wordsToFind.find(w => 
      forwardWord === w || reverseWord === w
    );

    return foundWord;
  }, [grid, wordsToFind, gridSize]);

  const handleCellStart = (row, col) => {
    if (isCompleted) return;
    setIsDragging(true);
    setDragStart({ row, col });
    setSelectedCells([{ row, col }]);
  };

  const handleCellMove = (row, col) => {
    if (!isDragging || isCompleted) return;
    setDragEnd({ row, col });
    
    const startRow = dragStart.row;
    const startCol = dragStart.col;
    const rowDiff = row - startRow;
    const colDiff = col - startCol;
    
    const isHorizontal = rowDiff === 0;
    const isVertical = colDiff === 0;
    const isDiagonalDown = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff * colDiff > 0;
    const isDiagonalUp = Math.abs(rowDiff) === Math.abs(colDiff) && rowDiff * colDiff < 0;

    if (isHorizontal || isVertical || isDiagonalDown || isDiagonalUp) {
      const newSelection = [];
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1;

      for (let i = 0; i < steps; i++) {
        let targetRow, targetCol;
        if (isHorizontal) {
          targetRow = startRow;
          targetCol = startCol + (colDiff > 0 ? i : -i);
        } else if (isVertical) {
          targetRow = startRow + (rowDiff > 0 ? i : -i);
          targetCol = startCol;
        } else if (isDiagonalDown) {
          // Diagonal down (top-left to bottom-right or bottom-right to top-left)
          targetRow = startRow + (rowDiff > 0 ? i : -i);
          targetCol = startCol + (colDiff > 0 ? i : -i);
        } else if (isDiagonalUp) {
          // Diagonal up (bottom-left to top-right or top-right to bottom-left)
          targetRow = startRow + (rowDiff > 0 ? i : -i);
          targetCol = startCol + (colDiff > 0 ? i : -i);
        }

        if (targetRow >= 0 && targetRow < gridSize && targetCol >= 0 && targetCol < gridSize) {
          newSelection.push({ row: targetRow, col: targetCol });
        }
      }
      setSelectedCells(newSelection);
    }
  };

  const handleCellEnd = () => {
    if (!isDragging || isCompleted) return;
    setIsDragging(false);

    if (dragStart && dragEnd) {
      const foundWord = checkWord(dragStart.row, dragStart.col, dragEnd.row, dragEnd.col);
      
      if (foundWord && !foundWords.includes(foundWord)) {
        setFoundWords(prev => [...prev, foundWord]);
        
        // Check if all words are found
        if (foundWords.length + 1 === wordsToFind.length && !hasCalledCompletion) {
          setHasCalledCompletion(true);
          setTimeout(() => {
            onWordsFound && onWordsFound();
          }, 1000);
        }
      }
    }

    setSelectedCells([]);
    setDragStart(null);
    setDragEnd(null);
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  const isCellPartOfFoundWord = (row, col) => {
    // Check if this cell is part of any found word
    return wordPlacements.some(placement => 
      foundWords.includes(placement.word) && 
      placement.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setFoundWords(wordsToFind); // Mark all words as found
      setHasCalledCompletion(true);
      setTimeout(() => {
        onWordsFound && onWordsFound();
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
    <div className="bg-white border-2 border-red-600 rounded-lg p-3 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Word Search Challenge</h3>
        <p className="text-sm text-gray-600 mb-4">
          Find all the words! They can be horizontal, vertical, or diagonal.
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Found: {foundWords.length}/{wordsToFind.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSkipModal(true)}
              className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
            >
              Skip Game
            </button>
            <button
              onClick={initGrid}
              className="text-sm text-red-600 hover:text-red-700"
            >
              New Grid
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-0.5 sm:gap-1 mb-4 overflow-x-auto select-none" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, touchAction: 'none' }}>
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-6 h-6 sm:w-8 sm:h-8 border border-gray-300 flex items-center justify-center text-xs sm:text-sm font-bold cursor-pointer select-none touch-none
                ${isCellSelected(rowIndex, colIndex) 
                  ? 'bg-red-200 border-red-500 text-red-800' 
                  : isCellPartOfFoundWord(rowIndex, colIndex)
                    ? 'bg-green-200 border-green-500 text-green-800'
                    : 'bg-white hover:bg-gray-50 active:bg-gray-100'
                }
                ${isCompleted ? 'cursor-default' : ''}
              `}
              onMouseDown={() => handleCellStart(rowIndex, colIndex)}
              onMouseEnter={() => handleCellMove(rowIndex, colIndex)}
              onMouseUp={handleCellEnd}
              onTouchStart={(e) => {
                e.preventDefault();
                handleCellStart(rowIndex, colIndex);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element && element.dataset.row && element.dataset.col) {
                  handleCellMove(parseInt(element.dataset.row), parseInt(element.dataset.col));
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleCellEnd();
              }}
              data-row={rowIndex}
              data-col={colIndex}
            >
              {letter}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Words to Find:</h4>
          <div className="space-y-1">
            {wordsToFind.map(word => (
              <div
                key={word}
                className={`px-2 py-1 rounded ${
                  foundWords.includes(word)
                    ? 'bg-green-100 text-green-800 line-through'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Found Words:</h4>
          <div className="space-y-1">
            {foundWords.length > 0 ? (
              foundWords.map(word => (
                <div key={word} className="px-2 py-1 rounded bg-green-100 text-green-800">
                  ✓ {word}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No words found yet...</div>
            )}
          </div>
        </div>
      </div>

      {foundWords.length === wordsToFind.length && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            🎉 All words found! Great job!
          </p>
        </div>
      )}

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

export default WordSearch;