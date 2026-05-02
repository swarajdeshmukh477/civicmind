import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatContainer.css';

const ChatContainer = ({ messages, onSendMessage, onResetMessages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const latestAiMessageIndex = messages.map(m => m.role).lastIndexOf('ai');

  return (
    <div className="chat-messages-container">
      {messages.length === 0 ? (
        <div className="hero-section">
          <h1 className="hero-title">CivicMind AI</h1>
          <p className="hero-subtitle">Understand Elections Step by Step</p>
          <div className="hero-buttons">
            <button 
              className="hero-btn primary-glow" 
              onClick={() => onSendMessage("Can you provide a step-by-step guide to the Indian election process?")}
            >
              <span>Start Guide</span>
            </button>
            <button 
              className="hero-btn secondary-glow" 
              onClick={() => onSendMessage("I have some questions about Indian elections, can you help?")}
            >
              <span>Ask AI</span>
            </button>
          </div>

          <div className="common-topics">
            <p>Common Topics:</p>
            <div className="topic-chips">
              <button className="topic-chip" onClick={() => onSendMessage("What is an EPIC Card and why is it important?")}>EPIC Voter ID</button>
              <button className="topic-chip" onClick={() => onSendMessage("Explain how to fill Form 6 for new voter registration.")}>Form 6 Guide</button>
              <button className="topic-chip" onClick={() => onSendMessage("How does EVM voting work with VVPAT?")}>EVM Voting</button>
              <button className="topic-chip" onClick={() => onSendMessage("What is the difference between Lok Sabha and Rajya Sabha?")}>Lok & Rajya Sabha</button>
              <button className="topic-chip" onClick={() => onSendMessage("How do I find my designated Polling Booth?")}>Polling Booths</button>
            </div>
          </div>

          <div className="official-resources">
            <p>Official Resources:</p>
            <div className="resource-links">
              <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer">Voter Service Portal</a>
              <span className="dot">•</span>
              <a href="https://electorallookup.eci.gov.in/" target="_blank" rel="noopener noreferrer">Search Electoral Roll</a>
              <span className="dot">•</span>
              <a href="https://results.eci.gov.in/" target="_blank" rel="noopener noreferrer">ECI Results</a>
            </div>
          </div>
        </div>
      ) : (
        <div className="messages-list">
          <button className="back-to-menu-btn" onClick={onResetMessages} title="Back to Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          {messages.map((msg, index) => (
            <MessageBubble 
              key={index} 
              message={msg} 
              isLatestAiMessage={index === latestAiMessageIndex}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
