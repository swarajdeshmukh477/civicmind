import React, { useState, useEffect } from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message, isLatestAiMessage }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (message.role === 'ai' && isLatestAiMessage && !message.isComplete) {
      setIsTyping(true);
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedText(message.content.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          // Assuming a callback to mark message complete could go here if needed
        }
      }, 15); // Adjust speed here

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.content);
      setIsTyping(false);
    }
  }, [message.content, message.role, isLatestAiMessage, message.isComplete]);

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
        
        <div className={`message-bubble`}>
          <div className="text-content">
            {displayedText}
            {isTyping && <span className="typing-cursor"></span>}
          </div>
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
