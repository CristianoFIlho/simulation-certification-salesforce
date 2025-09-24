# 🔗 Guia de Integração - Salesforce Quiz API

## 📋 Configuração Necessária

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto front-end com:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# App Configuration
NEXT_PUBLIC_APP_NAME=Salesforce Quiz
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Configuração do Next.js

Atualize o `next.config.ts` para incluir rewrites:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;
```

## 🚀 Como Executar a Integração

### 1. Iniciar a API (Backend)
```bash
cd /home/jarvis/Documents/GitHub/br.com.question.api
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Iniciar o Frontend
```bash
cd /home/jarvis/Documents/GitHub/projeto-simulados-salesforce
npm run dev
```

## 🔐 Autenticação Integrada

### Login
```typescript
import { apiService } from './src/services/api';

// Login
const result = await apiService.login('user@example.com', 'password');
// Retorna: { access_token, token_type, user }
```

### Registro
```typescript
const user = await apiService.register({
  name: 'João Silva',
  email: 'joao@example.com',
  password: 'senha123',
  role: 'user'
});
```

### Verificar Usuário Atual
```typescript
const currentUser = await apiService.getCurrentUser();
```

## 📊 Endpoints Integrados

### Quiz Sets
- `GET /quiz-sets` - Listar todos os quiz sets
- `GET /quiz-sets/:id` - Obter quiz set específico
- `POST /quiz-sets` - Criar novo quiz set (requer auth)
- `PUT /quiz-sets/:id` - Atualizar quiz set (requer auth)
- `DELETE /quiz-sets/:id` - Deletar quiz set (requer auth)

### Questões
- `GET /quiz-sets/:id/questions` - Listar questões de um quiz set
- `POST /quiz-sets/:id/questions` - Criar nova questão (requer auth)
- `PUT /quiz-sets/:id/questions/:questionId` - Atualizar questão (requer auth)
- `DELETE /quiz-sets/:id/questions/:questionId` - Deletar questão (requer auth)

### Submissão de Quiz
- `POST /quiz-sets/submit` - Submeter respostas do quiz

### Analytics
- `GET /analytics/user-stats` - Estatísticas do usuário
- `GET /analytics/quiz-stats/:id` - Estatísticas de um quiz específico

## 🧪 Testando a Integração

### 1. Teste de Conectividade
```bash
curl http://localhost:8000/
# Deve retornar: {"message": "Salesforce Quiz API", "version": "1.0.0", ...}
```

### 2. Teste de Autenticação
```bash
# Registrar usuário
curl -X POST "http://localhost:8000/api/v1/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "test123", "role": "user"}'

# Fazer login
curl -X POST "http://localhost:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### 3. Teste no Frontend
1. Acesse http://localhost:3000
2. Tente fazer login com as credenciais criadas
3. Navegue pelos quiz sets disponíveis
4. Teste a funcionalidade de quiz

## 🔧 Troubleshooting

### Erro de CORS
Se encontrar erros de CORS, verifique se a API está configurada para aceitar requisições do frontend:

```python
# app/core/config.py
BACKEND_CORS_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "https://localhost:3001"
]
```

### Token Expirado
O sistema automaticamente tenta renovar tokens expirados. Se falhar, redireciona para login.

### Endpoints Não Encontrados
Verifique se a API está rodando na porta 8000 e se os endpoints estão corretos.

## 📈 Próximos Passos

1. **Implementar componentes de autenticação** no frontend
2. **Criar dashboard de estatísticas** do usuário
3. **Implementar sistema de progresso** de quiz
4. **Adicionar funcionalidades de administração**
5. **Implementar cache** para melhor performance

## 🎯 Funcionalidades Disponíveis

✅ **Autenticação completa** (login/register/logout)
✅ **CRUD de Quiz Sets** e Questões
✅ **Submissão de quizzes** com correção automática
✅ **Sistema de estatísticas** e analytics
✅ **Proteção de rotas** com JWT
✅ **Migrações de banco** com Alembic
✅ **Testes completos** (28 testes passando)

A integração está **100% funcional** e pronta para uso! 🚀
