import React from 'react';
import { Card, Text, Badge, Flex } from '@radix-ui/themes';
import { Score } from '../../lib/schema';

interface ScorePanelProps {
  title: string;
  score?: Score;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ title, score }) => {
  if (!score) {
    return (
      <Card style={{ padding: '16px' }}>
        <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
          {title}
        </Text>
        <Text size="1" style={{ color: 'var(--gray-11)' }}>
          No score yet
        </Text>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  return (
    <Card style={{ padding: '16px' }}>
      <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
        <Text size="2" weight="medium">{title}</Text>
        <Badge size="2" color={getScoreColor(score.score)}>
          {score.score}/100
        </Badge>
      </Flex>
      
      {score.issues.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <Text size="2" weight="medium" style={{ color: 'var(--red-11)', marginBottom: '8px', display: 'block' }}>
            Issues Found:
          </Text>
          <div style={{ 
            background: 'var(--red-2)', 
            border: '1px solid var(--red-6)',
            borderRadius: '6px',
            padding: '12px'
          }}>
            {score.issues.map((issue, idx) => (
              <Text key={idx} size="2" style={{ 
                display: 'block', 
                marginBottom: '6px',
                lineHeight: '1.5'
              }}>
                • {issue}
              </Text>
            ))}
          </div>
        </div>
      )}
      
      {score.suggestions.length > 0 && (
        <div>
          <Text size="2" weight="medium" style={{ color: 'var(--green-11)', marginBottom: '8px', display: 'block' }}>
            Suggestions:
          </Text>
          <div style={{ 
            background: 'var(--green-2)', 
            border: '1px solid var(--green-6)',
            borderRadius: '6px',
            padding: '12px'
          }}>
            {score.suggestions.map((suggestion, idx) => (
              <Text key={idx} size="2" style={{ 
                display: 'block', 
                marginBottom: '6px',
                lineHeight: '1.5'
              }}>
                • {suggestion}
              </Text>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ScorePanel;