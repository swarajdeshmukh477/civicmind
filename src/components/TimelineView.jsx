import React, { useState } from 'react';
import './TimelineView.css';

const TIMELINE_EVENTS = [
  {
    id: 'registration',
    title: 'Registration',
    date: 'Pre-Election Phase',
    icon: '📝',
    description: 'Citizens register themselves on the electoral roll through Form 6. This is the foundation of democracy, ensuring every eligible person is ready to vote.',
    details: [
      'Fill Form 6 on NVSP portal',
      'Verification by Booth Level Officer (BLO)',
      'Inclusion in Electoral Roll',
      'Generation of EPIC Voter ID'
    ]
  },
  {
    id: 'campaign',
    title: 'Campaigning',
    icon: '📢',
    date: 'Election Announcement',
    description: 'Candidates and political parties reach out to voters with their manifestos. This phase is governed by the Model Code of Conduct (MCC).',
    details: [
      'Nomination filing by candidates',
      'Scrutiny of nominations',
      'Public rallies and door-to-door visits',
      'Strict adherence to MCC guidelines'
    ]
  },
  {
    id: 'voting',
    title: 'Voting Day',
    icon: '📥',
    date: 'Polling Schedule',
    description: 'The most crucial day where voters visit polling booths to cast their votes using Electronic Voting Machines (EVMs).',
    details: [
      'Verification at Polling Station',
      'Application of Indelible Ink',
      'Pressing the button on EVM',
      'Verification via VVPAT slip'
    ]
  },
  {
    id: 'counting',
    title: 'Counting',
    icon: '🔢',
    date: 'Post-Polling',
    description: 'Securely stored EVMs are brought to counting centers where votes are tallied in the presence of observers and candidates.',
    details: [
      'Strongroom opening under security',
      'Round-wise counting of EVM votes',
      'Verification of VVPAT slips (random)',
      'Tallying of Postal Ballots'
    ]
  },
  {
    id: 'results',
    title: 'Results',
    icon: '🏆',
    date: 'Declaration Day',
    description: 'The final declaration of results by the Returning Officer and the formal notification to the government.',
    details: [
      'Declaration of winning candidate',
      'Issue of Election Certificate',
      'Formation of the new Government',
      'Official Gazette notification'
    ]
  }
];

const TimelineView = () => {
  const [activeEvent, setActiveEvent] = useState(TIMELINE_EVENTS[0]);

  return (
    <div className="timeline-view">
      <div className="timeline-container">
        <h2 className="view-title">Election Timeline</h2>
        <p className="view-description">Explore the journey of an Indian election from registration to results.</p>

        <div className="horizontal-timeline">
          <div className="timeline-line"></div>
          <div className="timeline-steps">
            {TIMELINE_EVENTS.map((event, index) => (
              <div 
                key={event.id}
                className={`timeline-step-item ${activeEvent.id === event.id ? 'active' : ''}`}
                onClick={() => setActiveEvent(event)}
              >
                <div className="step-node">
                  <span className="step-icon">{event.icon}</span>
                </div>
                <span className="step-label">{event.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="event-detail-card">
          <div className="event-card-header">
            <div className="event-main-info">
              <span className="event-badge">{activeEvent.date}</span>
              <h3>{activeEvent.title}</h3>
            </div>
            <div className="event-card-icon">{activeEvent.icon}</div>
          </div>
          
          <p className="event-description">{activeEvent.description}</p>
          
          <div className="event-details-list">
            <h4>Key Activities:</h4>
            <ul>
              {activeEvent.details.map((detail, index) => (
                <li key={index}>
                  <span className="bullet">⚡</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
