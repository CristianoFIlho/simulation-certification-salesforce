import { Question, QuestionReport, QualityMetrics, QuestionSetValidation } from "@/types/quiz";
import { QuestionValidator } from "./question-validator";

export class QuestionAnalytics {
  static generateReport(questions: Question[]): QuestionReport {
    const validation = QuestionValidator.validateQuestionSet(questions);
    
    return {
      summary: {
        total: questions.length,
        valid: validation.validQuestions,
        invalid: questions.length - validation.validQuestions,
        completionRate: (validation.validQuestions / questions.length) * 100
      },
      qualityMetrics: this.calculateQualityMetrics(questions),
      recommendations: this.generateRecommendations(validation),
      categoryBreakdown: validation.categoryDistribution,
      difficultyAnalysis: validation.difficultyBalance
    };
  }

  private static calculateQualityMetrics(questions: Question[]): QualityMetrics {
    const withReferences = questions.filter(q => q.referenceLinks.length > 0).length;
    const withVideos = questions.filter(q => q.videos.length > 0).length;
    const withHints = questions.filter(q => q.hints && q.hints.length > 0).length;
    const withTimeLimit = questions.filter(q => q.timeLimit).length;

    return {
      hasReferences: (withReferences / questions.length) * 100,
      hasVideos: (withVideos / questions.length) * 100,
      hasHints: (withHints / questions.length) * 100,
      hasTimeLimit: (withTimeLimit / questions.length) * 100,
      averageOptionsPerQuestion: questions.reduce((sum, q) => sum + q.options.length, 0) / questions.length,
      averageJustificationLength: questions.reduce((sum, q) => sum + q.justification.length, 0) / questions.length
    };
  }

  private static generateRecommendations(validation: QuestionSetValidation): string[] {
    const recommendations: string[] = [];

    // Análise de distribuição de dificuldade
    const { easy, hard } = validation.difficultyBalance;
    if (easy.percentage > 60) {
      recommendations.push("Consider adding more medium and hard difficulty questions for better balance");
    }
    if (hard.percentage < 10) {
      recommendations.push("Add more challenging questions to properly test advanced knowledge");
    }

    // Análise de categorias
    const categoriesCount = validation.categoryDistribution.length;
    if (categoriesCount < 3) {
      recommendations.push("Diversify question categories to cover more topics comprehensively");
    }

    // Análise de qualidade
    const questionsWithoutReferences = validation.questions.filter(
      q => q.question.referenceLinks.length === 0
    ).length;
    
    if (questionsWithoutReferences > validation.totalQuestions * 0.5) {
      recommendations.push("Add reference links to more questions to improve learning value");
    }

    return recommendations;
  }
}
