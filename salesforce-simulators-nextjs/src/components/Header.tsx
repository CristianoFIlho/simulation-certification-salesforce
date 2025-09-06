"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e9ecef',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 20px'
        }}>
          {/* Logo */}
          <Link 
            href="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: '#495057',
              fontWeight: 'bold',
              fontSize: '1.4em'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
            </div>
            <span>Simulados Salesforce</span>
          </Link>

          {/* Desktop Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px'
          }} className="d-none d-lg-flex">
            
            <Link 
              href="/" 
              style={{
                textDecoration: 'none',
                color: '#495057',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#495057';
              }}
            >
              🏠 Home
            </Link>

            {/* Administrator Dropdown */}
            <div className="dropdown">
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#495057',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                data-bs-toggle="dropdown"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#495057';
                }}
              >
                👨‍💼 Administrator ▼
              </button>
              <ul className="dropdown-menu" style={{
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '10px',
                minWidth: '280px'
              }}>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/administrator/objectives1-2"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#28a745' }}>✓</span>
                    Configuration and Setup (1-2)
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/administrator/objectives3-4"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#ffc107' }}>⏳</span>
                    Configuration and Setup (3-4)
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/administrator/objectives5-6"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#ffc107' }}>⏳</span>
                    Configuration and Setup (5-6)
                  </Link>
                </li>
              </ul>
            </div>

            {/* MuleSoft Dropdown */}
            <div className="dropdown">
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#495057',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                data-bs-toggle="dropdown"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.color = '#20c997';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#495057';
                }}
              >
                🔧 MuleSoft ▼
              </button>
              <ul className="dropdown-menu" style={{
                border: 'none',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '10px',
                minWidth: '280px'
              }}>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/mulesoft/mcd-level-1"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#ffc107' }}>⏳</span>
                    MCD - LEVEL 1
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/mulesoft/mcd-level-2"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#ffc107' }}>⏳</span>
                    MCD - LEVEL 2
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    href="/mulesoft/mcpa-level-1"
                    style={{
                      borderRadius: '8px',
                      padding: '12px 16px',
                      margin: '2px 0',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ color: '#ffc107' }}>⏳</span>
                    MCPA - LEVEL 1
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="d-lg-none"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5em',
              color: '#495057',
              cursor: 'pointer'
            }}
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isNavOpen && (
          <div 
            className="d-lg-none" 
            style={{
              borderTop: '1px solid #e9ecef',
              padding: '20px',
              background: '#f8f9fa'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Link 
                href="/" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  fontWeight: '600',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'white'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                🏠 Home
              </Link>
              
              <div style={{ color: '#6c757d', fontWeight: 'bold', marginTop: '10px' }}>
                👨‍💼 Administrator
              </div>
              <Link 
                href="/administrator/objectives1-2" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ✓ Configuration and Setup (1-2)
              </Link>
              <Link 
                href="/administrator/objectives3-4" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ⏳ Configuration and Setup (3-4)
              </Link>
              <Link 
                href="/administrator/objectives5-6" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ⏳ Configuration and Setup (5-6)
              </Link>
              
              <div style={{ color: '#6c757d', fontWeight: 'bold', marginTop: '15px' }}>
                🔧 MuleSoft
              </div>
              <Link 
                href="/mulesoft/mcd-level-1" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ⏳ MCD - LEVEL 1
              </Link>
              <Link 
                href="/mulesoft/mcd-level-2" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ⏳ MCD - LEVEL 2
              </Link>
              <Link 
                href="/mulesoft/mcpa-level-1" 
                style={{
                  textDecoration: 'none',
                  color: '#495057',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.95em'
                }}
                onClick={() => setIsNavOpen(false)}
              >
                ⏳ MCPA - LEVEL 1
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
