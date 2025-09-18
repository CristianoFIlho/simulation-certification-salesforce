// Exemplo de como criar questões com todas as funcionalidades implementadas

import { Question } from "@/types/quiz";

export const exemploQuestoes: Question[] = [
  {
    id: 1,
    question: "Qual é a melhor prática para implementar um Lightning Web Component que precisa se comunicar com o Apex?",
    options: [
      "Usar @wire decorator com métodos Apex",
      "Implementar communication via Lightning Message Service",
      "Utilizar apenas JavaScript puro sem decorators",
      "Usar window.postMessage() para comunicação"
    ],
    correctAnswer: 0,
    explanation: `
      O @wire decorator é a melhor prática para conectar Lightning Web Components com métodos Apex.
      Ele fornece reatividade automática, cache inteligente e otimização de performance.
      
      **Por que é a melhor opção:**
      - Reatividade automática quando dados mudam
      - Cache inteligente reduz chamadas desnecessárias
      - Integração nativa com o Lightning Data Service
      - Melhor performance e experiência do usuário
    `,
    
    // Metadados da questão
    category: "Lightning Web Components",
    difficulty: "medium",
    tags: ["LWC", "Apex", "@wire", "Best Practices"],
    
    // Sistema de dicas
    hints: [
      "Pense em reatividade e performance automática",
      "Considere a integração nativa com Lightning Data Service",
      "Lembre-se dos decorators específicos do LWC framework"
    ],
    
    // Referências para estudo
    referenceLinks: [
      {
        title: "Lightning Web Components Developer Guide",
        url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc",
        description: "Documentação oficial completa sobre Lightning Web Components"
      },
      {
        title: "Wire Service to Apex Methods",
        url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.data_wire_service_about",
        description: "Guia específico sobre como usar @wire com métodos Apex"
      },
      {
        title: "LWC Recipes - GitHub",
        url: "https://github.com/trailheadapps/lwc-recipes",
        description: "Exemplos práticos e receitas para Lightning Web Components"
      }
    ],
    
    // Recursos de vídeo
    videoResources: [
      {
        title: "Lightning Web Components Fundamentals",
        url: "https://www.youtube.com/watch?v=VaVm8NAq4xQ",
        description: "Conceitos fundamentais e melhores práticas para LWC",
        duration: "25:30"
      },
      {
        title: "@wire Decorator Deep Dive",
        url: "https://www.youtube.com/watch?v=example2",
        description: "Entendendo profundamente o @wire decorator",
        duration: "18:45"
      }
    ],
    
    // Informações técnicas
    timeLimit: 90, // segundos
    points: 10,
    chapter: "Development Fundamentals",
    
    // Metadados de qualidade
    lastUpdated: new Date("2024-01-15"),
    reviewStatus: "approved",
    difficultyRating: 3.5,
    successRate: 0.72
  },
  
  {
    id: 2,
    question: "Em uma integração REST API, qual é a melhor abordagem para gerenciar autenticação OAuth 2.0 no Salesforce?",
    options: [
      "Armazenar tokens em campos de texto personalizados",
      "Usar Named Credentials com Auth Providers",
      "Hardcodar credenciais no código Apex",
      "Utilizar apenas Session ID para autenticação"
    ],
    correctAnswer: 1,
    explanation: `
      Named Credentials com Auth Providers é a abordagem mais segura e recomendada pela Salesforce.
      
      **Vantagens:**
      - Gerenciamento seguro de credenciais
      - Renovação automática de tokens
      - Controle granular de permissões
      - Separação entre código e configuração
      - Auditoria e monitoramento integrados
      
      **Por que outras opções não são ideais:**
      - Campos personalizados: Exposição desnecessária de dados sensíveis
      - Hardcode: Violação de segurança e manutenibilidade
      - Session ID: Limitado para integrações externas
    `,
    
    category: "Integration",
    difficulty: "hard",
    tags: ["REST API", "OAuth 2.0", "Named Credentials", "Security"],
    
    hints: [
      "Pense em segurança e gerenciamento automático de tokens",
      "Considere as features nativas do Salesforce para integração",
      "Lembre-se da separação entre configuração e código"
    ],
    
    referenceLinks: [
      {
        title: "Named Credentials Setup Guide",
        url: "https://help.salesforce.com/s/articleView?id=sf.named_credentials_about.htm",
        description: "Guia oficial para configuração de Named Credentials"
      },
      {
        title: "OAuth 2.0 Integration Patterns",
        url: "https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_oauth_and_connected_apps.htm",
        description: "Padrões de integração OAuth 2.0 no Salesforce"
      }
    ],
    
    videoResources: [
      {
        title: "Salesforce Integration Patterns",
        url: "https://www.youtube.com/watch?v=integration_example",
        description: "Padrões de integração e melhores práticas",
        duration: "32:15"
      }
    ],
    
    timeLimit: 120,
    points: 15,
    chapter: "Integration Architecture",
    
    lastUpdated: new Date("2024-01-10"),
    reviewStatus: "approved",
    difficultyRating: 4.2,
    successRate: 0.58
  }
];

// Exemplo de como usar no componente:
/*
import { exemploQuestoes } from './exemplo-questoes';

<QuizComponent 
  questions={exemploQuestoes}
  title="Exemplo: Desenvolvimento e Integração"
/>
*/
