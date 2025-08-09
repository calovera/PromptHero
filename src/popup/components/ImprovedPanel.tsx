import React from 'react';
import { Card, Text, Box, TextArea } from '@radix-ui/themes';

interface ImprovedPanelProps {
  improvedPrompt: string;
}

const ImprovedPanel: React.FC<ImprovedPanelProps> = ({ improvedPrompt }) => {
  return (
    <Card>
      <Box>
        <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
          Improved Prompt
        </Text>
        
        {improvedPrompt ? (
          <TextArea
            value={improvedPrompt}
            readOnly
            rows={4}
            style={{ 
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              backgroundColor: 'var(--gray-2)',
              cursor: 'text'
            }}
          />
        ) : (
          <Box p="3" style={{ backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}>
            <Text size="2" color="gray">
              No improved prompt yet
            </Text>
          </Box>
        )}
        
        {improvedPrompt && (
          <Text size="1" color="gray" mt="1" style={{ display: 'block' }}>
            {improvedPrompt.length} characters
          </Text>
        )}
      </Box>
    </Card>
  );
};

export default ImprovedPanel;
