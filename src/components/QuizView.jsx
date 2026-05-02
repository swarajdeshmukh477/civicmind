import React, { useState } from 'react';
import './QuizView.css';

const QUESTIONS = [
  {
    id: 1,
    question: "What is the minimum age to vote in Indian elections?",
    options: ["16 years", "18 years", "21 years", "25 years"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which constitutional body is responsible for conducting elections in India?",
    options: ["Supreme Court", "Parliament", "Election Commission of India", "NITI Aayog"],
    correct: 2,
  },
  {
    id: 3,
    question: "What does EPIC stand for in the context of voter ID?",
    options: [
      "Electors Photo Identity Card",
      "Election Process Identification Code",
      "Electronic Person Index Card",
      "Electoral Public Identity Certificate"
    ],
    correct: 0,
  },
  {
    id: 4,
    question: "How many members are directly elected to the Lok Sabha by the people of India?",
    options: ["250", "543", "552", "245"],
    correct: 1,
  },
  {
    id: 5,
    question: "What is the full form of VVPAT, the machine used along with EVMs?",
    options: [
      "Voter Verified Paper Audit Trail",
      "Voter Verified Portable Account Transfer",
      "Visual Voter Paper Action Tracker",
      "Voter Verified Public Audit Tool"
    ],
    correct: 0,
  },
];

const QuizView = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === QUESTIONS[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="quiz-view">
      <div className="quiz-container">
        <h2 className="view-title">Civic Quiz</h2>
        
        {showScore ? (
          <div className="score-card">
            <div className="score-circle">
              <span className="final-score">{score}</span>
              <span className="total-score">/ {QUESTIONS.length}</span>
            </div>
            <h3>Quiz Completed!</h3>
            <p>
              {score === QUESTIONS.length 
                ? "Excellent! You're a true CivicMind expert." 
                : score >= 3 
                ? "Good job! You have a solid understanding of Indian elections." 
                : "Keep learning! You can find more info in the Guide section."}
            </p>
            <button className="hero-btn primary-glow" onClick={resetQuiz}>
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <div className="question-card">
            <div className="quiz-header">
              <span className="question-count">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
              <div className="score-tracker">Score: {score}</div>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}></div>
            </div>

            <h3 className="question-text">{question.question}</h3>
            
            <div className="options-container">
              {question.options.map((option, index) => {
                let statusClass = '';
                if (isAnswered) {
                  if (index === question.correct) statusClass = 'correct';
                  else if (index === selectedOption) statusClass = 'incorrect';
                }

                return (
                  <button
                    key={index}
                    className={`option-btn ${selectedOption === index ? 'selected' : ''} ${statusClass}`}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                    {statusClass === 'correct' && <span className="status-icon">✓</span>}
                    {statusClass === 'incorrect' && <span className="status-icon">✗</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <button className="hero-btn primary-glow next-btn" onClick={nextQuestion}>
                <span>{currentQuestion === QUESTIONS.length - 1 ? 'Finish' : 'Next Question'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;
