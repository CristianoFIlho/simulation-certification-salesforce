// Mock API service for testing without backend
import { ApiQuestion, QuizSet, UserProgress, QuizResults, QuizAnalytics, UserStats } from './api';

// Mock data for testing
const mockQuizSets: QuizSet[] = [
  {
    id: "mcpa-level-1",
    title: "MCPA - LEVEL 1 (Training platform)",
    description: "MuleSoft Certified Platform Architect - Level 1",
    category: "MuleSoft",
    totalQuestions: 5,
    estimatedTime: 600, // 10 minutes
    difficulty: "medium",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z"
  }
];

const mockQuestions: Record<string, ApiQuestion[]> = {
  "mcpa-level-1": [
    {
      id: "mcpa-1",
      question: "What is the primary purpose of MuleSoft's Anypoint Platform?",
      options: [
        "To create mobile applications",
        "To connect applications, data, and devices",
        "To manage database schemas",
        "To design user interfaces"
      ],
      correctAnswer: 1,
      type: "radio",
      justification: "MuleSoft's Anypoint Platform is primarily designed to connect applications, data, and devices across on-premises and cloud environments through APIs and integrations.",
      referenceLinks: [
        {
          title: "Anypoint Platform Overview",
          url: "https://docs.mulesoft.com/general/",
          description: "Official documentation about Anypoint Platform"
        }
      ],
      screenshots: [],
      videos: [
        {
          title: "Introduction to Anypoint Platform",
          url: "https://www.youtube.com/watch?v=example",
          description: "Overview of MuleSoft Anypoint Platform capabilities",
          duration: "10:30"
        }
      ],
      difficulty: "easy",
      category: "Platform Overview",
      tags: ["anypoint", "platform", "integration"],
      timeLimit: 120,
      points: 10,
      hints: [
        "Think about what MuleSoft is known for in the integration space",
        "Consider the core purpose of an integration platform"
      ]
    },
    {
      id: "mcpa-2",
      question: "Which of the following are key components of API-led connectivity? (Select all that apply)",
      options: [
        "System APIs",
        "Process APIs", 
        "Experience APIs",
        "Database APIs"
      ],
      correctAnswer: [0, 1, 2],
      type: "checkbox",
      justification: "API-led connectivity consists of three layers: System APIs (unlock data from systems), Process APIs (orchestrate data), and Experience APIs (provide data for specific experiences). Database APIs is not a standard layer in this approach.",
      referenceLinks: [
        {
          title: "API-led Connectivity",
          url: "https://www.mulesoft.com/resources/api/what-is-api-led-connectivity",
          description: "Learn about the three-layer API approach"
        }
      ],
      screenshots: [],
      videos: [],
      difficulty: "medium",
      category: "API Design",
      tags: ["api-led", "connectivity", "architecture"],
      timeLimit: 180,
      points: 15,
      hints: [
        "Think about the three-layer approach in API-led connectivity",
        "Consider which APIs interact directly with backend systems vs. user experiences"
      ]
    },
    {
      id: "mcpa-3",
      question: "What is the main benefit of using DataWeave in MuleSoft?",
      options: [
        "To create user interfaces",
        "To transform data between different formats",
        "To manage API security",
        "To monitor application performance"
      ],
      correctAnswer: 1,
      type: "radio",
      justification: "DataWeave is MuleSoft's expression language designed for data transformation. It allows developers to transform data from one format to another (JSON, XML, CSV, etc.) with powerful mapping capabilities.",
      referenceLinks: [
        {
          title: "DataWeave Language",
          url: "https://docs.mulesoft.com/dataweave/",
          description: "Complete guide to DataWeave transformation language"
        }
      ],
      screenshots: [],
      videos: [
        {
          title: "DataWeave Fundamentals",
          url: "https://www.youtube.com/watch?v=dataweave-example",
          description: "Learn the basics of DataWeave transformations",
          duration: "15:45"
        }
      ],
      difficulty: "easy",
      category: "Data Transformation",
      tags: ["dataweave", "transformation", "mapping"],
      timeLimit: 90,
      points: 10,
      hints: [
        "DataWeave is specifically designed for one primary purpose",
        "Think about what happens when data moves between different systems"
      ]
    },
    {
      id: "mcpa-4",
      question: "In Anypoint Studio, what is a Connector?",
      options: [
        "A tool for debugging applications",
        "A pre-built component that connects to external systems",
        "A security mechanism for APIs",
        "A performance monitoring tool"
      ],
      correctAnswer: 1,
      type: "radio",
      justification: "Connectors in Anypoint Studio are pre-built components that facilitate connections to external systems, databases, and services. They provide standardized ways to interact with various systems without writing custom integration code.",
      referenceLinks: [
        {
          title: "Anypoint Connectors",
          url: "https://docs.mulesoft.com/connectors/",
          description: "Documentation for all available MuleSoft connectors"
        }
      ],
      screenshots: [],
      videos: [],
      difficulty: "easy",
      category: "Development Tools",
      tags: ["connectors", "studio", "integration"],
      timeLimit: 90,
      points: 10,
      hints: [
        "Think about how MuleSoft simplifies connections to external systems",
        "Consider pre-built vs. custom integration components"
      ]
    },
    {
      id: "mcpa-5",
      question: "What is the primary purpose of API Manager in Anypoint Platform?",
      options: [
        "To design and build APIs",
        "To govern, secure, and monitor APIs",
        "To transform data formats",
        "To create user documentation"
      ],
      correctAnswer: 1,
      type: "radio",
      justification: "API Manager is the component of Anypoint Platform responsible for API governance, security, and monitoring. It handles policies, SLA tiers, analytics, and overall API lifecycle management.",
      referenceLinks: [
        {
          title: "API Manager Overview",
          url: "https://docs.mulesoft.com/api-manager/",
          description: "Learn about API governance and management capabilities"
        }
      ],
      screenshots: [],
      videos: [
        {
          title: "API Manager Deep Dive",
          url: "https://www.youtube.com/watch?v=api-manager-example",
          description: "Complete overview of API Manager features",
          duration: "20:15"
        }
      ],
      difficulty: "medium",
      category: "API Management",
      tags: ["api-manager", "governance", "security"],
      timeLimit: 120,
      points: 12,
      hints: [
        "Think about what happens after APIs are built",
        "Consider the operational aspects of API lifecycle"
      ]
    }
  ]
};

class MockApiService {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getQuizSets(): Promise<QuizSet[]> {
    await this.delay(500); // Simulate network delay
    return mockQuizSets;
  }

  async getQuizSet(id: string): Promise<QuizSet> {
    await this.delay(300);
    const quizSet = mockQuizSets.find(q => q.id === id);
    if (!quizSet) throw new Error(`Quiz set ${id} not found`);
    return quizSet;
  }

  async getQuestions(quizSetId: string, options?: {
    shuffle?: boolean;
    limit?: number;
    difficulty?: string;
  }): Promise<ApiQuestion[]> {
    await this.delay(800);
    let questions = mockQuestions[quizSetId] || [];
    
    if (options?.difficulty) {
      questions = questions.filter(q => q.difficulty === options.difficulty);
    }
    
    if (options?.shuffle) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }
    
    if (options?.limit) {
      questions = questions.slice(0, options.limit);
    }
    
    return questions;
  }

  async getQuestion(quizSetId: string, questionId: string): Promise<ApiQuestion> {
    await this.delay(200);
    const questions = mockQuestions[quizSetId] || [];
    const question = questions.find(q => q.id === questionId);
    if (!question) throw new Error(`Question ${questionId} not found`);
    return question;
  }

  async saveProgress(progress: Partial<UserProgress>): Promise<void> {
    await this.delay(300);
    // Save to localStorage for mock
    const key = `progress-${progress.quizSetId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  }

  async getProgress(quizSetId: string): Promise<UserProgress | null> {
    await this.delay(200);
    const key = `progress-${quizSetId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  async submitQuiz(quizSetId: string, answers: Record<string, number | number[]>): Promise<QuizResults> {
    await this.delay(1000);
    
    const questions = mockQuestions[quizSetId] || [];
    const detailedResults = questions.map(question => {
      const userAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      let correct = false;
      if (Array.isArray(correctAnswer)) {
        // Multiple choice
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        correct = correctAnswer.length === userAnswers.length && 
                 correctAnswer.every(ans => userAnswers.includes(ans));
      } else {
        // Single choice
        correct = userAnswer === correctAnswer;
      }
      
      return {
        questionId: question.id,
        correct,
        userAnswer,
        correctAnswer
      };
    });
    
    const correctAnswers = detailedResults.filter(r => r.correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    return {
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent: 300, // Mock time spent
      detailedResults
    };
  }

  async getQuizAnalytics(quizSetId: string): Promise<QuizAnalytics> {
    await this.delay(500);
    return {
      totalAttempts: 150,
      averageScore: 78.5,
      completionRate: 0.85,
      questionStats: mockQuestions[quizSetId]?.map(q => ({
        questionId: q.id,
        correctRate: 0.65 + Math.random() * 0.3,
        avgTimeSpent: 45 + Math.random() * 60
      })) || []
    };
  }

  async getUserStats(): Promise<UserStats> {
    await this.delay(400);
    return {
      totalQuizzes: 12,
      completedQuizzes: 8,
      averageScore: 82.3,
      totalTimeSpent: 14400, // 4 hours
      strongCategories: ["API Design", "Platform Overview"],
      weakCategories: ["Data Transformation", "Security"]
    };
  }
}

export const mockApiService = new MockApiService();
