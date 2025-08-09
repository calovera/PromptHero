import React from 'react';
import { Card, Text, Button, Flex } from '@radix-ui/themes';

interface ImprovedPanelProps {
  improved?: string;
  checklist?: string[];
  onCopy: (text: string) => void;
}

const ImprovedPanel: React.FC<ImprovedPanelProps> = ({ improved, checklist, onCopy }) => {
  if (!improved) {
    return (
      <Card style={{ padding: '16px' }}>
        <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
          Improved Prompt
        </Text>
        <Text size="1" style={{ color: 'var(--gray-11)' }}>
          No improved prompt yet
        </Text>
      </Card>
    );
  }

  return (
    <Card style={{ padding: '16px' }}>
      <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
        <Text size="2" weight="medium">Improved Prompt</Text>
        <Button 
          size="1" 
          variant="ghost" 
          onClick={() => onCopy(improved)}
          aria-label="Copy improved prompt to clipboard"
        >
          Copy
        </Button>
      </Flex>
      
      <div style={{ 
        background: 'var(--gray-3)', 
        border: '1px solid var(--gray-6)',
        borderRadius: '8px', 
        padding: '16px',
        marginBottom: checklist ? '16px' : '0',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        <Text size="2" style={{ 
          lineHeight: '1.6',
          display: 'block',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          {improved}
        </Text>
      </div>
      
      {checklist && checklist.length > 0 && (
        <div>
          <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
            Improvements Made:
          </Text>
          <div style={{ 
            background: 'var(--blue-2)', 
            border: '1px solid var(--blue-6)',
            borderRadius: '6px',
            padding: '12px'
          }}>
            {checklist.map((item, idx) => (
              <Text key={idx} size="2" style={{ 
                display: 'block', 
                marginBottom: '6px',
                lineHeight: '1.5'
              }}>
                ✓ {item}
              </Text>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ImprovedPanel;