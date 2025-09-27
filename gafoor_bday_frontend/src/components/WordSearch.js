import React, { useState, useEffect, useCallback, useRef } from 'react';

const WordSearch = ({ onWordsFound, isCompleted = false }) => {
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragEnd, setDragEnd] = useState(null);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const gridRef = useRef(null);
  
  const wordsToFind = ['TRADER', 'JOES', 'BOYLSTON', 'CHIPS', 'JERK'];
  const gridSize = 12;

  const initGrid = useCallback(() => {
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    const placements = [
      { word: 'TRADER', row: 0, col: 2, direction: 'horizontal' },
      { word: 'JOES', row: 2, col: 4, direction: 'horizontal' },
      { word: 'BOYLSTON', row: 4, col: 1, direction: 'horizontal' },
      { word: 'CHIPS', row: 6, col: 3, direction: 'horizontal' },
      { word: 'JERK', row: 8, col: 5, direction: 'horizontal' }
    ];

    placements.forEach(({ word, row, col, direction }) => {
      for (let i = 0; i < word.length; i++) {
        if (direction === 'horizontal' && col + i < gridSize && row < gridSize) {
          newGrid[row][col + i] = word[i];
        } else if (direction === 'vertical' && row + i < gridSize && col < gridSize) {
          newGrid[row + i][col] = word[i];
        }
      }
    });

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (newGrid[i][j] === '') {
          newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    initGrid();
  }, [initGrid]);

  // If completed, mark all words as found
  useEffect(() => {
    if (isCompleted) {
      setFoundWords(wordsToFind);
    }
  }, [isCompleted]);

  const getCellsBetween = (start, end) => {
    const cells = [];
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    
    const rowDiff = endRow - startRow;
    const colDiff = endCol - startCol;
    
    // Only allow horizontal, vertical, or diagonal selections
    if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff)) {
      return [];
    }
    
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    
    for (let i = 0; i <= steps; i++) {
      const row = startRow + (i * rowStep);
      const col = startCol + (i * colStep);
      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        cells.push([row, col]);
      }
    }
    
    return cells;
  };

  const handleMouseDown = (e, row, col) => {
    if (isCompleted) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart([row, col]);
    setDragEnd([row, col]);
    setSelectedCells([[row, col]]);
  };

  const handleMouseMove = (e, row, col) => {
    if (!isDragging || !dragStart || isCompleted) return;
    
    e.preventDefault();
    setDragEnd([row, col]);
    const cells = getCellsBetween(dragStart, [row, col]);
    setSelectedCells(cells);
  };

  const handleMouseUp = (e) => {
    if (!isDragging || !dragStart || !dragEnd || isCompleted) return;
    
    e.preventDefault();
    setIsDragging(false);
    
    const word = selectedCells.map(([row, col]) => grid[row][col]).join('');
    
    if (wordsToFind.includes(word) && !foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      if (newFoundWords.length === wordsToFind.length && !hasCalledCompletion) {
        setHasCalledCompletion(true);
        setTimeout(() => {
          onWordsFound();
        }, 500);
      }
    }
    
    setSelectedCells([]);
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setSelectedCells([]);
      setDragStart(null);
      setDragEnd(null);
    }
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e, row, col) => {
    if (isCompleted) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart([row, col]);
    setDragEnd([row, col]);
    setSelectedCells([[row, col]]);
  };

  const handleTouchMove = (e, row, col) => {
    if (!isDragging || !dragStart || isCompleted) return;
    
    e.preventDefault();
    setDragEnd([row, col]);
    const cells = getCellsBetween(dragStart, [row, col]);
    setSelectedCells(cells);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || !dragStart || !dragEnd || isCompleted) return;
    
    e.preventDefault();
    setIsDragging(false);
    
    const word = selectedCells.map(([row, col]) => grid[row][col]).join('');
    
    if (wordsToFind.includes(word) && !foundWords.includes(word)) {
      const newFoundWords = [...foundWords, word];
      setFoundWords(newFoundWords);
      
      if (newFoundWords.length === wordsToFind.length && !hasCalledCompletion) {
        setHasCalledCompletion(true);
        setTimeout(() => {
          onWordsFound();
        }, 500);
      }
    }
    
    setSelectedCells([]);
    setDragStart(null);
    setDragEnd(null);
  };

  const isCellSelected = (row, col) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isWordFound = (row, col) => {
    const placements = [
      { word: 'TRADER', row: 0, col: 2 },
      { word: 'JOES', row: 2, col: 4 },
      { word: 'BOYLSTON', row: 4, col: 1 },
      { word: 'CHIPS', row: 6, col: 3 },
      { word: 'JERK', row: 8, col: 5 }
    ];

    return placements.some(({ word, row: wordRow, col: wordCol }) => {
      if (!foundWords.includes(word)) return false;
      return row === wordRow && col >= wordCol && col < wordCol + word.length;
    });
  };

  return (
    <div className="text-center bg-gray-50 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Find these words:</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {wordsToFind.map(word => (
            <span
              key={word}
              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                foundWords.includes(word) 
                  ? 'bg-green-500 line-through' 
                  : 'bg-f1-red'
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Drag your cursor/finger across letters to form words
        </p>
        <div 
          ref={gridRef}
          className="grid grid-cols-12 gap-1 max-w-lg mx-auto bg-white p-3 rounded select-none"
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isSelected = isCellSelected(rowIndex, colIndex);
              const isFound = isWordFound(rowIndex, colIndex);
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                    isFound 
                      ? 'bg-green-500 text-white' 
                      : isSelected 
                        ? 'bg-yellow-400 border-f1-red border-2' 
                        : 'bg-white hover:bg-gray-100'
                  } ${isCompleted ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                  onMouseMove={(e) => handleMouseMove(e, rowIndex, colIndex)}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchMove={(e) => handleTouchMove(e, rowIndex, colIndex)}
                  onTouchEnd={handleTouchEnd}
                >
                  {cell}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      <div className="flex justify-center space-x-2">
        <div className="text-sm text-gray-600 flex items-center">
          Found: {foundWords.length}/{wordsToFind.length} words
        </div>
      </div>
      
      {(foundWords.length === wordsToFind.length || isCompleted) && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg">
          <p className="text-green-800 font-medium">
            {isCompleted ? '✅ Clue completed!' : '🎉 All words found! Great job!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WordSearch;