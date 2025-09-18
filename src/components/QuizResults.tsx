import { QuizResults } from '@/services/api';

interface QuizResultsProps {
  results: QuizResults;
  onRestart: () => void;
}

const QuizResultsComponent: React.FC<QuizResultsProps> = ({ results, onRestart }) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return 'Excelente! 🎉';
    if (score >= 60) return 'Bom trabalho! 👍';
    return 'Continue estudando! 📚';
  };

  return (
    <div className="quiz-results-container">
      <div className="results-header">
        <h2>Resultado do Simulado</h2>
        <div className="score-circle" style={{ borderColor: getScoreColor(results.score) }}>
          <span className="score-value" style={{ color: getScoreColor(results.score) }}>
            {results.score}%
          </span>
        </div>
        <p className="score-message">{getScoreMessage(results.score)}</p>
      </div>

      <div className="results-stats">
        <div className="stat-item">
          <span className="stat-label">Acertos</span>
          <span className="stat-value">
            {results.correctAnswers}/{results.totalQuestions}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Tempo Total</span>
          <span className="stat-value">{formatTime(results.timeSpent)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Média por Questão</span>
          <span className="stat-value">
            {formatTime(Math.round(results.timeSpent / results.totalQuestions))}
          </span>
        </div>
      </div>

      <div className="results-actions">
        <button onClick={onRestart} className="restart-button">
          Refazer Simulado
        </button>
        <button className="review-button">
          Revisar Respostas
        </button>
      </div>

      <div className="detailed-results">
        <h3>Resultado por Questão</h3>
        <div className="question-results">
          {results.detailedResults.map((result, index) => (
            <div 
              key={result.questionId} 
              className={`question-result ${result.correct ? 'correct' : 'incorrect'}`}
            >
              <span className="question-number">#{index + 1}</span>
              <span className="result-icon">
                {result.correct ? '✅' : '❌'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsComponent;
