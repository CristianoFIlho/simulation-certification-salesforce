const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    return this.fetchWithAuth('/quiz-sets');
  }

  async getQuizSet(id: string): Promise<QuizSet> {
    return this.fetchWithAuth(`/quiz-sets/${id}`);
  }

  // Questions
  async getQuestions(quizSetId: string, options?: {
    shuffle?: boolean;
    limit?: number;
    difficulty?: string;
  }): Promise<ApiQuestion[]> {
    const params = new URLSearchParams();
    if (options?.shuffle) params.append('shuffle', 'true');
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.difficulty) params.append('difficulty', options.difficulty);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetchWithAuth(`/quiz-sets/${quizSetId}/questions${query}`);
  }

  async getQuestion(quizSetId: string, questionId: string): Promise<ApiQuestion> {
    return this.fetchWithAuth(`/quiz-sets/${quizSetId}/questions/${questionId}`);
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
    return this.fetchWithAuth(`/quiz-sets/${quizSetId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // Analytics
  async getQuizAnalytics(quizSetId: string): Promise<QuizAnalytics> {
    return this.fetchWithAuth(`/quiz-sets/${quizSetId}/analytics`);
  }

  async getUserStats(): Promise<UserStats> {
    return this.fetchWithAuth('/users/stats');
  }

  // Authentication
  async login(email: string, password: string): Promise<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('auth-token', data.token);
    return data;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth-token');
    await this.fetchWithAuth('/auth/logout', { method: 'POST' });
  }
}

export const apiService = new ApiService();
