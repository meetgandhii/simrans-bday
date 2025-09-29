import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';

const QuickQuiz = ({ questions, timeLimit, requiredCorrect, onComplete, isCompleted = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [hasCalledCompletion, setHasCalledCompletion] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    if (isCompleted) {
      setQuizCompleted(true);
      setScore(questions.length);
      return;
    }

    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizStarted && timeLeft === 0 && !quizCompleted) {
      setQuizCompleted(true);
      if (score >= requiredCorrect && !hasCalledCompletion) {
        setHasCalledCompletion(true);
        setTimeout(() => onComplete && onComplete(), 1000);
      }
    }
  }, [timeLeft, quizCompleted, score, requiredCorrect, hasCalledCompletion, questions.length, isCompleted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setShowSkipModal(false); // Close any open skip modal
    setSkipPassword(''); // Clear skip password
    // Ensure timer starts immediately
    setTimeLeft(timeLimit);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(timeLimit);
    setQuizCompleted(false);
    setHasCalledCompletion(false);
    setQuizStarted(false);
    setIsCorrect(null);
    setShowSkipModal(false); // Reset skip modal state
    setSkipPassword(''); // Clear skip password
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showResult || quizCompleted || isCompleted || !quizStarted) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || quizCompleted || isCompleted || !quizStarted) return;
    
    setShowResult(true);
    const isAnswerCorrect = selectedAnswer === questions[currentQuestion].correct;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(null);
      } else {
        setQuizCompleted(true);
        const finalScore = score + (isAnswerCorrect ? 1 : 0);
        if (finalScore >= requiredCorrect && !hasCalledCompletion) {
          setHasCalledCompletion(true);
          setTimeout(() => onComplete && onComplete(), 1000);
        }
      }
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setQuizCompleted(true);
      setScore(questions.length); // Perfect score
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

  const currentQ = questions[currentQuestion];

  if (quizCompleted || isCompleted) {
    const finalScore = isCompleted ? questions.length : score;
    const passed = finalScore >= requiredCorrect;
    
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${passed ? 'text-yellow-500' : 'text-gray-400'}`} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Quiz Completed!' : (passed ? 'Quiz Complete!' : 'Time\'s Up!')}
          </h3>
          <p className="text-gray-600 mb-4">
            {isCompleted ? `Final Score: ${finalScore}/${questions.length}` : `Final Score: ${finalScore}/${questions.length}`}
          </p>
          <p className={`text-lg font-medium ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed ? `✅ You passed! (Need ${requiredCorrect}+ correct)` : `❌ You need ${requiredCorrect}+ correct to pass`}
          </p>
          {!passed && !isCompleted && (
            <div className="mt-6">
              <button
                onClick={resetQuiz}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show start screen if quiz hasn't started
  if (!quizStarted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-6">
          <Clock className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Quick Quiz Challenge</h3>
          <p className="text-gray-600 mb-4">
            Answer {questions.length} questions correctly in {formatTime(timeLimit)} to pass!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You need to get {requiredCorrect}+ questions correct to complete this challenge.
          </p>
          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
            >
              🚀 Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-red-600" />
          <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-800'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          <div className="text-sm text-gray-600">
            Score: {score}/{questions.length}
          </div>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQ.correct;
            const isWrong = showResult && isSelected && !isCorrect;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult || quizCompleted}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  showResult
                    ? isCorrect
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : isWrong
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                    : isSelected
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-white border-gray-300 hover:border-red-500 hover:bg-red-50'
                } ${(showResult || quizCompleted) ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && (
                    <>
                      {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {isWrong && <XCircle className="w-5 h-5 text-red-600" />}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedAnswer !== null && !showResult && (
        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          Submit Answer
        </button>
      )}

      {showResult && (
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {selectedAnswer === currentQ.correct ? '✅ Correct!' : '❌ Wrong answer!'}
          </p>
          <p className="text-sm text-gray-500">
            {currentQuestion < questions.length - 1 ? 'Next question in 1.5s...' : 'Calculating final score...'}
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

export default QuickQuiz;
