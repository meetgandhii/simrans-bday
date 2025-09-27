import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy } from 'lucide-react';

const TriviaQuestion = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    if (selectedAnswer === question.correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setCompleted(true);
        onComplete && onComplete();
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
          <p className="text-gray-600">
            You scored {score} out of {questions.length} questions
          </p>
        </div>
        
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-red-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {Math.round((score / questions.length) * 100)}% correct
          </p>
        </div>

        <button
          onClick={resetQuiz}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">F1 Trivia</h3>
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        <div className="bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          {question.question}
        </h4>
        
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
            
            if (showResult) {
              if (index === question.correct) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (index === selectedAnswer && index !== question.correct) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-300 bg-gray-50 text-gray-600";
              }
            } else {
              if (selectedAnswer === index) {
                buttonClass += "border-red-600 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-300 hover:border-red-400 hover:bg-red-50";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={buttonClass}
                disabled={showResult}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && index === question.correct && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {showResult && index === selectedAnswer && index !== question.correct && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {!showResult && (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}

      {showResult && (
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">
            {selectedAnswer === question.correct ? (
              <span className="text-green-600">Correct! 🎉</span>
            ) : (
              <span className="text-red-600">Incorrect 😔</span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            {selectedAnswer === question.correct 
              ? "Great job! You know your F1 facts!"
              : `The correct answer was: ${question.options[question.correct]}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TriviaQuestion;
