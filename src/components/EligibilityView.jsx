import React, { useState } from 'react';
import './EligibilityView.css';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const EligibilityView = () => {
  const [age, setAge] = useState('');
  const [state, setState] = useState('');
  const [isCitizen, setIsCitizen] = useState(null);
  const [result, setResult] = useState(null);

  const checkEligibility = (e) => {
    e.preventDefault();
    
    if (!age || !state || isCitizen === null) {
      return;
    }

    const ageNum = parseInt(age);
    let eligible = true;
    let reasons = [];

    if (ageNum < 18) {
      eligible = false;
      reasons.push('You must be at least 18 years old to vote.');
    }

    if (isCitizen === false) {
      eligible = false;
      reasons.push('You must be an Indian citizen to vote in elections.');
    }

    setResult({
      isEligible: eligible,
      message: eligible 
        ? `Great news! Based on your information, you are likely eligible to vote in ${state}.` 
        : `You may not be eligible to vote yet.`,
      reasons: reasons
    });
  };

  const resetForm = () => {
    setAge('');
    setState('');
    setIsCitizen(null);
    setResult(null);
  };

  return (
    <div className="eligibility-view">
      <div className="eligibility-container">
        <h2 className="view-title">Voter Eligibility Checker</h2>
        <p className="view-description">Enter your details below to check if you are eligible to register and vote.</p>

        {!result ? (
          <form className="eligibility-form" onSubmit={checkEligibility}>
            <div className="form-group">
              <label htmlFor="age">How old are you?</label>
              <input 
                type="number" 
                id="age" 
                value={age} 
                onChange={(e) => setAge(e.target.value)} 
                placeholder="Enter your age"
                required
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">Which state do you live in?</label>
              <select 
                id="state" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="" disabled>Select your state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Are you an Indian Citizen?</label>
              <div className="radio-group">
                <button 
                  type="button" 
                  className={`radio-btn ${isCitizen === true ? 'active' : ''}`}
                  onClick={() => setIsCitizen(true)}
                >
                  Yes
                </button>
                <button 
                  type="button" 
                  className={`radio-btn ${isCitizen === false ? 'active' : ''}`}
                  onClick={() => setIsCitizen(false)}
                >
                  No
                </button>
              </div>
            </div>

            <button type="submit" className="hero-btn primary-glow submit-btn">
              <span>Check Eligibility</span>
            </button>
          </form>
        ) : (
          <div className={`result-card ${result.isEligible ? 'eligible' : 'not-eligible'}`}>
            <div className="result-icon">
              {result.isEligible ? '✅' : '❌'}
            </div>
            <h3>{result.isEligible ? 'You are likely eligible!' : 'Eligibility Requirements Not Met'}</h3>
            <p>{result.message}</p>
            
            {result.reasons.length > 0 && (
              <ul className="reasons-list">
                {result.reasons.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            )}

            <div className="result-actions">
              {result.isEligible && (
                <button className="hero-btn primary-glow">
                  <span>Register Now</span>
                </button>
              )}
              <button className="hero-btn secondary-glow" onClick={resetForm}>
                <span>Check Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityView;
