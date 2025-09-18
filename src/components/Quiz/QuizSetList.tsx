'use client';

import React, { useEffect, useState } from 'react';
import { apiService, QuizSet } from '../../services/api';

interface QuizSetListProps {
  onQuizSelect: (quizSet: QuizSet) => void;
}

export default function QuizSetList({ onQuizSelect }: QuizSetListProps) {
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizSets();
  }, []);

  const loadQuizSets = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getQuizSets();
      setQuizSets(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar quiz sets');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando quiz sets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Erro!</h4>
              <p>{error}</p>
              <hr />
              <button className="btn btn-outline-danger" onClick={loadQuizSets}>
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizSets.length === 0) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">Nenhum quiz encontrado</h4>
              <p>Não há quiz sets disponíveis no momento.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Quiz Sets Disponíveis</h2>
        </div>
      </div>
      
      <div className="row">
        {quizSets.map((quizSet) => (
          <div key={quizSet.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{quizSet.title}</h5>
                <span className={`badge bg-${getDifficultyColor(quizSet.difficulty)}`}>
                  {getDifficultyText(quizSet.difficulty)}
                </span>
              </div>
              
              <div className="card-body">
                <p className="card-text">{quizSet.description}</p>
                
                <div className="row text-muted small mb-3">
                  <div className="col-6">
                    <i className="bi bi-book"></i> {quizSet.totalQuestions} questões
                  </div>
                  <div className="col-6">
                    <i className="bi bi-clock"></i> {quizSet.estimatedTime} min
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="badge bg-light text-dark">
                    {quizSet.category}
                  </span>
                </div>
              </div>
              
              <div className="card-footer">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => onQuizSelect(quizSet)}
                >
                  Iniciar Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
