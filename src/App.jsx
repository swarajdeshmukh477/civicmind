import React from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const { messages, isLoading, sendMessage } = useChat();

  return (
    <div className="app-layout">
      <div className="chat-window">
        <Header />
        <ChatContainer messages={messages} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
