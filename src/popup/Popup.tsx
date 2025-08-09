import React, { useState, useEffect } from 'react';
import { Theme, Button, Card, Text, Flex, TextArea, Badge, Separator } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { Score, Optimize, HistoryEntry } from '../lib/schema';
import { scorePromptViaBg, optimizePromptViaBg } from '../lib/messages';
import { 
  saveWorkingState, 
  loadWorkingState, 
  saveHistory, 
  loadHistory 
} from '../lib/storage';

const Popup: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [currentScore, setCurrentScore] = useState<Score | null>(null);
  const [improved, setImproved] = useState<string>('');
  const [improvedScore, setImprovedScore] = useState<Score | null>(null);
  const [optimizeResult, setOptimizeResult] = useState<Optimize | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    try {
      // Load working state
      const workingState = await loadWorkingState();
      if (workingState) {
        setPrompt(workingState.prompt);
        setCurrentScore(workingState.currentScore || null);
        setImproved(workingState.improved || '');
        setImprovedScore(workingState.improvedScore || null);
      }

      // Load history
      const historyData = await loadHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load initial state:', error);
    }
  };

  const handleScore = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to score');
      return;
    }

    setIsScoring(true);
    setError('');
    
    try {
      const score = await scorePromptViaBg(prompt.trim());
      setCurrentScore(score);
      
      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: score,
        improved,
        improvedScore: improvedScore || undefined
      });

    } catch (error) {
      console.error('Score error:', error);
      setError(error instanceof Error ? error.message : 'Failed to score prompt');
    } finally {
      setIsScoring(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to optimize');
      return;
    }

    setIsOptimizing(true);
    setError('');
    
    try {
      const result = await optimizePromptViaBg(prompt.trim());
      setOptimizeResult(result);
      setImproved(result.improved_prompt);
      
      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: currentScore || undefined,
        improved: result.improved_prompt,
        improvedScore: improvedScore || undefined
      });

    } catch (error) {
      console.error('Optimize error:', error);
      setError(error instanceof Error ? error.message : 'Failed to optimize prompt');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSaveToHistory = async () => {
    if (!prompt.trim()) return;

    const entry: HistoryEntry = {
      original: prompt.trim(),
      originalScore: currentScore || undefined,
      improved: improved || undefined,
      improvedScore: improvedScore || undefined,
      timestamp: Date.now()
    };

    try {
      await saveHistory(entry);
      const updatedHistory = await loadHistory();
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Theme
      appearance="dark"
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="95%"
    >
      <div style={{ width: '400px', height: '600px', padding: '16px', overflow: 'auto' }}>
        <Flex direction="column" gap="4" style={{ height: '100%' }}>
          {/* Header */}
          <Flex justify="between" align="center">
            <Text size="5" weight="bold">PromptHero</Text>
            <Button size="1" variant="ghost" onClick={openOptions}>
              Options
            </Button>
          </Flex>

          {/* Error Display */}
          {error && (
            <Card style={{ padding: '12px', background: 'var(--red-3)', border: '1px solid var(--red-6)' }}>
              <Text size="1" style={{ color: 'var(--red-11)' }}>{error}</Text>
            </Card>
          )}

          {/* Prompt Input */}
          <div>
            <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
              Enter your prompt:
            </Text>
            <TextArea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your AI prompt here..."
              style={{ minHeight: '100px', width: '100%' }}
              size="2"
            />
          </div>

          {/* Action Buttons */}
          <Flex gap="2">
            <Button 
              onClick={handleScore}
              disabled={isScoring || !prompt.trim()}
              variant="solid"
              style={{ flex: 1 }}
            >
              {isScoring ? 'Scoring...' : 'Score'}
            </Button>
            <Button 
              onClick={handleOptimize}
              disabled={isOptimizing || !prompt.trim()}
              variant="outline"
              style={{ flex: 1 }}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize'}
            </Button>
          </Flex>

          {/* Score Results */}
          {currentScore && (
            <Card style={{ padding: '12px' }}>
              <Flex justify="between" align="center" style={{ marginBottom: '8px' }}>
                <Text size="2" weight="medium">Score</Text>
                <Badge size="2" color="blue">{currentScore.score}/100</Badge>
              </Flex>
              
              {currentScore.issues.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <Text size="1" weight="medium" style={{ color: 'var(--red-11)' }}>Issues:</Text>
                  {currentScore.issues.map((issue, idx) => (
                    <Text key={idx} size="1" style={{ display: 'block', marginLeft: '8px' }}>
                      • {issue}
                    </Text>
                  ))}
                </div>
              )}
              
              {currentScore.suggestions.length > 0 && (
                <div>
                  <Text size="1" weight="medium" style={{ color: 'var(--green-11)' }}>Suggestions:</Text>
                  {currentScore.suggestions.map((suggestion, idx) => (
                    <Text key={idx} size="1" style={{ display: 'block', marginLeft: '8px' }}>
                      • {suggestion}
                    </Text>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Optimization Results */}
          {optimizeResult && (
            <Card style={{ padding: '12px' }}>
              <Flex justify="between" align="center" style={{ marginBottom: '8px' }}>
                <Text size="2" weight="medium">Improved Prompt</Text>
                <Button 
                  size="1" 
                  variant="ghost" 
                  onClick={() => copyToClipboard(optimizeResult.improved_prompt)}
                >
                  Copy
                </Button>
              </Flex>
              
              <Text size="1" style={{ 
                background: 'var(--gray-3)', 
                padding: '8px', 
                borderRadius: '4px', 
                display: 'block',
                lineHeight: '1.4',
                marginBottom: '8px'
              }}>
                {optimizeResult.improved_prompt}
              </Text>
              
              {optimizeResult.checklist.length > 0 && (
                <div>
                  <Text size="1" weight="medium">Improvements made:</Text>
                  {optimizeResult.checklist.map((item, idx) => (
                    <Text key={idx} size="1" style={{ display: 'block', marginLeft: '8px' }}>
                      ✓ {item}
                    </Text>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Save to History */}
          {(currentScore || optimizeResult) && (
            <Button 
              onClick={handleSaveToHistory}
              variant="soft"
              size="1"
            >
              Save to History
            </Button>
          )}

          {/* History */}
          {history.length > 0 && (
            <div>
              <Separator style={{ margin: '8px 0' }} />
              <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
                Recent History ({history.length})
              </Text>
              <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                {history.slice(0, 3).map((entry, idx) => (
                  <Card key={idx} style={{ padding: '8px', marginBottom: '4px' }}>
                    <Text size="1" style={{ 
                      display: 'block', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {entry.original}
                    </Text>
                    <Flex gap="2" style={{ marginTop: '4px' }}>
                      {entry.originalScore && (
                        <Badge size="1" color="gray">{entry.originalScore.score}/100</Badge>
                      )}
                      {entry.improved && (
                        <Badge size="1" color="green">Optimized</Badge>
                      )}
                    </Flex>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Flex>
      </div>
    </Theme>
  );
};

export default Popup;