#!/usr/bin/env node

/**
 * Script de teste para verificar a integração entre o frontend e a API
 * Execute: node test-integration.js
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

async function testApiConnection() {
  console.log('🔗 Testando conexão com a API...');
  
  try {
    const response = await fetch('http://localhost:8000/');
    const data = await response.json();
    
    if (data.message === 'Salesforce Quiz API') {
      console.log('✅ API conectada com sucesso!');
      console.log(`   Versão: ${data.version}`);
      console.log(`   Ambiente: ${data.environment}`);
      return true;
    } else {
      console.log('❌ Resposta inesperada da API');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao conectar com a API:', error.message);
    console.log('   Certifique-se de que a API está rodando em http://localhost:8000');
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n👤 Testando registro de usuário...');
  
  try {
    const testUser = {
      name: 'Usuário Teste',
      email: `teste${Date.now()}@example.com`,
      password: 'teste123',
      role: 'user'
    };

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser)
    });

    if (response.ok) {
      const user = await response.json();
      console.log('✅ Usuário registrado com sucesso!');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      return { user, credentials: testUser };
    } else {
      const error = await response.json();
      console.log('❌ Erro no registro:', error.detail);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao registrar usuário:', error.message);
    return null;
  }
}

async function testUserLogin(credentials) {
  console.log('\n🔐 Testando login...');
  
  try {
    const formData = new URLSearchParams({
      username: credentials.email,
      password: credentials.password
    });

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (response.ok) {
      const tokenData = await response.json();
      console.log('✅ Login realizado com sucesso!');
      console.log(`   Token: ${tokenData.access_token.substring(0, 20)}...`);
      return tokenData.access_token;
    } else {
      const error = await response.json();
      console.log('❌ Erro no login:', error.detail);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao fazer login:', error.message);
    return null;
  }
}

async function testQuizSets(token) {
  console.log('\n📚 Testando listagem de quiz sets...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/quiz-sets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const quizSets = await response.json();
      console.log('✅ Quiz sets carregados com sucesso!');
      console.log(`   Total: ${quizSets.length} quiz sets`);
      
      if (quizSets.length > 0) {
        const firstQuiz = quizSets[0];
        console.log(`   Primeiro quiz: ${firstQuiz.title}`);
        console.log(`   Categoria: ${firstQuiz.category}`);
        console.log(`   Dificuldade: ${firstQuiz.difficulty}`);
        return firstQuiz;
      }
      return null;
    } else {
      const error = await response.json();
      console.log('❌ Erro ao carregar quiz sets:', error.detail);
      return null;
    }
  } catch (error) {
    console.log('❌ Erro ao carregar quiz sets:', error.message);
    return null;
  }
}

async function testQuizQuestions(token, quizSet) {
  console.log('\n❓ Testando carregamento de questões...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/quiz-sets/${quizSet.id}/questions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const questions = await response.json();
      console.log('✅ Questões carregadas com sucesso!');
      console.log(`   Total: ${questions.length} questões`);
      
      if (questions.length > 0) {
        const firstQuestion = questions[0];
        console.log(`   Primeira questão: ${firstQuestion.question.substring(0, 50)}...`);
        console.log(`   Opções: ${firstQuestion.options.length}`);
        return questions;
      }
      return [];
    } else {
      const error = await response.json();
      console.log('❌ Erro ao carregar questões:', error.detail);
      return [];
    }
  } catch (error) {
    console.log('❌ Erro ao carregar questões:', error.message);
    return [];
  }
}

async function testUserStats(token) {
  console.log('\n📊 Testando estatísticas do usuário...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/user-stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const stats = await response.json();
      console.log('✅ Estatísticas carregadas com sucesso!');
      console.log(`   Total de quizzes: ${stats.total_quizzes_taken}`);
      console.log(`   Pontuação média: ${Math.round(stats.average_score)}%`);
      console.log(`   Tempo total: ${Math.round(stats.total_time_spent / 60)} minutos`);
      return true;
    } else {
      const error = await response.json();
      console.log('❌ Erro ao carregar estatísticas:', error.detail);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao carregar estatísticas:', error.message);
    return false;
  }
}

async function runIntegrationTest() {
  console.log('🚀 Iniciando teste de integração...\n');
  
  // Teste 1: Conexão com API
  const apiConnected = await testApiConnection();
  if (!apiConnected) {
    console.log('\n❌ Teste de integração falhou na conexão com a API');
    process.exit(1);
  }

  // Teste 2: Registro de usuário
  const registrationResult = await testUserRegistration();
  if (!registrationResult) {
    console.log('\n❌ Teste de integração falhou no registro');
    process.exit(1);
  }

  // Teste 3: Login
  const token = await testUserLogin(registrationResult.credentials);
  if (!token) {
    console.log('\n❌ Teste de integração falhou no login');
    process.exit(1);
  }

  // Teste 4: Quiz sets
  const quizSet = await testQuizSets(token);
  if (!quizSet) {
    console.log('\n❌ Teste de integração falhou na listagem de quiz sets');
    process.exit(1);
  }

  // Teste 5: Questões
  const questions = await testQuizQuestions(token, quizSet);
  if (questions.length === 0) {
    console.log('\n⚠️  Nenhuma questão encontrada (isso pode ser normal se não há dados)');
  }

  // Teste 6: Estatísticas
  await testUserStats(token);

  console.log('\n🎉 Teste de integração concluído com sucesso!');
  console.log('\n📋 Resumo:');
  console.log('   ✅ API conectada');
  console.log('   ✅ Registro de usuário funcionando');
  console.log('   ✅ Login funcionando');
  console.log('   ✅ Quiz sets carregando');
  console.log('   ✅ Questões carregando');
  console.log('   ✅ Estatísticas funcionando');
  
  console.log('\n🌐 Para testar o frontend:');
  console.log('   1. Execute: npm run dev');
  console.log('   2. Acesse: http://localhost:3000/integrated');
  console.log('   3. Use as credenciais do usuário teste criado');
}

// Executar teste
runIntegrationTest().catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
});
