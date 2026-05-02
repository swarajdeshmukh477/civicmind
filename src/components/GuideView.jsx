import React, { useState } from 'react';
import './GuideView.css';

const STEPS = [
  {
    id: 'eligibility',
    title: 'Eligibility',
    icon: '🇮🇳',
    content: 'To vote in India, you must be a citizen of India, at least 18 years old on the qualifying date (Jan 1, April 1, July 1, or Oct 1), and a "regular resident" of the electoral area where you want to be registered.',
    link: 'https://voters.eci.gov.in/',
    linkText: 'Official ECI Portal'
  },
  {
    id: 'registration',
    title: 'Voter Registration',
    icon: '📝',
    content: 'Registration is done through the Election Commission of India (ECI). You can apply online via the Voter Service Portal (voters.eci.gov.in) or use the Voter Helpline App. Fill out Form 6 for a new registration to get your name on the Electoral Roll.',
    link: 'https://voters.eci.gov.in/registration-details/full-form6',
    linkText: 'Fill Form 6 Online'
  },
  {
    id: 'voter-id',
    title: 'EPIC Card',
    icon: '🆔',
    content: 'The Electors Photo Identity Card (EPIC) is your official voter ID. Once registered, your EPIC is generated. You can download an e-EPIC online or receive a physical card. Remember, having an EPIC is not enough; your name must be in the current Electoral Roll to vote.',
    link: 'https://voters.eci.gov.in/download-epic',
    linkText: 'Download e-EPIC'
  },
  {
    id: 'voting',
    title: 'Polling Day',
    icon: '📥',
    content: 'On election day, go to your designated Polling Booth. Your identity will be verified, your finger will be marked with indelible ink, and you will record your vote using an Electronic Voting Machine (EVM) and VVPAT printer.',
    link: 'https://electorallookup.eci.gov.in/',
    linkText: 'Find Your Polling Station'
  },
  {
    id: 'counting',
    title: 'Counting Process',
    icon: '🔢',
    content: 'Votes are counted on a scheduled day across the country. EVMs are fetched from strongrooms and opened in the presence of candidates and observers. The VVPAT slips are also partially audited to ensure 100% transparency.',
    link: 'https://results.eci.gov.in/',
    linkText: 'ECI Results Portal'
  },
  {
    id: 'results',
    title: 'Declaration of Results',
    icon: '🏆',
    content: 'Once the counting is complete for a constituency, the Returning Officer (RO) declares the winner. The Election Commission then formally notifies the list of elected members, paving the way for the formation of the new government.',
    link: 'https://eci.gov.in/',
    linkText: 'Visit eci.gov.in'
  },
];

const GuideView = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="guide-view">
      <div className="guide-container">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="step-counter">
          Step {currentStep + 1} of {STEPS.length}
        </div>

        <div className="guide-card" key={step.id}>
          <div className="step-icon">{step.icon}</div>
          <h2 className="step-title">{step.title}</h2>
          <p className="step-content">{step.content}</p>
          {step.link && (
            <a 
              href={step.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="step-link-btn"
            >
              {step.linkText}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          )}
        </div>

        <div className="guide-nav">
          <button 
            className="hero-btn secondary-glow" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <span>Back</span>
          </button>
          
          {currentStep < STEPS.length - 1 ? (
            <button className="hero-btn primary-glow" onClick={nextStep}>
              <span>Next</span>
            </button>
          ) : (
            <button className="hero-btn primary-glow success-glow" onClick={onFinish}>
              <span>Finish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideView;
