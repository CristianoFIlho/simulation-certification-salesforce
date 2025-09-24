# Simulados Salesforce - Next.js

Este é o projeto migrado dos simulados para certificações Salesforce, convertido de uma aplicação HTML/JavaScript estática para uma aplicação Next.js moderna com TypeScript.

## Características da Migração

### Estrutura Original
- **Estrutura**: HTML estático com JavaScript vanilla
- **Styling**: Bootstrap CDN
- **Navegação**: Links relativos entre páginas
- **Dados**: Arquivos `.js` com arrays de questões
- **Estado**: localStorage para progresso

### Nova Estrutura Next.js
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Styling**: Bootstrap (instalado localmente) + CSS modules
- **Navegação**: Next.js Router com componentes Link
- **Dados**: Arquivos TypeScript tipados
- **Estado**: React hooks + localStorage

## Funcionalidades Migradas

### ✅ Implementado
1. **Header e Footer responsivos** - Convertidos para componentes React
2. **Sistema de Quiz** - Componente reutilizável para todas as seções
3. **Randomização** - Questões e respostas embaralhadas opcionalmente
4. **Progresso salvo** - localStorage mantém posição atual
5. **Justificativas** - Exibidas após resposta correta
6. **Screenshots** - Suporte a imagens das questões
7. **Links de referência** - Links externos para documentação
8. **Múltiplos tipos de questão** - Radio buttons e checkboxes

### 📂 Estrutura de Arquivos

```
src/
├── app/
│   ├── administrator/          # Seção Administrator
│   │   ├── objectives1-2/
│   │   ├── objectives3-4/
│   │   └── objectives5-6/
│   ├── mulesoft/              # Seção Mulesoft
│   │   ├── mcd-level-1/
│   │   ├── mcd-level-2/
│   │   └── mcpa-level-1/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── QuizComponent.tsx
│   └── BootstrapClient.tsx
├── data/                      # Dados das questões
│   ├── administrator-objectives1-2.ts
│   ├── administrator-objectives3-4.ts
│   ├── administrator-objectives5-6.ts
│   ├── mcd-level1.ts
│   ├── mcd-level2.ts
│   └── mcpa-level1.ts
└── types/
    └── quiz.ts               # Interfaces TypeScript
```

## Seções Disponíveis

### Administrator
- Configuration and Setup (Objectives 1-2)
- Configuration and Setup (Objectives 3-4)
- Configuration and Setup (Objectives 5-6)

### Mulesoft
- MCD - LEVEL 1 (Training platform)
- MCD - LEVEL 2 (Training platform)
- MCPA - LEVEL 1 (Training platform)

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start
```

## Como Adicionar Novas Questões

1. Edite o arquivo correspondente em `src/data/`
2. Siga a interface `Question` definida em `src/types/quiz.ts`
3. As questões suportam:
   - Múltipla escolha (radio)
   - Múltiplas respostas (checkbox)
   - Justificativas
   - Links de referência
   - Screenshots
   - Vídeos

Exemplo:
```typescript
{
  question: "Sua pergunta aqui",
  type: "radio", // ou "checkbox"
  options: [
    "Opção A",
    "Opção B",
    "Opção C",
    "Opção D"
  ],
  correctAnswer: 0, // ou [0, 2] para múltiplas respostas
  justification: "Explicação da resposta",
  referenceLinks: ["https://exemplo.com"],
  screenshots: ["/images/screenshot.png"],
  videos: ["/videos/video.mp4"]
}
```

## Melhorias Implementadas

1. **Type Safety**: TypeScript previne erros de tipos
2. **Performance**: Next.js otimiza carregamento e navegação
3. **SEO**: Meta tags e estrutura otimizada
4. **Mobile First**: Design responsivo melhorado
5. **Manutenibilidade**: Código componentizado e reutilizável
6. **Desenvolvimento**: Hot reload e ferramentas modernas

## Próximos Passos

- [ ] Migrar todas as questões dos arquivos originais
- [ ] Implementar sistema de pontuação
- [ ] Adicionar timer para simulados
- [ ] Criar página de resultados e estatísticas
- [ ] Implementar autenticação de usuários
- [ ] Adicionar sistema de progresso por seção
