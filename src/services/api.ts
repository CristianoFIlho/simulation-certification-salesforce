const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ReferenceLink {
  title: string;
  url: string;
  description: string;
}

export interface VideoResource {
  title: string;
  url: string;
  description: string;
  duration: string;
}

export interface ApiQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number | number[];
  type: "radio" | "checkbox";
  justification: string;
  referenceLinks: ReferenceLink[];
  screenshots: string[];
  videos: VideoResource[];
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  tags?: string[];
  timeLimit?: number;
  points?: number;
  explanation?: string;
  hints?: string[];
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  category: string;
  totalQuestions: number;
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  userId: string;
  quizSetId: string;
  currentQuestion: number;
  answers: Record<string, number | number[]>;
  score: number;
  completedAt?: string;
  timeSpent: number;
}

export interface QuizResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  detailedResults: Array<{
    questionId: string;
    correct: boolean;
    userAnswer: number | number[];
    correctAnswer: number | number[];
  }>;
}

export interface UserStats {
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  strongCategories: string[];
  weakCategories: string[];
}

export interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  completionRate: number;
  questionStats: Array<{
    questionId: string;
    correctRate: number;
    avgTimeSpent: number;
  }>;
}

class ApiService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth-token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Quiz Sets
  async getQuizSets(): Promise<QuizSet[]> {
    const response = await this.fetchWithAuth('/quiz-sets');
    return response.map((quiz: any) => ({
      id: quiz.id.toString(),
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      totalQuestions: quiz.questions?.length || 0,
      estimatedTime: quiz.estimated_time,
      difficulty: quiz.difficulty,
      isActive: true,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at,
    }));
  }

  async getQuizSet(id: string): Promise<QuizSet> {
    const quiz = await this.fetchWithAuth(`/quiz-sets/${id}`);
    return {
      id: quiz.id.toString(),
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      totalQuestions: quiz.questions?.length || 0,
      estimatedTime: quiz.estimated_time,
      difficulty: quiz.difficulty,
      isActive: true,
      createdAt: quiz.created_at,
      updatedAt: quiz.updated_at,
    };
  }

  // Questions
  async getQuestions(quizSetId: string, options?: {
    shuffle?: boolean;
    limit?: number;
    difficulty?: string;
  }): Promise<ApiQuestion[]> {
    const questions = await this.fetchWithAuth(`/quiz-sets/${quizSetId}/questions`);
    
    return questions.map((q: any) => ({
      id: q.id.toString(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      type: q.type as "radio" | "checkbox",
      justification: q.justification,
      referenceLinks: [], // Not implemented in API yet
      screenshots: [], // Not implemented in API yet
      videos: [], // Not implemented in API yet
      difficulty: q.difficulty,
      category: q.category,
      tags: [],
      timeLimit: undefined,
      points: undefined,
      explanation: q.justification,
      hints: [],
    }));
  }

  async getQuestion(quizSetId: string, questionId: string): Promise<ApiQuestion> {
    const questions = await this.getQuestions(quizSetId);
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    return question;
  }

  // User Progress
  async saveProgress(progress: Partial<UserProgress>): Promise<void> {
    await this.fetchWithAuth('/progress', {
      method: 'POST',
      body: JSON.stringify(progress),
    });
  }

  async getProgress(quizSetId: string): Promise<UserProgress | null> {
    try {
      return await this.fetchWithAuth(`/progress/${quizSetId}`);
    } catch {
      return null; // No progress found
    }
  }

  async submitQuiz(quizSetId: string, answers: Record<string, number | number[]>): Promise<QuizResults> {
    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: parseInt(questionId),
      answer: Array.isArray(answer) ? answer[0] : answer,
    }));

    const result = await this.fetchWithAuth('/quiz-sets/submit', {
      method: 'POST',
      body: JSON.stringify({
        quiz_set_id: parseInt(quizSetId),
        answers: answersArray,
      }),
    });

    return {
      score: result.score,
      correctAnswers: result.correct_answers,
      totalQuestions: result.total_questions,
      timeSpent: result.time_taken,
      detailedResults: result.details.map((detail: any) => ({
        questionId: detail.question_id.toString(),
        correct: detail.is_correct,
        userAnswer: detail.user_answer,
        correctAnswer: detail.correct_answer,
      })),
    };
  }

  // Analytics
  async getQuizAnalytics(quizSetId: string): Promise<QuizAnalytics> {
    const analytics = await this.fetchWithAuth(`/analytics/quiz-stats/${quizSetId}`);
    return {
      totalAttempts: analytics.total_attempts,
      averageScore: analytics.average_score,
      completionRate: analytics.completion_rate,
      questionStats: [], // Not implemented in API yet
    };
  }

  async getUserStats(): Promise<UserStats> {
    const stats = await this.fetchWithAuth('/analytics/user-stats');
    return {
      totalQuizzes: stats.total_quizzes_taken,
      completedQuizzes: stats.total_quizzes_taken,
      averageScore: stats.average_score,
      totalTimeSpent: stats.total_time_spent,
      strongCategories: Object.keys(stats.quizzes_by_category).filter(
        category => stats.quizzes_by_category[category] > 0
      ),
      weakCategories: [], // Not implemented in API yet
    };
  }

  // Authentication
  async login(email: string, password: string): Promise<{
    access_token: string;
    token_type: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  }> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username: email,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth-token', data.access_token);
    
    // Get user info
    const userResponse = await this.fetchWithAuth('/me');
    
    return {
      access_token: data.access_token,
      token_type: data.token_type,
      user: userResponse,
    };
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth-token');
  }

  async getCurrentUser(): Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
  }> {
    return this.fetchWithAuth('/me');
  }
}

export const apiService = new ApiService();
