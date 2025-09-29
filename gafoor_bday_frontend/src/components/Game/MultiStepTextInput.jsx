import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { gameAPI } from '../../services/api';

const MultiStepTextInput = ({ 
  stepId, 
  gameId, 
  steps, 
  onComplete, 
  isCompleted = false 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stepResults, setStepResults] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [skipPassword, setSkipPassword] = useState('');

  // Load existing progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await gameAPI.getGameStepProgress(stepId, gameId);
        const progress = response.data.stepProgress;
        
        // Set completed steps
        const completedSteps = {};
        Object.keys(progress).forEach(stepIndex => {
          if (progress[stepIndex].isCorrect) {
            completedSteps[stepIndex] = true;
          }
        });
        setStepResults(completedSteps);
        
        // Set current step to first incomplete step
        const firstIncomplete = steps.findIndex((_, index) => !completedSteps[index]);
        if (firstIncomplete !== -1) {
          setCurrentStepIndex(firstIncomplete);
        } else {
          // All steps completed
          setCurrentStepIndex(steps.length);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };

    if (!isCompleted) {
      loadProgress();
    }
  }, [stepId, gameId, steps, isCompleted]);

  const currentStep = steps[currentStepIndex];
  const currentAnswer = answers[currentStepIndex] || '';
  const isCurrentStepCompleted = stepResults[currentStepIndex];
  const allStepsCompleted = Object.keys(stepResults).length === steps.length;

  const handleAnswerChange = (stepIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [stepIndex]: value
    }));
  };

  const handleSubmitStep = async () => {
    if (!currentAnswer.trim() || isSubmitting || isCurrentStepCompleted) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await gameAPI.validateGameStep(
        stepId, 
        gameId, 
        currentStepIndex, 
        currentAnswer, 
        currentStep.correctAnswer
      );
      
      const { isCorrect } = response.data;
      
      if (isCorrect) {
        setStepResults(prev => ({
          ...prev,
          [currentStepIndex]: true
        }));
        
        // Move to next step after a short delay
        setTimeout(() => {
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
          } else {
            // All steps completed, call onComplete
            onComplete && onComplete();
          }
        }, 1500);
      } else {
        // Show error message briefly
        setTimeout(() => {
          setIsSubmitting(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error validating step:', error);
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmitStep();
    }
  };

  const handleSkipGame = () => {
    if (skipPassword === 'jainish') {
      setStepResults(prev => {
        const allCompleted = {};
        steps.forEach((_, index) => {
          allCompleted[index] = true;
        });
        return allCompleted;
      });
      setCurrentStepIndex(steps.length);
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

  const handleRetryStep = () => {
    setAnswers(prev => ({
      ...prev,
      [currentStepIndex]: ''
    }));
    setIsSubmitting(false);
  };

  if (isCompleted || allStepsCompleted) {
    return (
      <div className="bg-white border-2 border-red-600 rounded-lg p-6 text-center">
        <div className="mb-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCompleted ? 'Challenge Completed!' : 'All Steps Completed!'}
          </h3>
          <p className="text-gray-600">
            {isCompleted ? 'Great job on this challenge!' : 'Excellent work! You completed all steps!'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-600 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">
            Step {currentStepIndex + 1} of {steps.length}
          </h3>
          <button
            onClick={() => setShowSkipModal(true)}
            className="text-sm text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-300 rounded"
          >
            Skip Game
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  stepResults[index] 
                    ? 'bg-green-500 text-white' 
                    : index === currentStepIndex 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepResults[index] ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 ${
                    stepResults[index] ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 mb-4 whitespace-pre-line">
          {currentStep.question}
        </p>

        {/* Display options if provided */}
        {currentStep.options && currentStep.options.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentStep.options.map((option, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                  <span className="text-gray-700 font-medium">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(currentStepIndex, e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            rows={4}
            disabled={isSubmitting || isCurrentStepCompleted}
          />
        </div>

        {isSubmitting && !isCurrentStepCompleted && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-red-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
              <span>Validating...</span>
            </div>
          </div>
        )}

        {!isSubmitting && !isCurrentStepCompleted && (
          <button
            onClick={handleSubmitStep}
            disabled={!currentAnswer.trim()}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>Submit Answer</span>
          </button>
        )}

        {isCurrentStepCompleted && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Correct! Moving to next step...</span>
            </div>
            {currentStepIndex < steps.length - 1 && (
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <ArrowRight className="w-4 h-4" />
                <span>Step {currentStepIndex + 2} of {steps.length}</span>
              </div>
            )}
          </div>
        )}

        {isSubmitting && !isCurrentStepCompleted && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>Incorrect answer. Try again!</span>
            </div>
            <button
              onClick={handleRetryStep}
              className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500 text-center">
        Press Enter or click Submit to send your answer
      </div>

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

export default MultiStepTextInput;
