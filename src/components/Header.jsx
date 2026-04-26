import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <h1 className="app-title">CivicMind</h1>
      </div>
      <p className="app-subtitle">Your AI Election Assistant</p>
    </header>
  );
};

export default Header;
