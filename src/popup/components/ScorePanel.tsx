import React from 'react';
import { Score } from '../../lib/schema';

interface ScorePanelProps {
  title: string;
  score?: Score;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ title, score }) => {
  if (!score) {
    return (
      <div className="glassmorphic" style={{ padding: '16px', marginBottom: '20px' }}>
        <div className="input-label" style={{ marginBottom: '8px' }}>
          {title}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Enter a prompt and click "Score Prompt" to get your rating
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'rgba(16, 185, 129, 0.1)';
    if (score >= 60) return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  };

  return (
    <div className="glassmorphic" style={{ padding: '16px', marginBottom: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}>
        <div className="input-label">{title}</div>
        <div style={{
          background: getScoreBg(score.score),
          border: `1px solid ${getScoreColor(score.score)}`,
          borderRadius: '20px',
          padding: '6px 12px',
          color: getScoreColor(score.score),
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {score.score}/100
        </div>
      </div>
      
      {score.issues.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            color: '#ef4444', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px' 
          }}>
            Issues Found:
          </div>
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {score.issues.map((issue, idx) => (
              <div key={idx} style={{ 
                color: 'var(--text-readable)',
                fontSize: '13px',
                lineHeight: '1.5',
                marginBottom: idx < score.issues.length - 1 ? '6px' : '0'
              }}>
                • {issue}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {score.suggestions.length > 0 && (
        <div>
          <div style={{ 
            color: '#10b981', 
            fontSize: '14px', 
            fontWeight: '500', 
            marginBottom: '8px' 
          }}>
            Suggestions:
          </div>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '12px'
          }}>
            {score.suggestions.map((suggestion, idx) => (
              <div key={idx} style={{ 
                color: 'var(--text-readable)',
                fontSize: '13px',
                lineHeight: '1.5',
                marginBottom: idx < score.suggestions.length - 1 ? '6px' : '0'
              }}>
                • {suggestion}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScorePanel;