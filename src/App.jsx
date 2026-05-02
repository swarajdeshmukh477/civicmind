import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import GuideView from './components/GuideView';
import EligibilityView from './components/EligibilityView';
import QuizView from './components/QuizView';
import TimelineView from './components/TimelineView';
import HistoryView from './components/HistoryView';
import { useChat } from './hooks/useChat';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('Chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('civicmind_theme') === 'dark';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('civicmind_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('civicmind_api_key', apiKey);
    }
  }, [apiKey]);

  useEffect(() => {
    const theme = isDarkMode ? 'dark-theme' : 'light-theme';
    document.body.className = theme;
    localStorage.setItem('civicmind_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const { messages, isLoading, sendMessage, stopGeneration, resetMessages } = useChat(apiKey);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`app-layout ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="chat-window">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
        
        {activeTab === 'Chat' ? (
          <>
            <ChatContainer 
              messages={messages} 
              onSendMessage={sendMessage} 
              onResetMessages={resetMessages} 
            />
            <ChatInput 
              onSendMessage={sendMessage} 
              isLoading={isLoading} 
              onStop={stopGeneration}
            />
          </>
        ) : activeTab === 'Guide' ? (
          <GuideView onFinish={() => setActiveTab('Chat')} />
        ) : activeTab === 'Eligibility' ? (
          <EligibilityView />
        ) : activeTab === 'Quiz' ? (
          <QuizView />
        ) : activeTab === 'Timeline' ? (
          <TimelineView />
        ) : activeTab === 'History' ? (
          <HistoryView 
            onSelectQuery={(query) => {
              sendMessage(query);
              setActiveTab('Chat');
            }} 
          />
        ) : (
          <div className="tab-placeholder">
            <h2>{activeTab} Content Coming Soon</h2>
            <p>We're working on the {activeTab.toLowerCase()} feature for CivicMind AI.</p>
            <button className="hero-btn primary-glow" onClick={() => setActiveTab('Chat')}>
              <span>Back to Chat</span>
            </button>
          </div>
        )}
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
