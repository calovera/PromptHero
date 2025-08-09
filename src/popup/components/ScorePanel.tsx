import React from 'react';
import { Card, Text, Flex, Badge } from '@radix-ui/themes';

interface ScorePanelProps {
  score: number | null;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    if (score >= 4) return 'orange';
    return 'red';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="2" weight="medium">
          Prompt Score
        </Text>
        
        {score !== null ? (
          <Flex align="center" gap="2">
            <Text size="6" weight="bold">
              {score}/10
            </Text>
            <Badge color={getScoreColor(score)} variant="soft">
              {getScoreLabel(score)}
            </Badge>
          </Flex>
        ) : (
          <Text size="2" color="gray">
            No score yet
          </Text>
        )}
        
        {score !== null && (
          <Text size="1" color="gray">
            This score reflects clarity, specificity, and potential effectiveness of your prompt.
          </Text>
        )}
      </Flex>
    </Card>
  );
};

export default ScorePanel;
