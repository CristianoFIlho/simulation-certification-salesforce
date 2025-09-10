export interface ReferenceLink {
  title: string;
  url: string;
  type: "documentation" | "trailhead" | "article" | "video";
}

export interface VideoResource {
  title: string;
  url: string;
  duration?: string;
  thumbnail?: string;
}

export interface Question {
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
  timeLimit?: number; // em segundos
  points?: number;
  explanation?: string;
  hints?: string[];
}

export interface QuizData {
  title: string;
  questions: Question[];
}

// Interfaces para validação
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
}

export interface DifficultyStats {
  easy: { count: number; percentage: number };
  medium: { count: number; percentage: number };
  hard: { count: number; percentage: number };
}

export interface QuestionSetValidation {
  questions: { question: Question; validation: ValidationResult }[];
  duplicateIds: string[];
  categoryDistribution: CategoryStats[];
  difficultyBalance: DifficultyStats;
  totalQuestions: number;
  validQuestions: number;
}

export interface QualityMetrics {
  hasReferences: number;
  hasVideos: number;
  hasHints: number;
  hasTimeLimit: number;
  averageOptionsPerQuestion: number;
  averageJustificationLength: number;
}

export interface QuestionReport {
  summary: {
    total: number;
    valid: number;
    invalid: number;
    completionRate: number;
  };
  qualityMetrics: QualityMetrics;
  recommendations: string[];
  categoryBreakdown: CategoryStats[];
  difficultyAnalysis: DifficultyStats;
}
