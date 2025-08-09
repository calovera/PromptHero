import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, Button, ScrollArea } from '@radix-ui/themes';

interface HistoryItem {
  id: string;
  originalPrompt: string;
  improvedPrompt?: string;
  score?: number;
  timestamp: Date;
}

const HistoryList: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // TODO: Load history from chrome.storage
    // loadHistoryFromStorage();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <Card style={{ maxHeight: '200px' }}>
      <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
        Recent History
      </Text>
      
      {history.length > 0 ? (
        <ScrollArea style={{ height: '160px' }}>
          <Flex direction="column" gap="2">
            {history.map((item) => (
              <Box key={item.id} p="2" style={{ backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}>
                <Flex justify="between" align="start" gap="2">
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="1" style={{ display: 'block', wordBreak: 'break-word' }}>
                      {truncateText(item.originalPrompt)}
                    </Text>
                    {item.score && (
                      <Text size="1" color="gray">
                        Score: {item.score}/10
                      </Text>
                    )}
                  </Box>
                  <Text size="1" color="gray" style={{ flexShrink: 0 }}>
                    {formatDate(item.timestamp)}
                  </Text>
                </Flex>
              </Box>
            ))}
          </Flex>
        </ScrollArea>
      ) : (
        <Box p="3" style={{ backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }}>
          <Text size="2" color="gray">
            No history yet. Start by scoring or optimizing a prompt!
          </Text>
        </Box>
      )}
    </Card>
  );
};

export default HistoryList;
