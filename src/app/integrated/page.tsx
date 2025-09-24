'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../../components/Auth/AuthProvider';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import QuizSetList from '../../components/Quiz/QuizSetList';
import QuizComponent from '../../components/Quiz/QuizComponent';
import UserStats from '../../components/Dashboard/UserStats';
import { QuizSet, QuizResults } from '../../services/api';

function MainContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSet | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [currentView, setCurrentView] = useState<'quiz-list' | 'quiz' | 'stats'>('quiz-list');

  const handleAuthSuccess = () => {
    setShowRegister(false);
    setCurrentView('quiz-list');
  };

  const handleQuizSelect = (quizSet: QuizSet) => {
    setSelectedQuiz(quizSet);
    setCurrentView('quiz');
  };

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setCurrentView('quiz-list');
    setSelectedQuiz(null);
  };

  const handleBackToQuizList = () => {
    setCurrentView('quiz-list');
    setSelectedQuiz(null);
    setQuizResults(null);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('quiz-list');
    setSelectedQuiz(null);
    setQuizResults(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="#">
              Salesforce Quiz
            </a>
          </div>
        </nav>

        {showRegister ? (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">
            Salesforce Quiz
          </a>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user?.name || 'Usuário'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setCurrentView('quiz-list')}
                  >
                    <i className="bi bi-house"></i> Início
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => setCurrentView('stats')}
                  >
                    <i className="bi bi-graph-up"></i> Estatísticas
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid">
        {currentView === 'quiz-list' && (
          <div>
            {quizResults && (
              <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
                <h4 className="alert-heading">Quiz Concluído!</h4>
                <p>
                  Você acertou {quizResults.correctAnswers} de {quizResults.totalQuestions} questões 
                  ({Math.round((quizResults.correctAnswers / quizResults.totalQuestions) * 100)}%).
                </p>
                <p className="mb-0">
                  Tempo gasto: {Math.round(quizResults.timeSpent / 60)} minutos
                </p>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setQuizResults(null)}
                ></button>
              </div>
            )}
            
            <QuizSetList onQuizSelect={handleQuizSelect} />
          </div>
        )}

        {currentView === 'quiz' && selectedQuiz && (
          <div>
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={handleBackToQuizList}
              >
                <i className="bi bi-arrow-left"></i> Voltar aos Quizzes
              </button>
            </div>
            <QuizComponent
              quizSet={selectedQuiz}
              onComplete={handleQuizComplete}
              onBack={handleBackToQuizList}
            />
          </div>
        )}

        {currentView === 'stats' && (
          <div>
            <div className="mt-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentView('quiz-list')}
              >
                <i className="bi bi-arrow-left"></i> Voltar aos Quizzes
              </button>
            </div>
            <UserStats />
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntegratedPage() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
