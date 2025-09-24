import { 
  Question, 
  ValidationResult, 
  QuestionSetValidation, 
  CategoryStats, 
  DifficultyStats 
} from "@/types/quiz";

export class QuestionValidator {
  static validate(question: Question): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validações obrigatórias
    if (!question.id || question.id.trim() === '') {
      errors.push('Question ID is required');
    }

    if (!question.question || question.question.trim() === '') {
      errors.push('Question text is required');
    }

    if (!question.options || question.options.length < 2) {
      errors.push('At least 2 options are required');
    }

    if (question.type === 'radio' && Array.isArray(question.correctAnswer)) {
      errors.push('Radio questions should have single correct answer');
    }

    if (question.type === 'checkbox' && !Array.isArray(question.correctAnswer)) {
      errors.push('Checkbox questions should have array of correct answers');
    }

    // Validações de qualidade
    if (question.justification.length < 50) {
      warnings.push('Justification should be more detailed (minimum 50 characters)');
    }

    if (question.referenceLinks.length === 0) {
      warnings.push('Consider adding reference links for better learning experience');
    }

    if (!question.difficulty) {
      warnings.push('Difficulty level should be specified');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateQuestionSet(questions: Question[]): QuestionSetValidation {
    const results = questions.map(q => ({
      question: q,
      validation: this.validate(q)
    }));

    const duplicateIds = this.findDuplicateIds(questions);
    const categoryDistribution = this.analyzeCategoryDistribution(questions);
    const difficultyBalance = this.analyzeDifficultyBalance(questions);

    return {
      questions: results,
      duplicateIds,
      categoryDistribution,
      difficultyBalance,
      totalQuestions: questions.length,
      validQuestions: results.filter(r => r.validation.isValid).length
    };
  }

  private static findDuplicateIds(questions: Question[]): string[] {
    const ids = questions.map(q => q.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  }

  private static analyzeCategoryDistribution(questions: Question[]): CategoryStats[] {
    const categories = new Map<string, number>();
    
    questions.forEach(q => {
      const category = q.category || 'General';
      const count = categories.get(category) || 0;
      categories.set(category, count + 1);
    });

    return Array.from(categories.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: (count / questions.length) * 100
    }));
  }

  private static analyzeDifficultyBalance(questions: Question[]): DifficultyStats {
    const difficulties = { easy: 0, medium: 0, hard: 0 };
    
    questions.forEach(q => {
      const difficulty = q.difficulty || 'medium';
      if (difficulties.hasOwnProperty(difficulty)) {
        difficulties[difficulty as keyof typeof difficulties]++;
      }
    });

    return {
      easy: { count: difficulties.easy, percentage: (difficulties.easy / questions.length) * 100 },
      medium: { count: difficulties.medium, percentage: (difficulties.medium / questions.length) * 100 },
      hard: { count: difficulties.hard, percentage: (difficulties.hard / questions.length) * 100 }
    };
  }
}
