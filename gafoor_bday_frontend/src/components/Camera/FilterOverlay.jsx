import React from 'react';
import { FILTER_POSITIONS } from '../../utils/constants';

const FilterOverlay = ({ clue }) => {
  if (!clue || !clue.snapchatFilter) return null;

  const { frameUrl, overlayText, position = 'bottom' } = clue.snapchatFilter;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Frame/Background Filter */}
      {frameUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ backgroundImage: `url(${frameUrl})` }}
        />
      )}

      {/* Overlay Text */}
      {overlayText && (
        <div className={`absolute ${FILTER_POSITIONS[position] || FILTER_POSITIONS.bottom} pointer-events-none`}>
          <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg text-center">
            <p className="text-sm font-bold whitespace-nowrap">
              {overlayText}
            </p>
          </div>
        </div>
      )}

      {/* F1 Checkered Pattern Overlay (if no custom frame) */}
      {!frameUrl && (
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #000 25%, transparent 25%), 
                linear-gradient(-45deg, #000 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #000 75%), 
                linear-gradient(-45deg, transparent 75%, #000 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FilterOverlay;
