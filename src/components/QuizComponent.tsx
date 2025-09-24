"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, QuizData } from "@/types/quiz";
import Image from "next/image";
import { useQuestionCache } from "@/services/questionCache";

interface QuizComponentProps {
  questions?: Question[];
  title?: string;
  quizSetId?: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, title, quizSetId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showJustification, setShowJustification] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [randomMode, setRandomMode] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const cache = useQuestionCache();

  const loadQuizData = useCallback(async () => {
    try {
      setLoading(true);
      
      let data: QuizData;
      if (quizSetId) {
        // Carregar do cache
        const cachedData = await cache.getQuestions(quizSetId);
        if (!cachedData) {
          throw new Error(`Quiz set ${quizSetId} não encontrado`);
        }
        data = cachedData;
      } else if (questions && title) {
        // Usar props diretas (modo legacy)
        data = { title, questions };
      } else {
        throw new Error('É necessário fornecer quizSetId ou questions+title');
      }
      
      setQuizData(data);
      
      // Ask user about random mode
      const result = window.confirm("Deseja questões e respostas aleatórias?");
      setRandomMode(result);
      
      if (result) {
        // Shuffle questions and their options
        const shuffled = [...data.questions].sort(() => 0.5 - Math.random());
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
      } else {
        setShuffledQuestions(data.questions);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do quiz:', error);
    } finally {
      setLoading(false);
    }
  }, [quizSetId, questions, title, cache]);

  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  useEffect(() => {
    // Save progress and reset question state
    const quizTitle = quizData?.title || title || 'quiz';
    localStorage.setItem(`quiz-progress-${quizTitle}`, currentQuestionIndex.toString());
    setSelectedAnswers([]);
    setShowJustification(false);
    setIsCorrect(false);
    setShowHints(false);
  }, [currentQuestionIndex, quizData?.title, title]);

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
      alert("Por favor, selecione uma resposta.");
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
    
    // Save answer to progress
    const quizTitle = quizData?.title || title || 'quiz';
    const progress = JSON.parse(localStorage.getItem(`quiz-answers-${quizTitle}`) || '{}');
    progress[currentQuestion.id || `q-${currentQuestionIndex}`] = {
      selectedAnswers,
      correct,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`quiz-answers-${quizTitle}`, JSON.stringify(progress));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed - show final statistics
      const quizTitle = quizData?.title || title || 'quiz';
      const progress = JSON.parse(localStorage.getItem(`quiz-answers-${quizTitle}`) || '{}');
      const totalAnswered = Object.keys(progress).length;
      const correctAnswers = Object.values(progress).filter((p: unknown) => (p as { correct: boolean }).correct).length;
      const percentage = Math.round((correctAnswers / totalAnswered) * 100);
      
      alert(`Quiz concluído! ${correctAnswers}/${totalAnswered} corretas (${percentage}%)`);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="text-center">
          <div style={{ fontSize: '2em', margin: '20px 0' }}>⏳</div>
          <p>Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="text-center">
          <div style={{ fontSize: '2em', margin: '20px 0' }}>❌</div>
          <p>Nenhuma questão encontrada</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-title">
        <h1>{quizData?.title || title}</h1>
        {randomMode && (
          <div className="random-mode-indicator">
            🎲 Modo Aleatório Ativo
          </div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="navigation-container">
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">
              Questão {currentQuestionIndex + 1} de {shuffledQuestions.length}
            </span>
            <span className="progress-percentage">{Math.round(progressPercentage)}%</span>
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
          
          {showJustification && currentQuestionIndex < shuffledQuestions.length - 1 && (
            <button 
              className="nav-btn primary" 
              onClick={nextQuestion}
            >
              Próximo →
            </button>
          )}
          
        </div>
      </div>

      {/* Finish Button Section */}
      {showJustification && currentQuestionIndex === shuffledQuestions.length - 1 && (
        <div className="finish-section">
          <button 
            className="finish-button" 
            onClick={() => alert("Quiz concluído! 🎉")}
          >
            🏁 Finalizar Quiz
          </button>
        </div>
      )}

      {/* Question Card */}
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

        {/* Verificar Resposta Button - Dentro do cartão da questão */}
        {!showJustification && (
          <div className="check-answer-section">
            <button 
              className="check-answer-btn" 
              onClick={checkAnswer}
              disabled={selectedAnswers.length === 0}
            >
              {selectedAnswers.length === 0 ? 'Selecione uma resposta' : '🔍 Verificar Resposta'}
            </button>
          </div>
        )}

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

      {/* Feedback */}
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
            <h4>📖 Explicação:</h4>
            <div className="justification-text">
              {currentQuestion.justification}
            </div>
            
            {currentQuestion.explanation && (
              <div className="additional-explanation">
                <h4>📝 Detalhes Adicionais:</h4>
                <div className="explanation-text">
                  {currentQuestion.explanation}
                </div>
              </div>
            )}
          </div>

          {currentQuestion.referenceLinks && currentQuestion.referenceLinks.length > 0 && (
            <div className="references-section">
              <h4>🔗 Links de Referência:</h4>
              <div className="reference-links">
                {currentQuestion.referenceLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="reference-link"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.tags && currentQuestion.tags.length > 0 && (
            <div className="tags-section">
              <h4>🏷️ Tags:</h4>
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
