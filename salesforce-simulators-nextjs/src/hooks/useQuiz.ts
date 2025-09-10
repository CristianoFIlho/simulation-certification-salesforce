import { useState, useEffect, useCallback } from 'react';
import { ApiQuestion, QuizSet, UserProgress, QuizResults } from '@/services/api';
import { mockApiService } from '@/services/mockApi';

export interface UseQuizOptions {
  shuffle?: boolean;
  autoSave?: boolean;
  timeLimit?: boolean;
}

export const useQuiz = (quizSetId: string, options: UseQuizOptions = {}) => {
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | number[]>>({});
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load quiz data
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        setLoading(true);
        
        // Use mock API for now (replace with apiService when backend is ready)
        const api = mockApiService;
        
        // Load quiz set info
        const quizSetData = await api.getQuizSet(quizSetId);
        setQuizSet(quizSetData);
        
        // Load questions
        const questionsData = await api.getQuestions(quizSetId, {
          shuffle: options.shuffle
        });
        setQuestions(questionsData);
        
        // Load existing progress
        const existingProgress = await api.getProgress(quizSetId);
        if (existingProgress) {
          setProgress(existingProgress);
          setCurrentQuestionIndex(existingProgress.currentQuestion);
          setAnswers(existingProgress.answers);
          setTimeSpent(existingProgress.timeSpent);
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizSetId, options.shuffle]);

  // Auto-save progress
  useEffect(() => {
    if (!options.autoSave || !quizSet || Object.keys(answers).length === 0) return;

    const saveProgress = async () => {
      try {
        await mockApiService.saveProgress({
          quizSetId,
          currentQuestion: currentQuestionIndex,
          answers,
          timeSpent,
          score: 0, // Will be calculated on submission
          userId: 'current-user', // TODO: Get from auth context
        });
      } catch (err) {
        console.error('Failed to save progress:', err);
      }
    };

    const debounceTimer = setTimeout(saveProgress, 2000);
    return () => clearTimeout(debounceTimer);
  }, [answers, currentQuestionIndex, timeSpent, quizSetId, options.autoSave, quizSet]);

  // Timer
  useEffect(() => {
    if (!options.timeLimit || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [options.timeLimit, quizCompleted]);

  const answerQuestion = useCallback((questionId: string, answer: number | number[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  const submitQuiz = useCallback(async (): Promise<QuizResults> => {
    try {
      setLoading(true);
      const results = await mockApiService.submitQuiz(quizSetId, answers);
      setQuizCompleted(true);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [quizSetId, answers]);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeSpent(0);
    setQuizCompleted(false);
    setError(null);
  }, []);

  return {
    // Data
    quizSet,
    questions,
    currentQuestion: questions[currentQuestionIndex] || null,
    currentQuestionIndex,
    answers,
    progress,
    timeSpent,
    
    // State
    loading,
    error,
    quizCompleted,
    
    // Actions
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    
    // Computed
    totalQuestions: questions.length,
    answeredQuestions: Object.keys(answers).length,
    progressPercentage: questions.length > 0 ? 
      ((currentQuestionIndex + 1) / questions.length) * 100 : 0,
    canSubmit: Object.keys(answers).length === questions.length,
  };
};
