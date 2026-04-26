import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('civicmind_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('civicmind_api_key', apiKey);
    }
  }, [apiKey]);

  const { messages, isLoading, sendMessage } = useChat(apiKey);

  return (
    <div className="app-layout">
      <div className="chat-window">
        <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        <ChatContainer messages={messages} />
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}

export default App;
