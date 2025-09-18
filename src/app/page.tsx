"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <div className="quiz-container" style={{ paddingTop: '40px' }}>
        {/* Hero Section */}
        <div className="hero-section" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '3.5em', 
            fontWeight: 'bold', 
            marginBottom: '20px',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎯 Simulados Salesforce
          </h1>
          <p style={{ 
            fontSize: '1.4em', 
            marginBottom: '30px',
            opacity: 0.9 
          }}>
            Prepare-se para suas certificações com nossos simulados interativos
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '15px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p style={{ fontSize: '1.1em', margin: 0 }}>
              ✅ Questões atualizadas • ✅ Feedback detalhado • ✅ Progresso salvo
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <div className="cards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          
          {/* Administrator Card */}
          <div className="certification-card">
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ 
                fontSize: '4em', 
                marginBottom: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                👨‍💼
              </div>
              <h3 style={{ 
                color: '#495057', 
                fontSize: '1.8em', 
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                Salesforce Administrator
              </h3>
              <p style={{ 
                color: '#6c757d', 
                fontSize: '1.1em',
                lineHeight: '1.6'
              }}>
                Configure e gerencie organizações Salesforce com confiança
              </p>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057' }}>📚 Objetivos disponíveis:</strong>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0 
              }}>
                <li style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f1f3f4',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Configuration & Setup (1-2)</span>
                  <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓</span>
                </li>
                <li style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f1f3f4',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Configuration & Setup (3-4)</span>
                  <span style={{ color: '#ffc107' }}>⏳</span>
                </li>
                <li style={{ 
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Configuration & Setup (5-6)</span>
                  <span style={{ color: '#ffc107' }}>⏳</span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="/administrator/objectives1-2"
              className="cta-button admin"
            >
              🚀 Começar Simulado
            </Link>
          </div>

          {/* MuleSoft Card */}
          <div className="certification-card">
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ 
                fontSize: '4em', 
                marginBottom: '15px',
                background: 'linear-gradient(135deg, #20c997 0%, #28a745 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                🔧
              </div>
              <h3 style={{ 
                color: '#495057', 
                fontSize: '1.8em', 
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                MuleSoft Certified
              </h3>
              <p style={{ 
                color: '#6c757d', 
                fontSize: '1.1em',
                lineHeight: '1.6'
              }}>
                Domine integração e APIs com MuleSoft
              </p>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <div style={{ marginBottom: '15px' }}>
                <strong style={{ color: '#495057' }}>🎯 Certificações:</strong>
              </div>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0 
              }}>
                <li style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f1f3f4',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>MCD - Level 1</span>
                  <span style={{ color: '#ffc107' }}>⏳</span>
                </li>
                <li style={{ 
                  padding: '8px 0', 
                  borderBottom: '1px solid #f1f3f4',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>MCD - Level 2</span>
                  <span style={{ color: '#ffc107' }}>⏳</span>
                </li>
                <li style={{ 
                  padding: '8px 0',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>MCPA - Level 1</span>
                  <span style={{ color: '#ffc107' }}>⏳</span>
                </li>
              </ul>
            </div>
            
            <Link 
              href="/mulesoft/mcd-level-1"
              className="cta-button mulesoft"
            >
              🚀 Começar Simulado
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
          marginBottom: '50px'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            color: '#495057', 
            marginBottom: '40px',
            fontSize: '2.5em',
            fontWeight: 'bold'
          }}>
            ⭐ Por que escolher nossos simulados?
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>🎯</div>
              <h4 style={{ color: '#495057', marginBottom: '15px' }}>Questões Atualizadas</h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Baseadas nos objetivos oficiais mais recentes das certificações
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>💡</div>
              <h4 style={{ color: '#495057', marginBottom: '15px' }}>Feedback Detalhado</h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Explicações completas e links para documentação oficial
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
              <h4 style={{ color: '#495057', marginBottom: '15px' }}>Progresso Salvo</h4>
              <p style={{ color: '#6c757d', lineHeight: '1.6' }}>
                Continue de onde parou, seu progresso é salvo automaticamente
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
