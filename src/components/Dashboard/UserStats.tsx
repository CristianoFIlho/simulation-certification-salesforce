'use client';

import React, { useEffect, useState } from 'react';
import { apiService, UserStats } from '../../services/api';

export default function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getUserStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estatísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatScore = (score: number) => {
    return `${Math.round(score)}%`;
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
              <p className="mt-2">Carregando estatísticas...</p>
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
              <button className="btn btn-outline-danger" onClick={loadStats}>
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">Nenhuma estatística disponível</h4>
              <p>Complete alguns quizzes para ver suas estatísticas.</p>
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
          <h2 className="mb-4">Suas Estatísticas</h2>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-primary">
                <i className="bi bi-trophy fs-1"></i>
              </div>
              <h5 className="card-title mt-2">Total de Quizzes</h5>
              <h3 className="text-primary">{stats.totalQuizzes}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-success">
                <i className="bi bi-check-circle fs-1"></i>
              </div>
              <h5 className="card-title mt-2">Quizzes Completos</h5>
              <h3 className="text-success">{stats.completedQuizzes}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-warning">
                <i className="bi bi-graph-up fs-1"></i>
              </div>
              <h5 className="card-title mt-2">Pontuação Média</h5>
              <h3 className="text-warning">{formatScore(stats.averageScore)}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-info">
                <i className="bi bi-clock fs-1"></i>
              </div>
              <h5 className="card-title mt-2">Tempo Total</h5>
              <h3 className="text-info">{formatTime(stats.totalTimeSpent)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Categorias Fortes</h5>
            </div>
            <div className="card-body">
              {stats.strongCategories.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {stats.strongCategories.map((category, index) => (
                    <span key={index} className="badge bg-success fs-6">
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Complete quizzes em diferentes categorias para ver suas áreas fortes.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Áreas de Melhoria</h5>
            </div>
            <div className="card-body">
              {stats.weakCategories.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {stats.weakCategories.map((category, index) => (
                    <span key={index} className="badge bg-warning fs-6">
                      {category}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Continue praticando para identificar áreas que precisam de mais atenção.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Progresso Geral</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <div className="progress mb-2" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${Math.min((stats.completedQuizzes / Math.max(stats.totalQuizzes, 1)) * 100, 100)}%` }}
                    >
                      {Math.round((stats.completedQuizzes / Math.max(stats.totalQuizzes, 1)) * 100)}%
                    </div>
                  </div>
                  <small className="text-muted">Taxa de Conclusão</small>
                </div>
                
                <div className="col-md-4">
                  <div className="progress mb-2" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${Math.min(stats.averageScore, 100)}%` }}
                    >
                      {formatScore(stats.averageScore)}
                    </div>
                  </div>
                  <small className="text-muted">Pontuação Média</small>
                </div>
                
                <div className="col-md-4">
                  <div className="progress mb-2" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-info"
                      role="progressbar"
                      style={{ width: `${Math.min((stats.totalTimeSpent / 3600) * 10, 100)}%` }}
                    >
                      {formatTime(stats.totalTimeSpent)}
                    </div>
                  </div>
                  <small className="text-muted">Tempo Investido</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
