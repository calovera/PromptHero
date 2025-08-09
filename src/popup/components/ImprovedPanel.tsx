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
        background: 'var(--gray-2)', 
        border: '2px solid var(--gray-6)',
        borderRadius: '12px', 
        padding: '20px',
        marginBottom: checklist ? '16px' : '0',
        maxHeight: '250px',
        overflowY: 'auto',
        fontSize: '14px',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
      }}>
        <div style={{
          lineHeight: '1.8',
          color: 'var(--gray-12)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {improved.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ 
              margin: paragraph.trim() ? '0 0 12px 0' : '0',
              fontSize: '14px',
              fontWeight: '400'
            }}>
              {paragraph}
            </p>
          ))}
        </div>
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