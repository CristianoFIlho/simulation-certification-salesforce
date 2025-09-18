"use client";

import { useState } from "react";
import { useQuiz } from '@/hooks/useQuiz';
import { QuizResults, ReferenceLink, VideoResource } from '@/services/api';
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

  if (loading) {
    return <LoadingSpinner message="Carregando simulado..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (quizCompleted && quizResults) {
    return <QuizResultsComponent results={quizResults} onRestart={resetQuiz} />;
  }

  if (!currentQuestion || !quizSet) {
    return <ErrorMessage message="Questão não encontrada" />;
  }

  const handleAnswerChange = (optionIndex: number) => {
    if (showJustification) return;
    
    let newAnswers: number[];
    if (currentQuestion.type === "radio") {
      newAnswers = [optionIndex];
    } else {
      newAnswers = selectedAnswers.includes(optionIndex)
        ? selectedAnswers.filter(i => i !== optionIndex)
        : [...selectedAnswers, optionIndex];
    }
    
    setSelectedAnswers(newAnswers);
  };

  const checkAnswer = () => {
    if (selectedAnswers.length === 0) return;
    
    // Save answer
    answerQuestion(currentQuestion.id, selectedAnswers);
    setShowJustification(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswers([]);
    setShowJustification(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const results = await submitQuiz();
      setQuizResults(results);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderReferenceLinks = (links: ReferenceLink[]) => {
    if (!links || links.length === 0) return null;

    return (
      <div className="reference-section">
        <div className="reference-title">
          <span className="reference-icon">📚</span>
          Referências para Estudo
        </div>
        <div className="reference-links">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reference-link"
            >
              <div className="reference-link-icon">🔗</div>
              <div className="reference-link-content">
                <div className="reference-link-title">{link.title}</div>
                <div className="reference-link-description">{link.description}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderVideoResources = (videos: VideoResource[]) => {
    if (!videos || videos.length === 0) return null;

    return (
      <div className="video-section">
        <div className="video-title">
          <span className="video-icon">🎥</span>
          Recursos em Vídeo
        </div>
        <div className="video-links">
          {videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link"
            >
              <div className="video-link-icon">▶️</div>
              <div className="video-link-content">
                <div className="video-link-title">{video.title}</div>
                <div className="video-link-description">{video.description}</div>
                <div className="video-link-duration">{video.duration}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const renderHints = (hints: string[]) => {
    if (!hints || hints.length === 0) return null;

    return (
      <div className="hints-container">
        <button 
          onClick={() => setShowHints(!showHints)}
          className="hints-toggle"
        >
          💡 {showHints ? 'Ocultar' : 'Mostrar'} Dicas ({hints.length})
        </button>
        
        {showHints && (
          <div className="hints-list">
            {hints.map((hint, index) => (
              <div key={index} className="hint-item">
                <div className="hint-icon">💡</div>
                <div className="hint-text">{hint}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <h1>{quizSet.title}</h1>
        <div className="quiz-meta">
          <span className={`difficulty-badge ${quizSet.difficulty}`}>
            {quizSet.difficulty?.toUpperCase()}
          </span>
          <span className="time-spent">⏱️ {formatTime(timeSpent)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-container">
        <div className="progress-info">
          <span>Questão {currentQuestionIndex + 1} de {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}% concluído</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>Respondidas: {answeredQuestions}/{totalQuestions}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        <button 
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="nav-btn secondary"
        >
          ← Anterior
        </button>
        
        {!showJustification ? (
          <button 
            onClick={checkAnswer}
            disabled={selectedAnswers.length === 0}
            className="nav-btn primary"
          >
            Verificar Resposta
          </button>
        ) : currentQuestionIndex < totalQuestions - 1 ? (
          <button onClick={handleNextQuestion} className="nav-btn primary">
            Próxima →
          </button>
        ) : (
          <button 
            onClick={handleSubmitQuiz}
            disabled={!canSubmit}
            className="nav-btn success"
          >
            Finalizar Simulado
          </button>
        )}
      </div>

      {/* Question */}
      <div className="question-card fade-in">
        <div className="question-header">
          <span className="question-number">Questão #{currentQuestionIndex + 1}</span>
          {currentQuestion.category && (
            <span className="category-badge">{currentQuestion.category}</span>
          )}
          {currentQuestion.difficulty && (
            <span className={`metadata-badge difficulty-${currentQuestion.difficulty}`}>
              {currentQuestion.difficulty}
            </span>
          )}
          {currentQuestion.points && (
            <span className="points-badge">+{currentQuestion.points} pts</span>
          )}
        </div>
        
        <div className="question-text">{currentQuestion.question}</div>
        
        {/* Hints */}
        {currentQuestion.hints && renderHints(currentQuestion.hints)}
        
        <div className="options-container">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isCorrect = showJustification && 
              (Array.isArray(currentQuestion.correctAnswer)
                ? currentQuestion.correctAnswer.includes(index)
                : currentQuestion.correctAnswer === index);
            const isIncorrect = showJustification && isSelected && !isCorrect;
            
            return (
              <div
                key={index}
                className={`option-item ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                onClick={() => handleAnswerChange(index)}
              >
                <div className="option-indicator">
                  {isCorrect && showJustification && '✓'}
                  {isIncorrect && '✗'}
                </div>
                <div className="option-text">{option}</div>
              </div>
            );
          })}
        </div>

        {/* Screenshots */}
        {currentQuestion.screenshots && currentQuestion.screenshots.length > 0 && (
          <div className="screenshots-container">
            {currentQuestion.screenshots.map((screenshot, index) => (
              <div key={index} className="screenshot-item">
                <Image
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  width={600}
                  height={400}
                  className="screenshot-image"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      {showJustification && (
        <div className={`feedback-section slide-in ${
          selectedAnswers.some(ans => 
            Array.isArray(currentQuestion.correctAnswer)
              ? currentQuestion.correctAnswer.includes(ans)
              : currentQuestion.correctAnswer === ans
          ) ? 'feedback-correct' : 'feedback-incorrect'
        }`}>
          <div className="feedback-header">
            <div className={`feedback-icon ${
              selectedAnswers.some(ans => 
                Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer.includes(ans)
                  : currentQuestion.correctAnswer === ans
              ) ? 'correct' : 'incorrect'
            }`}>
              {selectedAnswers.some(ans => 
                Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer.includes(ans)
                  : currentQuestion.correctAnswer === ans
              ) ? '✅' : '❌'}
            </div>
            <div className="feedback-title">
              {selectedAnswers.some(ans => 
                Array.isArray(currentQuestion.correctAnswer)
                  ? currentQuestion.correctAnswer.includes(ans)
                  : currentQuestion.correctAnswer === ans
              ) ? 'Resposta Correta!' : 'Resposta Incorreta'}
            </div>
          </div>
          
          <div className="feedback-explanation">
            {currentQuestion.justification || currentQuestion.explanation}
          </div>

          {/* Reference Links */}
          {renderReferenceLinks(currentQuestion.referenceLinks)}

          {/* Video Resources */}
          {renderVideoResources(currentQuestion.videos)}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
