import React, { useState, useEffect } from 'react';
import './HistoryView.css';

const HistoryView = ({ onSelectQuery }) => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('civicmind_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your search history?")) {
      localStorage.removeItem('civicmind_history');
      setHistory([]);
    }
  };

  const filteredHistory = history.filter(query => 
    query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategory = (query) => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('epic') || lowerQuery.includes('voter id')) return 'EPIC';
    if (lowerQuery.includes('register') || lowerQuery.includes('form') || lowerQuery.includes('apply')) return 'Registration';
    if (lowerQuery.includes('evm') || lowerQuery.includes('vvpat') || lowerQuery.includes('machine')) return 'EVM';
    if (lowerQuery.includes('eligible') || lowerQuery.includes('age') || lowerQuery.includes('who can')) return 'Eligibility';
    if (lowerQuery.includes('vote') || lowerQuery.includes('election')) return 'Voting';
    return 'General';
  };

  return (
    <div className="history-view glass-container">
      <div className="history-dashboard">
        <header className="dashboard-header">
          <div className="header-text">
            <h2 className="view-title">Conversation History</h2>
            <p className="view-subtitle">Access your previous election queries and insights.</p>
          </div>
          
          <div className="header-actions">
            <div className="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search queries..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="history-search-input"
              />
            </div>
            
            {history.length > 0 && (
              <button className="clear-dashboard-btn" onClick={clearHistory}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Clear</span>
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-content">
          {history.length === 0 ? (
            <div className="empty-dashboard">
              <div className="empty-visual">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>No History Found</h3>
              <p>Start a conversation to see your previous queries here.</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="no-results">
              <p>No results matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="history-grid">
              {filteredHistory.map((query, index) => (
                <div 
                  key={index} 
                  className={`history-card glass-card cat-${getCategory(query).toLowerCase()}`}
                  onClick={() => onSelectQuery(query)}
                >
                  <div className="card-header">
                    <span className="card-badge">{getCategory(query)}</span>
                    <span className="card-time">Recent</span>
                  </div>
                  <div className="card-body">
                    <p className="query-text">{query}</p>
                  </div>
                  <div className="card-footer">
                    <span className="view-action">Reload Session</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
