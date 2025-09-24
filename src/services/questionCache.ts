import { Question, QuizData } from '@/types/quiz';
import { useMemo } from 'react';

// Interface para o banco de dados em cache
interface QuestionDatabase {
  [quizSetId: string]: QuizData;
}

// Classe para gerenciar o cache de questões
class QuestionCacheService {
  private db: QuestionDatabase = {};
  private isInitialized = false;

  // Inicializar o banco de dados com dados mock
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Carregar dados do localStorage se existirem
      const cachedData = localStorage.getItem('question-cache');
      if (cachedData) {
        this.db = JSON.parse(cachedData);
        console.log('📦 Cache carregado do localStorage');
      } else {
        // Carregar dados mock iniciais
        await this.loadMockData();
        this.saveToLocalStorage();
        console.log('🎭 Dados mock carregados');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Erro ao inicializar cache:', error);
      await this.loadMockData();
      this.isInitialized = true;
    }
  }

  // Carregar dados mock
  private async loadMockData(): Promise<void> {
    // Importar dados existentes
    const { administratorObjectives1to2 } = await import('@/data/administrator-objectives1-2');
    const { administratorObjectives3to4 } = await import('@/data/administrator-objectives3-4');
    const { administratorObjectives5to6 } = await import('@/data/administrator-objectives5-6');
    const { mcdLevel1 } = await import('@/data/mcd-level1');
    const { mcdLevel2 } = await import('@/data/mcd-level2');
    const { mcpaLevel1 } = await import('@/data/mcpa-level1');

    this.db = {
      'administrator-objectives-1-2': {
        title: 'Configuration and Setup (Objectives 1-2) - Admin',
        questions: administratorObjectives1to2
      },
      'administrator-objectives-3-4': {
        title: 'User Interface (Objectives 3-4) - Admin',
        questions: administratorObjectives3to4
      },
      'administrator-objectives-5-6': {
        title: 'Data Management (Objectives 5-6) - Admin',
        questions: administratorObjectives5to6
      },
      'mcd-level-1': {
        title: 'MCD - LEVEL 1 (Training platform)',
        questions: mcdLevel1
      },
      'mcd-level-2': {
        title: 'MCD - LEVEL 2 (Advanced)',
        questions: mcdLevel2
      },
      'mcpa-level-1': {
        title: 'MCPA - LEVEL 1',
        questions: mcpaLevel1
      }
    };
  }

  // Salvar no localStorage
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('question-cache', JSON.stringify(this.db));
    } catch (error) {
      console.error('❌ Erro ao salvar cache:', error);
    }
  }

  // Obter questões por ID do conjunto
  async getQuestions(quizSetId: string): Promise<QuizData | null> {
    await this.initialize();
    return this.db[quizSetId] || null;
  }

  // Obter todas as questões
  async getAllQuestions(): Promise<QuestionDatabase> {
    await this.initialize();
    return { ...this.db };
  }

  // Adicionar/Atualizar conjunto de questões
  async updateQuizSet(quizSetId: string, quizData: QuizData): Promise<void> {
    await this.initialize();
    this.db[quizSetId] = quizData;
    this.saveToLocalStorage();
    console.log(`✅ Conjunto ${quizSetId} atualizado`);
  }

  // Adicionar questão a um conjunto
  async addQuestion(quizSetId: string, question: Question): Promise<void> {
    await this.initialize();
    
    if (!this.db[quizSetId]) {
      this.db[quizSetId] = {
        title: `Quiz Set ${quizSetId}`,
        questions: []
      };
    }

    // Gerar ID único se não existir
    if (!question.id) {
      question.id = `${quizSetId}-${Date.now()}`;
    }

    this.db[quizSetId].questions.push(question);
    this.saveToLocalStorage();
    console.log(`✅ Questão adicionada ao conjunto ${quizSetId}`);
  }

  // Atualizar questão específica
  async updateQuestion(quizSetId: string, questionId: string, updatedQuestion: Question): Promise<void> {
    await this.initialize();
    
    const quizSet = this.db[quizSetId];
    if (!quizSet) return;

    const questionIndex = quizSet.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      quizSet.questions[questionIndex] = { ...updatedQuestion, id: questionId };
      this.saveToLocalStorage();
      console.log(`✅ Questão ${questionId} atualizada`);
    }
  }

  // Remover questão
  async removeQuestion(quizSetId: string, questionId: string): Promise<void> {
    await this.initialize();
    
    const quizSet = this.db[quizSetId];
    if (!quizSet) return;

    quizSet.questions = quizSet.questions.filter(q => q.id !== questionId);
    this.saveToLocalStorage();
    console.log(`✅ Questão ${questionId} removida`);
  }

  // Remover conjunto completo
  async removeQuizSet(quizSetId: string): Promise<void> {
    await this.initialize();
    delete this.db[quizSetId];
    this.saveToLocalStorage();
    console.log(`✅ Conjunto ${quizSetId} removido`);
  }

  // Limpar cache
  async clearCache(): Promise<void> {
    this.db = {};
    localStorage.removeItem('question-cache');
    await this.loadMockData();
    this.saveToLocalStorage();
    console.log('🗑️ Cache limpo e resetado');
  }

  // Exportar dados
  async exportData(): Promise<string> {
    await this.initialize();
    return JSON.stringify(this.db, null, 2);
  }

  // Importar dados
  async importData(jsonData: string): Promise<void> {
    try {
      const importedData = JSON.parse(jsonData);
      this.db = importedData;
      this.saveToLocalStorage();
      console.log('📥 Dados importados com sucesso');
    } catch (error) {
      console.error('❌ Erro ao importar dados:', error);
      throw new Error('Formato de dados inválido');
    }
  }

  // Estatísticas do cache
  async getCacheStats(): Promise<{
    totalQuizSets: number;
    totalQuestions: number;
    categories: string[];
    difficulties: { [key: string]: number };
  }> {
    await this.initialize();
    
    const stats = {
      totalQuizSets: Object.keys(this.db).length,
      totalQuestions: 0,
      categories: [] as string[],
      difficulties: {} as { [key: string]: number }
    };

    Object.values(this.db).forEach(quizSet => {
      stats.totalQuestions += quizSet.questions.length;
      
      quizSet.questions.forEach(question => {
        if (question.category && !stats.categories.includes(question.category)) {
          stats.categories.push(question.category);
        }
        
        if (question.difficulty) {
          stats.difficulties[question.difficulty] = (stats.difficulties[question.difficulty] || 0) + 1;
        }
      });
    });

    return stats;
  }
}

// Instância singleton
export const questionCache = new QuestionCacheService();

// Hook para usar o cache (memoizado para evitar recriações)

export const useQuestionCache = () => {
  return useMemo(() => ({
    getQuestions: questionCache.getQuestions.bind(questionCache),
    getAllQuestions: questionCache.getAllQuestions.bind(questionCache),
    updateQuizSet: questionCache.updateQuizSet.bind(questionCache),
    addQuestion: questionCache.addQuestion.bind(questionCache),
    updateQuestion: questionCache.updateQuestion.bind(questionCache),
    removeQuestion: questionCache.removeQuestion.bind(questionCache),
    removeQuizSet: questionCache.removeQuizSet.bind(questionCache),
    clearCache: questionCache.clearCache.bind(questionCache),
    exportData: questionCache.exportData.bind(questionCache),
    importData: questionCache.importData.bind(questionCache),
    getCacheStats: questionCache.getCacheStats.bind(questionCache)
  }), []); // Array vazio = nunca recria
};
