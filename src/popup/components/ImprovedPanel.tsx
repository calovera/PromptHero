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
      
      <pre style={{ 
        background: 'var(--gray-3)', 
        padding: '12px', 
        borderRadius: '6px', 
        fontSize: '12px',
        lineHeight: '1.4',
        marginBottom: checklist ? '12px' : '0',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      }}>
        {improved}
      </pre>
      
      {checklist && checklist.length > 0 && (
        <div>
          <Text size="1" weight="medium" style={{ marginBottom: '6px', display: 'block' }}>
            Improvements made:
          </Text>
          {checklist.map((item, idx) => (
            <Text key={idx} size="1" style={{ display: 'block', marginLeft: '8px', marginBottom: '2px' }}>
              ✓ {item}
            </Text>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ImprovedPanel;