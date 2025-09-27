import React, { useState } from 'react';

const TriviaQuestion = ({ onAnswer }) => {
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (answer) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(answer);
    
    if (answer === '6') {
      setTimeout(() => {
        onAnswer(true);
        alert('Correct! CARLOS has 6 letters... but wait! 6-2=4 letters...\n\nYour next stop: The swoosh store (NIKE) on Newbury Street!');
      }, 500);
    } else {
      onAnswer(false);
      setTimeout(() => {
        setAnswered(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const getButtonClass = (num) => {
    if (!answered) {
      return "p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-f1-red transition-all duration-200 cursor-pointer";
    }
    
    if (num === '6') {
      return "p-4 border-2 border-green-500 bg-green-100 rounded-lg";
    }
    
    if (selectedAnswer === num) {
      return "p-4 border-2 border-red-500 bg-red-100 rounded-lg";
    }
    
    return "p-4 border-2 border-gray-300 bg-gray-50 rounded-lg opacity-50";
  };

  return (
    <div className="text-center bg-blue-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4 text-blue-800">
        F1 Trivia Challenge
      </h3>
      <p className="text-xl mb-4 font-mono text-gray-800">
        55 • Smooth Operator • Spain • Ferrari
      </p>
      <p className="mb-6 text-gray-700">
        What do these have in common? They all relate to someone special... 
        and your next stop has the same number of letters as his first name!
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {['4', '5', '6', '7'].map(num => (
          <button
            key={num}
            onClick={() => handleAnswer(num)}
            className={getButtonClass(num)}
            disabled={answered}
          >
            <div className="font-bold text-lg">{num} letters</div>
            {answered && num === '6' && (
              <div className="text-green-600 text-sm mt-1">✓ Correct!</div>
            )}
            {answered && selectedAnswer === num && num !== '6' && (
              <div className="text-red-600 text-sm mt-1">✗ Try again</div>
            )}
          </button>
        ))}
      </div>
      
      {answered && selectedAnswer === '6' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            🎉 That's Carlos Sainz! Now head to the 4-letter store: NIKE!
          </p>
        </div>
      )}
    </div>
  );
};

export default TriviaQuestion;