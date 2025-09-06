"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types/quiz";
import Image from "next/image";

interface QuizComponentProps {
  questions: Question[];
  title: string;
}

// Toast notification function
const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const getToastIcon = (type: string) => {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type as keyof typeof icons] || icons.info;
  };
  
  toast.innerHTML = `
    <div class="toast-content">
      <span style="font-weight: bold; font-size: 1.2em;">${getToastIcon(type)}</span>
      <span>${message}</span>
    </div>
    <button class="toast-close">&times;</button>
  `;
  
  document.body.appendChild(toast);
  
  // Animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
  
  // Manual close
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    });
  }
};

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, title }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showJustification, setShowJustification] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [randomMode, setRandomMode] = useState(false);

  useEffect(() => {
    // Ask user about random mode
    const result = window.confirm("Do you want random questions and answers?");
    setRandomMode(result);
    
    if (result) {
      // Shuffle questions and their options
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const shuffledWithOptions = shuffled.map(question => ({
        ...question,
        options: [...question.options].sort(() => 0.5 - Math.random())
      }));
      setShuffledQuestions(shuffledWithOptions);
      showToast("You have chosen random questions and answers!", "info");
    } else {
      setShuffledQuestions(questions);
      showToast("You have chosen non-random questions and answers!", "info");
    }
  }, [questions]);

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem(`quiz-progress-${title}`);
    if (saved) {
      setCurrentQuestionIndex(parseInt(saved));
    }
  }, [title]);

  useEffect(() => {
    // Save progress
    localStorage.setItem(`quiz-progress-${title}`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, title]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerChange = (optionIndex: number) => {
    if (currentQuestion?.type === "radio") {
      setSelectedAnswers([optionIndex]);
    } else if (currentQuestion?.type === "checkbox") {
      setSelectedAnswers(prev => 
        prev.includes(optionIndex) 
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      );
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    if (selectedAnswers.length === 0) {
      showToast("Por favor, selecione uma resposta.", "warning");
      return;
    }

    let correct = false;
    
    if (currentQuestion.type === "radio") {
      correct = selectedAnswers[0] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "checkbox") {
      const correctAnswers = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer 
        : [currentQuestion.correctAnswer];
      correct = selectedAnswers.length === correctAnswers.length && 
                selectedAnswers.every(answer => correctAnswers.includes(answer));
    }

    setIsCorrect(correct);
    setShowJustification(true);
    
    showToast(correct ? "Resposta correta!" : "Resposta incorreta", correct ? "success" : "error");
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setShowJustification(false);
      setIsCorrect(false);
    } else {
      showToast("Você respondeu todas as perguntas!", "success");
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswers([]);
      setShowJustification(false);
      setIsCorrect(false);
    } else {
      showToast("Esta é a primeira pergunta!", "info");
    }
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="text-center">
          <div style={{ fontSize: '2em', margin: '20px 0' }}>⏳</div>
          <p>Carregando questões...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="text-center mt-5">
        <h1 style={{ color: '#495057', marginBottom: '30px' }}>{title}</h1>
      </div>
      
      {/* Progress Bar */}
      <div className="navigation-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
          <span className="progress-text">
            {currentQuestionIndex + 1} de {shuffledQuestions.length}
          </span>
        </div>
        
        <div className="navigation-buttons">
          {currentQuestionIndex > 0 && (
            <button 
              className="nav-btn secondary" 
              onClick={previousQuestion}
            >
              ← Anterior
            </button>
          )}
          
          <button 
            className="nav-btn check-answer" 
            onClick={checkAnswer}
          >
            ✓ Verificar Resposta
          </button>
          
          {currentQuestionIndex < shuffledQuestions.length - 1 && showJustification && (
            <button 
              className="nav-btn primary" 
              onClick={nextQuestion}
            >
              Próximo →
            </button>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <div className="question-number">
          Questão {currentQuestionIndex + 1}
        </div>
        
        <div className="question-text">
          {currentQuestion.question}
        </div>

        <div className="options-container">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isCorrectOption = showJustification && 
              (Array.isArray(currentQuestion.correctAnswer) 
                ? currentQuestion.correctAnswer.includes(index)
                : currentQuestion.correctAnswer === index);
            const isIncorrectSelected = showJustification && isSelected && !isCorrectOption;
            
            let optionClass = "option-item";
            if (isSelected) optionClass += " selected";
            if (isCorrectOption) optionClass += " correct";
            if (isIncorrectSelected) optionClass += " incorrect";

            return (
              <div 
                key={index} 
                className={optionClass}
                onClick={() => !showJustification && handleAnswerChange(index)}
                style={{ cursor: showJustification ? 'default' : 'pointer' }}
              >
                <input
                  type={currentQuestion.type}
                  name={`question-${currentQuestionIndex}`}
                  id={`option-${index}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => handleAnswerChange(index)}
                  style={{ display: 'none' }}
                  disabled={showJustification}
                />
                <label htmlFor={`option-${index}`} className="option-label">
                  <div className="option-indicator"></div>
                  <div className="option-text">{option}</div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showJustification && (
        <div className={`feedback-card ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            <div className="feedback-icon">
              {isCorrect ? '✓' : '✗'}
            </div>
            <h3>{isCorrect ? 'Correto!' : 'Incorreto'}</h3>
          </div>
          
          <div className="justification">
            <h4>💡 Explicação:</h4>
            <div className="justification-text">
              {currentQuestion.justification}
            </div>
          </div>
          
          {currentQuestion.referenceLinks && currentQuestion.referenceLinks.length > 0 && (
            <div className="references-section">
              <h4>🔗 Links de Referência:</h4>
              <ul className="reference-list">
                {currentQuestion.referenceLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Referência {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentQuestion.screenshots && currentQuestion.screenshots.length > 0 && (
            <div className="screenshots-container">
              <h2>📸 Screenshots</h2>
              <div>
                {currentQuestion.screenshots.map((screenshot, index) => (
                  <Image
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    width={600}
                    height={400}
                    className="screenshot"
                  />
                ))}
              </div>
            </div>
          )}

          {currentQuestion.videos && currentQuestion.videos.length > 0 && (
            <div className="video-container mt-3">
              <h2>🎥 Vídeo Explicativo</h2>
              <video controls className="w-100" style={{ borderRadius: '10px' }}>
                <source src={currentQuestion.videos[0]} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
