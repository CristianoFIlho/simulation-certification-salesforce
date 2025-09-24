import { Question } from "@/types/quiz";

export const mcdLevel2: Question[] = [
  {
    id: "mcd2-001",
    question: "What is the primary purpose of a Lightning Web Component (LWC) in Salesforce development?",
    type: "radio",
    options: [
      "To replace all Visualforce pages in the org",
      "To create modern, performant user interfaces using web standards",
      "To automatically generate database schemas",
      "To manage user permissions and security settings"
    ],
    correctAnswer: 1,
    justification: "Lightning Web Components (LWC) are designed to create modern, performant user interfaces using web standards like HTML, CSS, and JavaScript. They provide better performance than Aura components and follow modern web development practices.",
    referenceLinks: [
      {
        title: "Lightning Web Components Developer Guide",
        url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc",
        type: "documentation"
      },
      {
        title: "Lightning Web Components Trailhead",
        url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-basics",
        type: "trailhead"
      }
    ],
    screenshots: ["/images/mcd2/lwc-architecture.jpg"],
    videos: [
      {
        title: "Introduction to Lightning Web Components",
        url: "https://salesforce.vidyard.com/watch/lwc-intro",
        duration: "15:30",
        thumbnail: "/images/mcd2/lwc-video-thumb.jpg"
      }
    ],
    difficulty: "medium",
    category: "Lightning Development",
    tags: ["LWC", "Lightning", "Components", "Web Standards"],
    timeLimit: 90,
    points: 10,
    explanation: "LWC leverages native browser APIs and modern JavaScript features to deliver superior performance and developer experience.",
    hints: [
      "Think about modern web development standards",
      "Consider performance implications",
      "Focus on the primary architectural benefit"
    ]
  },
  {
    id: "mcd2-002",
    question: "Which of the following are valid lifecycle hooks in Lightning Web Components? (Select all that apply)",
    type: "checkbox",
    options: [
      "connectedCallback()",
      "disconnectedCallback()",
      "renderedCallback()",
      "errorCallback()",
      "initCallback()",
      "destroyCallback()"
    ],
    correctAnswer: [0, 1, 2, 3],
    justification: "Valid LWC lifecycle hooks include connectedCallback(), disconnectedCallback(), renderedCallback(), and errorCallback(). The initCallback() and destroyCallback() are not standard LWC lifecycle hooks.",
    referenceLinks: [
      {
        title: "LWC Lifecycle Hooks Documentation",
        url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_lifecycle",
        type: "documentation"
      }
    ],
    screenshots: ["/images/mcd2/lwc-lifecycle.jpg"],
    videos: [],
    difficulty: "hard",
    category: "Lightning Development",
    tags: ["LWC", "Lifecycle", "Hooks", "Component Development"],
    timeLimit: 120,
    points: 15,
    explanation: "Understanding lifecycle hooks is crucial for proper component initialization, cleanup, and event handling in LWC development.",
    hints: [
      "Some options might not be valid LWC hooks",
      "Consider standard web component lifecycle patterns",
      "Think about when components are created and destroyed"
    ]
  },
  {
    id: "mcd2-003",
    question: "What is the correct way to import a custom Apex method in a Lightning Web Component?",
    type: "radio",
    options: [
      "import getAccounts from '@salesforce/apex/AccountController.getAccounts';",
      "import { getAccounts } from '@salesforce/apex/AccountController';",
      "import AccountController.getAccounts from '@salesforce/apex';",
      "import apex.AccountController.getAccounts from '@salesforce/core';"
    ],
    correctAnswer: 0,
    justification: "The correct syntax to import an Apex method in LWC is: import methodName from '@salesforce/apex/ClassName.methodName'. This follows the ES6 module import syntax specific to Salesforce's LWC framework.",
    referenceLinks: [
      {
        title: "Call Apex Methods from LWC",
        url: "https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.apex",
        type: "documentation"
      },
      {
        title: "Apex Integration Trailhead",
        url: "https://trailhead.salesforce.com/content/learn/modules/lightning-web-components-and-salesforce-data/apex-integration",
        type: "trailhead"
      }
    ],
    screenshots: ["/images/mcd2/apex-import-syntax.jpg"],
    videos: [],
    difficulty: "medium",
    category: "Apex Integration",
    tags: ["LWC", "Apex", "Import", "Integration"],
    timeLimit: 60,
    points: 8,
    explanation: "Proper import syntax is essential for connecting LWC components with Apex backend logic.",
    hints: [
      "Look for the @salesforce/apex prefix",
      "Consider ES6 import syntax patterns",
      "The format includes ClassName.methodName"
    ]
  },
  {
    id: "mcd2-004",
    question: "Which MuleSoft Anypoint Platform component is primarily responsible for API management and security?",
    type: "radio",
    options: [
      "Anypoint Studio",
      "Anypoint API Manager",
      "Anypoint Runtime Manager",
      "Anypoint Exchange"
    ],
    correctAnswer: 1,
    justification: "Anypoint API Manager is the component specifically designed for API management, including security policies, SLA management, analytics, and API gateway functionality. It provides comprehensive API lifecycle management capabilities.",
    referenceLinks: [
      {
        title: "Anypoint API Manager Documentation",
        url: "https://docs.mulesoft.com/api-manager/2.x/",
        type: "documentation"
      },
      {
        title: "API Management Fundamentals",
        url: "https://training.mulesoft.com/course/api-management-fundamentals",
        type: "trailhead"
      }
    ],
    screenshots: ["/images/mcd2/api-manager-overview.jpg"],
    videos: [
      {
        title: "API Manager Overview",
        url: "https://mulesoft.com/videos/api-manager-demo",
        duration: "12:45",
        thumbnail: "/images/mcd2/api-manager-video.jpg"
      }
    ],
    difficulty: "easy",
    category: "API Management",
    tags: ["API Manager", "Security", "Policies", "Gateway"],
    timeLimit: 45,
    points: 6,
    explanation: "API Manager acts as the central hub for managing APIs throughout their lifecycle, from design to retirement.",
    hints: [
      "Focus on the management aspect of APIs",
      "Consider which tool handles security policies",
      "Think about API gateway functionality"
    ]
  },
  {
    id: "mcd2-005",
    question: "In MuleSoft, what are the key benefits of using DataWeave for data transformation? (Select all that apply)",
    type: "checkbox",
    options: [
      "Functional programming approach",
      "Built-in support for multiple data formats",
      "Visual data mapping interface",
      "Automatic performance optimization",
      "Type-safe transformations",
      "Real-time streaming capabilities"
    ],
    correctAnswer: [0, 1, 2, 4],
    justification: "DataWeave provides a functional programming approach, built-in support for multiple data formats (JSON, XML, CSV, etc.), visual data mapping interface in Anypoint Studio, and type-safe transformations. While it's optimized for performance, it doesn't provide automatic optimization, and real-time streaming is handled by other Mule components.",
    referenceLinks: [
      {
        title: "DataWeave Language Reference",
        url: "https://docs.mulesoft.com/dataweave/2.4/",
        type: "documentation"
      },
      {
        title: "DataWeave Tutorial",
        url: "https://training.mulesoft.com/course/dataweave-fundamentals",
        type: "trailhead"
      }
    ],
    screenshots: ["/images/mcd2/dataweave-transform.jpg"],
    videos: [],
    difficulty: "hard",
    category: "Data Transformation",
    tags: ["DataWeave", "Transformation", "Functional Programming", "Type Safety"],
    timeLimit: 150,
    points: 20,
    explanation: "DataWeave is MuleSoft's powerful transformation language that combines functional programming principles with enterprise-grade data processing capabilities.",
    hints: [
      "Consider the programming paradigm used by DataWeave",
      "Think about format support and visual tools",
      "Focus on transformation safety and reliability"
    ]
  }
];
