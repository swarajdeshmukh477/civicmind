import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  const [inputValue, setInputValue] = useState(apiKey || '');

  useEffect(() => {
    setInputValue(apiKey || '');
  }, [apiKey, isOpen]);

  const handleSave = () => {
    setApiKey(inputValue.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-icon" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-header">
          <div className="header-icon">⚙️</div>
          <div className="header-text">
            <h2>System Settings</h2>
            <p>Configure your AI preferences</p>
          </div>
        </div>

        <div className="modal-body">
          <div className="setting-group">
            <label htmlFor="apiKey">
              <span>Google Gemini API Key</span>
              <span className="badge">Required</span>
            </label>
            <div className="input-wrapper">
              <input
                id="apiKey"
                type="password"
                placeholder="Paste your API key here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="input-icon">🔑</div>
            </div>
            <p className="help-text">
              Don't have a key? Get one for free at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
            </p>
          </div>

          <div className="privacy-notice">
            <span className="notice-icon">🛡️</span>
            <p>Your API key is stored locally in your browser and is never sent to our servers.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn secondary" onClick={() => {
            localStorage.removeItem('civicmind_api_key');
            setInputValue(import.meta.env.VITE_GEMINI_API_KEY || '');
          }}>Reset to Default</button>
          <div className="footer-actions">
            <button className="modal-btn secondary" onClick={onClose}>Discard</button>
            <button className="modal-btn primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
