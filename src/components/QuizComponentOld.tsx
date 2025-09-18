"use client";

import { useState } from "react";
import { useQuiz } from '@/hooks/useQuiz';
import { ApiQuestion, QuizResults, ReferenceLink, VideoResource } from '@/services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import QuizResultsComponent from './QuizResults';
import Image from "next/image";

interface QuizComponentProps {
  quizSetId: string;
  options?: {
    shuffle?: boolean;
    autoSave?: boolean;
    timeLimit?: boolean;
  };
}

// Toast notification function with enhanced styling
const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const getToastIcon = (type: string) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type as keyof typeof icons] || icons.info;
  };
  
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${getToastIcon(type)}</span>
      <span class="toast-message">${message}</span>
    </div>
    <button class="toast-close">&times;</button>
  `;
  
  document.body.appendChild(toast);
  
  // Animation
  setTimeout(() => toast.classList.add('show'), 100);
  
  // Auto remove
  const autoRemoveTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 4000);
  
  // Manual close
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoRemoveTimer);
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    });
  }
};

const QuizComponent: React.FC<QuizComponentProps> = ({ 
  quizSetId, 
  options = { shuffle: true, autoSave: true, timeLimit: true }
}) => {
  const {
    quizSet,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    progressPercentage,
    timeSpent,
    answers,
    loading,
    error,
    quizCompleted,
    canSubmit,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    submitQuiz,
    resetQuiz,
  } = useQuiz(quizSetId, options);

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showJustification, setShowJustification] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [showHints, setShowHints] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeRemaining && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            setTimerActive(false);
            showToast("Tempo esgotado! A resposta será verificada automaticamente.", "warning");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    // Validate questions on load
    const report = QuestionAnalytics.generateReport(questions);
    console.log('📊 Question Analysis Report:', report);
    
    if (report.recommendations.length > 0) {
      console.warn('⚠️ Recommendations:', report.recommendations);
    }

    // Ask user about random mode
    const result = window.confirm("Deseja questões e respostas aleatórias?");
    setRandomMode(result);
    
    if (result) {
      // Shuffle questions and their options
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const shuffledWithOptions = shuffled.map(question => {
        const optionIndices = Array.from({ length: question.options.length }, (_, i) => i);
        const shuffledIndices = optionIndices.sort(() => 0.5 - Math.random());
        
        // Create mapping for correct answers
        let newCorrectAnswer;
        if (Array.isArray(question.correctAnswer)) {
          newCorrectAnswer = question.correctAnswer.map(oldIndex => 
            shuffledIndices.indexOf(oldIndex)
          );
        } else {
          newCorrectAnswer = shuffledIndices.indexOf(question.correctAnswer);
        }
        
        return {
          ...question,
          options: shuffledIndices.map(i => question.options[i]),
          correctAnswer: newCorrectAnswer
        };
      });
      setShuffledQuestions(shuffledWithOptions);
      showToast("Modo aleatório ativado! 🎲", "info");
    } else {
      setShuffledQuestions(questions);
      showToast("Modo sequencial ativado! 📚", "info");
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
    // Save progress and reset question state
    localStorage.setItem(`quiz-progress-${title}`, currentQuestionIndex.toString());
    setSelectedAnswers([]);
    setShowJustification(false);
    setIsCorrect(false);
    setShowHints(false);
    
    // Set up timer for current question
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (currentQuestion?.timeLimit) {
      setTimeRemaining(currentQuestion.timeLimit);
      setTimerActive(true);
    } else {
      setTimeRemaining(null);
      setTimerActive(false);
    }
  }, [currentQuestionIndex, title, shuffledQuestions]);

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

    // Stop timer
    setTimerActive(false);

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
    
    // Save answer to progress
    const progress = JSON.parse(localStorage.getItem(`quiz-answers-${title}`) || '{}');
    progress[currentQuestion.id || `q-${currentQuestionIndex}`] = {
      selectedAnswers,
      correct,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`quiz-answers-${title}`, JSON.stringify(progress));
    
    const points = currentQuestion.points || 10;
    const timeBonus = timeRemaining ? Math.floor(timeRemaining / 10) : 0;
    const totalPoints = correct ? points + timeBonus : 0;
    
    showToast(
      correct 
        ? `Resposta correta! +${totalPoints} pontos ${timeBonus > 0 ? `(+${timeBonus} bônus tempo)` : ''} 🎉` 
        : "Resposta incorreta 😔", 
      correct ? "success" : "error"
    );
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed - show final statistics
      const progress = JSON.parse(localStorage.getItem(`quiz-answers-${title}`) || '{}');
      const totalAnswered = Object.keys(progress).length;
      const correctAnswers = Object.values(progress).filter((p: { correct: boolean }) => p.correct).length;
      const percentage = Math.round((correctAnswers / totalAnswered) * 100);
      
      showToast(`Quiz concluído! ${correctAnswers}/${totalAnswered} corretas (${percentage}%) 🎊`, "success");
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      showToast("Esta é a primeira pergunta!", "info");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderReferenceLinks = (links: ReferenceLink[]) => {
    if (!links || links.length === 0) return null;

    const getLinkIcon = (type: string) => {
      const icons = {
        documentation: '📖',
        trailhead: '🌟',
        article: '📄',
        video: '🎥'
      };
      return icons[type as keyof typeof icons] || '🔗';
    };

    return (
      <div className="references-section">
        <h4>🔗 Links de Referência:</h4>
        <div className="reference-links">
          {links.map((link, index) => (
            <a 
              key={index}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`reference-link ${link.type}`}
            >
              <div className="link-icon">{getLinkIcon(link.type)}</div>
              <div className="link-content">
                <div className="link-title">{link.title}</div>
                <div className="link-type">{link.type}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderVideos = (videos: VideoResource[]) => {
    if (!videos || videos.length === 0) return null;

    return (
      <div className="videos-section">
        <h4>🎥 Vídeos Relacionados:</h4>
        <div className="video-links">
          {videos.map((video, index) => (
            <a 
              key={index}
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="video-link"
            >
              {video.thumbnail && (
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={120}
                  height={80}
                  className="video-thumbnail"
                />
              )}
              <div className="video-info">
                <div className="video-title">{video.title}</div>
                {video.duration && (
                  <div className="video-duration">⏱️ {video.duration}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    );
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
      <div className="text-center mt-4">
        <h1 style={{ 
          color: '#495057', 
          marginBottom: '30px',
          fontSize: '2.5em',
          fontWeight: 'bold'
        }}>
          {title}
        </h1>
        {randomMode && (
          <div style={{ 
            color: '#6c757d', 
            marginBottom: '20px',
            fontSize: '1.1em'
          }}>
            🎲 Modo Aleatório Ativo
          </div>
        )}
      </div>
      
      {/* Enhanced Progress Bar */}
      <div className="navigation-container">
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">
              Questão {currentQuestionIndex + 1} de {shuffledQuestions.length}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {timeRemaining !== null && (
                <span className={`timer ${timeRemaining <= 30 ? 'timer-warning' : ''}`}>
                  ⏱️ {formatTime(timeRemaining)}
                </span>
              )}
              <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
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
            disabled={selectedAnswers.length === 0 || showJustification}
          >
            {showJustification ? '✓ Verificado' : '🔍 Verificar Resposta'}
          </button>
          
          {showJustification && currentQuestionIndex < shuffledQuestions.length - 1 && (
            <button 
              className="nav-btn primary" 
              onClick={nextQuestion}
            >
              Próximo →
            </button>
          )}
          
          {showJustification && currentQuestionIndex === shuffledQuestions.length - 1 && (
            <button 
              className="nav-btn success" 
              onClick={() => showToast("Quiz concluído! 🎉", "success")}
            >
              🏁 Finalizar
            </button>
          )}
        </div>
      </div>

      {/* Enhanced Question Card */}
      <div className="question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className="question-number">#{currentQuestion.id || `Q${currentQuestionIndex + 1}`}</span>
            {currentQuestion.difficulty && (
              <span className={`difficulty-badge ${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty.toUpperCase()}
              </span>
            )}
            {currentQuestion.category && (
              <span className="category-badge">{currentQuestion.category}</span>
            )}
            {currentQuestion.points && (
              <span className="points-badge">+{currentQuestion.points} pts</span>
            )}
          </div>
          <div className="question-type-badge">
            {currentQuestion.type === 'radio' ? '🔘 Única Escolha' : '☑️ Múltipla Escolha'}
          </div>
        </div>
        
        <div className="question-text">
          {currentQuestion.question}
        </div>

        {/* Screenshots */}
        {currentQuestion.screenshots && currentQuestion.screenshots.length > 0 && (
          <div className="screenshots-container">
            {currentQuestion.screenshots.map((screenshot, index) => (
              <Image
                key={index}
                src={screenshot}
                alt={`Question illustration ${index + 1}`}
                width={600}
                height={400}
                className="screenshot"
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '12px',
                  margin: '15px 0',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}
              />
            ))}
          </div>
        )}

        <div className="options-container">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isCorrectOption = showJustification && 
              (Array.isArray(currentQuestion.correctAnswer) 
                ? currentQuestion.correctAnswer.includes(index)
                : currentQuestion.correctAnswer === index);
            const isIncorrectSelected = showJustification && isSelected && !isCorrectOption;
            
            let optionClass = "option-item enhanced";
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
                  <div className="option-indicator">
                    {isCorrectOption && showJustification && '✓'}
                    {isIncorrectSelected && '✗'}
                  </div>
                  <div className="option-text">{option}</div>
                </label>
              </div>
            );
          })}
        </div>

        {/* Hints Section */}
        {currentQuestion.hints && currentQuestion.hints.length > 0 && !showJustification && (
          <div className="hints-section">
            <button 
              className="hints-toggle"
              onClick={() => setShowHints(!showHints)}
            >
              💡 {showHints ? 'Ocultar' : 'Mostrar'} Dicas
            </button>
            {showHints && (
              <div className="hints-container">
                <ul className="hints-list">
                  {currentQuestion.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Feedback */}
      {showJustification && (
        <div className={`feedback-card enhanced ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            <div className="feedback-icon">
              {isCorrect ? '🎉' : '📚'}
            </div>
            <div>
              <h3>{isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}</h3>
              {currentQuestion.points && (
                <div className="points-earned">
                  {isCorrect ? `+${currentQuestion.points} pontos` : '0 pontos'}
                </div>
              )}
            </div>
          </div>
          
          <div className="justification">
            <h4>� Explicação:</h4>
            <div className="justification-text">
              {currentQuestion.justification}
            </div>
            
            {currentQuestion.explanation && (
              <div className="additional-explanation">
                <h4>� Detalhes Adicionais:</h4>
                <div className="explanation-text">
                  {currentQuestion.explanation}
                </div>
              </div>
            )}
          </div>
          
          {renderReferenceLinks(currentQuestion.referenceLinks)}
          {renderVideos(currentQuestion.videos)}

          {currentQuestion.tags && currentQuestion.tags.length > 0 && (
            <div className="tags-section">
              <h4>�️ Tags:</h4>
              <div className="tags-container">
                {currentQuestion.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
