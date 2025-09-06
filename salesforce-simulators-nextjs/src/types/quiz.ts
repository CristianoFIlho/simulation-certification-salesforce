export interface Question {
  question: string;
  options: string[];
  correctAnswer: number | number[];
  type: "radio" | "checkbox";
  justification: string;
  referenceLinks: string[];
  screenshots: string[];
  videos: string[];
}

export interface QuizData {
  title: string;
  questions: Question[];
}
