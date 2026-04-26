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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <label htmlFor="apiKey">Google Gemini API Key</label>
          <input
            id="apiKey"
            type="password"
            placeholder="Paste your API key here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <p className="help-text">
            You can get a free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>. 
            Your key is stored locally in your browser and is never sent to our servers.
          </p>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
