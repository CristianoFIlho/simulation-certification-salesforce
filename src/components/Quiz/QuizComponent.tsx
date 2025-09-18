'use client';

import React, { useEffect, useState } from 'react';
import { apiService, QuizSet, ApiQuestion, QuizResults } from '../../services/api';

interface QuizComponentProps {
  quizSet: QuizSet;
  onComplete: (results: QuizResults) => void;
  onBack: () => void;
}

export default function QuizComponent({ quizSet, onComplete, onBack }: QuizComponentProps) {
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(quizSet.estimatedTime * 60); // Convert to seconds

  useEffect(() => {
    loadQuestions();
  }, [quizSet.id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getQuestions(quizSet.id);
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar questões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: number | number[]) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const results = await apiService.submitQuiz(quizSet.id, answers);
      onComplete(results);
    } catch (err: any) {
      setError(err.message || 'Erro ao submeter quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando questões...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Erro!</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-danger" onClick={onBack}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Quiz vazio</h4>
              <p>Este quiz não possui questões disponíveis.</p>
              <hr />
              <button className="btn btn-outline-warning" onClick={onBack}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          {/* Header */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="mb-0">{quizSet.title}</h4>
                  <small className="text-muted">{quizSet.description}</small>
                </div>
                <div className="col-auto">
                  <div className="text-end">
                    <div className="badge bg-primary fs-6">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="small text-muted mt-1">
                      Tempo restante
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Questão {currentQuestionIndex + 1} de {questions.length}</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${getProgressPercentage()}%` }}
                  aria-valuenow={getProgressPercentage()}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">
                {currentQuestion.question}
              </h5>
              
              <div className="mt-4">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type={currentQuestion.type === 'checkbox' ? 'checkbox' : 'radio'}
                      name={`question-${currentQuestion.id}`}
                      id={`option-${index}`}
                      value={index}
                      checked={
                        currentQuestion.type === 'checkbox'
                          ? Array.isArray(currentAnswer) && currentAnswer.includes(index)
                          : currentAnswer === index
                      }
                      onChange={(e) => {
                        if (currentQuestion.type === 'checkbox') {
                          const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
                          if (e.target.checked) {
                            handleAnswerChange(currentQuestion.id, [...currentAnswers, index]);
                          } else {
                            handleAnswerChange(
                              currentQuestion.id,
                              currentAnswers.filter((a: number) => a !== index)
                            );
                          }
                        } else {
                          handleAnswerChange(currentQuestion.id, index);
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor={`option-${index}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Anterior
                </button>
                
                <div>
                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submetendo...' : 'Finalizar Quiz'}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={handleNext}
                    >
                      Próxima
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
