import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import './ChatContainer.css';

const ChatContainer = ({ messages }) => {
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
        <div className="empty-state">
          <div className="empty-icon">🗳️</div>
          <h2>Welcome to CivicMind</h2>
          <p>I'm here to help you navigate the election process. Ask me anything about registering, finding your polling place, or understanding your ballot.</p>
          <div className="suggestion-chips">
            <button className="chip">How do I register to vote?</button>
            <button className="chip">What ID do I need to bring?</button>
            <button className="chip">Where is my polling place?</button>
          </div>
        </div>
      ) : (
        <div className="messages-list">
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
