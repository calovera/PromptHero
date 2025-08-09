import React from 'react';
import { Card, Text, Badge, Flex, Button, ScrollArea, DropdownMenu } from '@radix-ui/themes';
import { HistoryEntry } from '../../lib/schema';

interface HistoryListProps {
  entries: HistoryEntry[];
  onLoad: (entry: HistoryEntry, which: 'original' | 'improved') => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ entries, onLoad }) => {
  if (entries.length === 0) {
    return (
      <Card style={{ padding: '16px' }}>
        <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
          History
        </Text>
        <Text size="1" style={{ color: 'var(--gray-11)' }}>
          No history yet
        </Text>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card style={{ padding: '16px' }}>
      <Text size="2" weight="medium" style={{ marginBottom: '12px', display: 'block' }}>
        History ({entries.length})
      </Text>
      
      <ScrollArea style={{ height: '200px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.slice(0, 10).map((entry, idx) => (
            <div key={idx} style={{ 
              padding: '8px', 
              background: 'var(--gray-2)', 
              borderRadius: '4px',
              border: '1px solid var(--gray-5)'
            }}>
              <Text size="1" style={{ 
                display: 'block', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '6px'
              }}>
                {entry.original}
              </Text>
              
              <Flex justify="between" align="center">
                <Flex gap="2" align="center">
                  <Text size="1" style={{ color: 'var(--gray-11)' }}>
                    {formatDate(entry.timestamp)}
                  </Text>
                  {entry.originalScore && (
                    <Badge size="1" color="gray">
                      {entry.originalScore.score}/100
                    </Badge>
                  )}
                  {entry.improved && (
                    <Badge size="1" color="green">
                      Optimized
                    </Badge>
                  )}
                </Flex>
                
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button size="1" variant="ghost" aria-label="Load prompt options">
                      Load
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item 
                      onClick={() => onLoad(entry, 'original')}
                      aria-label="Load original prompt"
                    >
                      Load Original
                    </DropdownMenu.Item>
                    {entry.improved && (
                      <DropdownMenu.Item 
                        onClick={() => onLoad(entry, 'improved')}
                        aria-label="Load improved prompt"
                      >
                        Load Improved
                      </DropdownMenu.Item>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Flex>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default HistoryList;