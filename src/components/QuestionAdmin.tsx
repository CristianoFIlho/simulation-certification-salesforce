"use client";

import { useState, useEffect } from 'react';
import { Question, QuizData } from '@/types/quiz';
import { useQuestionCache } from '@/services/questionCache';

interface QuestionAdminProps {
  quizSetId: string;
}

const QuestionAdmin: React.FC<QuestionAdminProps> = ({ quizSetId }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  
  const cache = useQuestionCache();

  useEffect(() => {
    loadQuizData();
    loadStats();
  }, [quizSetId]);

  const loadQuizData = async () => {
    try {
      setLoading(true);
      const data = await cache.getQuestions(quizSetId);
      setQuizData(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const cacheStats = await cache.getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleAddQuestion = async (question: Question) => {
    try {
      await cache.addQuestion(quizSetId, question);
      await loadQuizData();
      await loadStats();
      setIsAddingNew(false);
    } catch (error) {
      console.error('Erro ao adicionar questão:', error);
    }
  };

  const handleUpdateQuestion = async (questionId: string, updatedQuestion: Question) => {
    try {
      await cache.updateQuestion(quizSetId, questionId, updatedQuestion);
      await loadQuizData();
      setEditingQuestion(null);
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      try {
        await cache.removeQuestion(quizSetId, questionId);
        await loadQuizData();
        await loadStats();
      } catch (error) {
        console.error('Erro ao excluir questão:', error);
      }
    }
  };

  const handleExportData = async () => {
    try {
      const data = await cache.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questions-${quizSetId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await cache.importData(text);
      await loadQuizData();
      await loadStats();
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert('Erro ao importar dados. Verifique o formato do arquivo.');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">⏳ Carregando...</div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="admin-container">
        <div className="error-message">
          ❌ Conjunto de questões não encontrado: {quizSetId}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📚 Administração de Questões</h1>
        <h2>{quizData.title}</h2>
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalQuestions}</div>
              <div className="stat-label">Total de Questões</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.categories.length}</div>
              <div className="stat-label">Categorias</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{Object.keys(stats.difficulties).length}</div>
              <div className="stat-label">Níveis de Dificuldade</div>
            </div>
          </div>
        )}
      </div>

      <div className="admin-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddingNew(true)}
        >
          ➕ Adicionar Questão
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={handleExportData}
        >
          📤 Exportar Dados
        </button>
        
        <label className="btn btn-secondary">
          📥 Importar Dados
          <input
            type="file"
            accept=".json"
            onChange={handleImportData}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {isAddingNew && (
        <QuestionForm
          onSubmit={handleAddQuestion}
          onCancel={() => setIsAddingNew(false)}
        />
      )}

      {editingQuestion && (
        <QuestionForm
          question={editingQuestion}
          onSubmit={(updatedQuestion) => handleUpdateQuestion(editingQuestion.id, updatedQuestion)}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      <div className="questions-list">
        <h3>📋 Lista de Questões ({quizData.questions.length})</h3>
        
        {quizData.questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <div className="question-meta">
                <span className="question-number">#{index + 1}</span>
                <span className="question-id">{question.id}</span>
                {question.category && (
                  <span className="category-badge">{question.category}</span>
                )}
                {question.difficulty && (
                  <span className={`difficulty-badge ${question.difficulty}`}>
                    {question.difficulty.toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className="question-actions">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setEditingQuestion(question)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
            
            <div className="question-content">
              <div className="question-text">{question.question}</div>
              
              <div className="question-options">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`option-preview ${
                      Array.isArray(question.correctAnswer) 
                        ? question.correctAnswer.includes(optIndex) ? 'correct' : ''
                        : question.correctAnswer === optIndex ? 'correct' : ''
                    }`}
                  >
                    {optIndex + 1}. {option}
                  </div>
                ))}
              </div>
              
              {question.justification && (
                <div className="question-justification">
                  <strong>Justificativa:</strong> {question.justification}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de formulário para questões
interface QuestionFormProps {
  question?: Question;
  onSubmit: (question: Question) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Question>(question || {
    id: '',
    question: '',
    type: 'radio',
    options: ['', '', '', ''],
    correctAnswer: 0,
    justification: '',
    referenceLinks: [],
    screenshots: [],
    videos: [],
    category: '',
    difficulty: 'medium',
    tags: [],
    points: 10
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.question.trim()) {
      alert('A pergunta é obrigatória');
      return;
    }
    
    if (formData.options.some(opt => !opt.trim())) {
      alert('Todas as opções devem ser preenchidas');
      return;
    }

    onSubmit(formData);
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  return (
    <div className="question-form-overlay">
      <div className="question-form">
        <h3>{question ? '✏️ Editar Questão' : '➕ Nova Questão'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pergunta *</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo de Questão</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'radio' | 'checkbox' }))}
            >
              <option value="radio">Única Escolha</option>
              <option value="checkbox">Múltipla Escolha</option>
            </select>
          </div>

          <div className="form-group">
            <label>Opções *</label>
            {formData.options.map((option, index) => (
              <div key={index} className="option-input">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={
                    formData.type === 'radio' 
                      ? formData.correctAnswer === index
                      : Array.isArray(formData.correctAnswer) && formData.correctAnswer.includes(index)
                  }
                  onChange={() => {
                    if (formData.type === 'radio') {
                      setFormData(prev => ({ ...prev, correctAnswer: index }));
                    } else {
                      const currentAnswers = Array.isArray(formData.correctAnswer) ? formData.correctAnswer : [];
                      const newAnswers = currentAnswers.includes(index)
                        ? currentAnswers.filter(i => i !== index)
                        : [...currentAnswers, index];
                      setFormData(prev => ({ ...prev, correctAnswer: newAnswers }));
                    }
                  }}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                  required
                />
                {formData.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(index)}>
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption}>
              ➕ Adicionar Opção
            </button>
          </div>

          <div className="form-group">
            <label>Justificativa *</label>
            <textarea
              value={formData.justification}
              onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria</label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Dificuldade</label>
              <select
                value={formData.difficulty || 'medium'}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
              >
                <option value="easy">Fácil</option>
                <option value="medium">Médio</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <label>Pontos</label>
              <input
                type="number"
                value={formData.points || 10}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              💾 Salvar
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionAdmin;
