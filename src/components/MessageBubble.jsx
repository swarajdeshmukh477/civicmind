import React, { useState, useEffect } from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isLatestAiMessage }) => {
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [displayedDetails, setDisplayedDetails] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    const token = '===SHOW_MORE===';
    const parts = message.content.split(token);
    const targetSummary = parts[0];
    const targetDetails = parts.length > 1 ? parts[1].trimStart() : '';

    if (message.role === 'ai' && isLatestAiMessage && !message.isComplete) {
      setIsTyping(true);
      let currentIndex = 0;
      
      const totalLength = targetSummary.length + targetDetails.length;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < totalLength) {
          if (currentIndex < targetSummary.length) {
            setDisplayedSummary(targetSummary.substring(0, currentIndex + 1));
          } else {
            setDisplayedSummary(targetSummary);
            setDisplayedDetails(targetDetails.substring(0, currentIndex + 1 - targetSummary.length));
          }
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedSummary(targetSummary);
      setDisplayedDetails(targetDetails);
      setIsTyping(false);
    }
  }, [message.content, message.role, isLatestAiMessage, message.isComplete]);

  const hasMore = displayedDetails.length > 0 || message.content.includes('===SHOW_MORE===');

  return (
    <div className={`message-wrapper ${message.role}`}>
      <div className="message-content">
        {message.role === 'ai' && (
          <div className="avatar ai-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8" y2="16"></line>
              <line x1="16" y1="16" x2="16" y2="16"></line>
            </svg>
          </div>
        )}
        
        <div className={`message-bubble ${message.isError ? 'error-card glass-effect' : ''} ${message.isFallback ? 'fallback-card' : ''}`}>
          {message.isFallback && <div className="fallback-badge">OFFLINE MODE</div>}
          {message.isError ? (
            <div className="error-container">
              <div className="error-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div className="error-text-content">
                <h3>AI Quota Exceeded</h3>
                <p>We've reached our temporary limit for AI responses. Please wait a moment for the quota to reset.</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-content">
              {displayedSummary.split('\n').map((line, i) => (
                <div key={i} className="message-line">
                  {line.startsWith('###') ? (
                    <h4 className="line-header">{line.replace('###', '').trim()}</h4>
                  ) : (
                    line.split('**').map((part, j) => 
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )
                  )}
                </div>
              ))}
              
              {!hasMore && isTyping && <span className="typing-cursor"></span>}
              {hasMore && displayedDetails.length === 0 && isTyping && <span className="typing-cursor"></span>}

              {hasMore && displayedDetails.length > 0 && (
                <>
                  {!showFull && (
                    <div className="show-more-container">
                      <button className="show-more-btn" onClick={() => setShowFull(true)}>Show More</button>
                      {isTyping && <span className="typing-cursor"></span>}
                    </div>
                  )}
                  
                  {showFull && (
                    <div className="details-content">
                      {displayedDetails.split('\n').map((line, i) => (
                        <div key={i} className="message-line">
                          {line.split('**').map((part, j) => 
                            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                          )}
                        </div>
                      ))}
                      {isTyping && <span className="typing-cursor"></span>}
                      {!isTyping && (
                        <div className="show-less-container">
                          <button className="show-more-btn" onClick={() => setShowFull(false)}>Show Less</button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {message.role === 'user' && (
          <div className="avatar user-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
