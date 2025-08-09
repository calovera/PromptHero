import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Button, Text } from '@radix-ui/themes';
import PromptEditor from './components/PromptEditor';
import ScorePanel from './components/ScorePanel';
import ImprovedPanel from './components/ImprovedPanel';
import HistoryList from './components/HistoryList';
import Toolbar from './components/Toolbar';

const Popup: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const handleScorePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'SCORE_PROMPT',
        prompt: prompt.trim()
      });
      
      if (response.ok) {
        setScore(response.data.score);
      } else {
        console.error('Failed to score prompt:', response.error);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error('Failed to score prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'OPTIMIZE_PROMPT',
        prompt: prompt.trim()
      });
      
      if (response.ok) {
        setImprovedPrompt(response.data.improvedPrompt);
      } else {
        console.error('Failed to optimize prompt:', response.error);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error('Failed to optimize prompt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p="4" style={{ width: '100%', height: '100%' }}>
      <Flex direction="column" gap="4" style={{ height: '100%' }}>
        {/* Header */}
        <Flex justify="between" align="center">
          <Heading size="4">PromptHero</Heading>
          <Button 
            variant="ghost" 
            size="2" 
            onClick={handleOpenOptions}
          >
            <Text size="2">Options</Text>
          </Button>
        </Flex>

        {/* Prompt Editor */}
        <PromptEditor
          value={prompt}
          onChange={setPrompt}
          placeholder="Enter your prompt here to analyze and optimize..."
        />

        {/* Action Buttons */}
        <Flex gap="2">
          <Button
            onClick={handleScorePrompt}
            disabled={!prompt.trim() || isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Scoring...' : 'Score'}
          </Button>
          <Button
            onClick={handleOptimizePrompt}
            disabled={!prompt.trim() || isLoading}
            style={{ flex: 1 }}
          >
            {isLoading ? 'Optimizing...' : 'Optimize'}
          </Button>
        </Flex>

        {/* Results Panels */}
        <Flex direction="column" gap="3" style={{ flex: 1 }}>
          <ScorePanel score={score} />
          <ImprovedPanel improvedPrompt={improvedPrompt} />
        </Flex>

        {/* Toolbar */}
        <Toolbar 
          prompt={prompt}
          improvedPrompt={improvedPrompt}
        />

        {/* History */}
        <HistoryList />
      </Flex>
    </Box>
  );
};

export default Popup;
