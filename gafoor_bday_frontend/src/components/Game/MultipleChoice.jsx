import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const MultipleChoice = ({ question, options, onComplete, isCompleted = false }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption || submitted || isCompleted) return;
    
    setSubmitted(true);
    
    if (!hasCalledCompletion && !isCompleted) {
      setHasCalledCompletion(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 1000);
    }
  };

  if (isCompleted || submitted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : 'Answer Submitted!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great choice!' : 'Your answer has been recorded!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Multiple Choice Challenge</h3>
        <p className="text-gray-600 mb-4">{question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
              selectedOption === option
                ? 'bg-red-100 border-red-500 text-red-800'
                : 'bg-white border-gray-300 hover:border-red-500 hover:bg-red-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || submitted}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-5 h-5" />
        <span>Submit Answer</span>
      </button>
    </div>
  );
};

export default MultipleChoice;
