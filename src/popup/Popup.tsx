import React, { useState, useEffect } from 'react';
import { Theme, Button, Flex, Text, Callout } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { Score, Optimize, HistoryEntry } from '../lib/schema';
import { scorePromptViaBg, optimizePromptViaBg } from '../lib/messages';
import { 
  saveWorkingState, 
  loadWorkingState, 
  saveHistory, 
  loadHistory,
  getKey 
} from '../lib/storage';

// Components
import PromptEditor from './components/PromptEditor';
import ScorePanel from './components/ScorePanel';
import ImprovedPanel from './components/ImprovedPanel';
import HistoryList from './components/HistoryList';
import Toolbar from './components/Toolbar';
import LoadingAnimation from './components/LoadingAnimation';
import Toast from './components/Toast';

const Popup: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [originalScore, setOriginalScore] = useState<Score | undefined>();
  const [improvedPrompt, setImprovedPrompt] = useState<string>('');
  const [improvedScore, setImprovedScore] = useState<Score | undefined>();
  const [optimizeResult, setOptimizeResult] = useState<Optimize | undefined>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Loading states
  const [isScoring, setIsScoring] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadInitialState();
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const key = await getKey();
      setApiKeyConfigured(!!key);
    } catch (error) {
      setApiKeyConfigured(false);
    }
  };

  const loadInitialState = async () => {
    try {
      // Load working state
      const workingState = await loadWorkingState();
      if (workingState) {
        setPrompt(workingState.prompt);
        setOriginalScore(workingState.currentScore);
        setImprovedPrompt(workingState.improved || '');
        setImprovedScore(workingState.improvedScore);
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
      setError('Paste a prompt first');
      return;
    }

    setIsScoring(true);
    setError('');
    
    try {
      const score = await scorePromptViaBg(prompt.trim());
      setOriginalScore(score);
      
      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: score,
        improved: improvedPrompt,
        improvedScore: improvedScore
      });

      // Save to history
      const entry: HistoryEntry = {
        original: prompt.trim(),
        originalScore: score,
        improved: improvedPrompt || undefined,
        improvedScore: improvedScore,
        timestamp: Date.now()
      };
      await saveHistory(entry);
      const updatedHistory = await loadHistory();
      setHistory(updatedHistory);

    } catch (error) {
      console.error('Score error:', error);
      setError(error instanceof Error ? error.message : 'Failed to score prompt');
    } finally {
      setIsScoring(false);
    }
  };

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError('Paste a prompt first');
      return;
    }

    setIsOptimizing(true);
    setError('');
    
    try {
      const result = await optimizePromptViaBg(prompt.trim());
      setOptimizeResult(result);
      setImprovedPrompt(result.improved_prompt);
      
      // Automatically score the improved prompt
      try {
        const newScore = await scorePromptViaBg(result.improved_prompt);
        setImprovedScore(newScore);
      } catch (scoreError) {
        console.error('Failed to score improved prompt:', scoreError);
      }
      
      // Save working state
      await saveWorkingState({
        prompt: prompt.trim(),
        currentScore: originalScore,
        improved: result.improved_prompt,
        improvedScore: improvedScore
      });

      // Save to history
      const entry: HistoryEntry = {
        original: prompt.trim(),
        originalScore: originalScore,
        improved: result.improved_prompt,
        improvedScore: improvedScore,
        timestamp: Date.now()
      };
      await saveHistory(entry);
      const updatedHistory = await loadHistory();
      setHistory(updatedHistory);

    } catch (error) {
      console.error('Optimize error:', error);
      setError(error instanceof Error ? error.message : 'Failed to optimize prompt');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: `${label} copied!`, type: 'success' });
    } catch (error) {
      console.error('Failed to copy:', error);
      setToast({ message: 'Failed to copy', type: 'error' });
    }
  };

  const handlePresetSelect = (preset: string) => {
    setPrompt(preset);
  };

  const handleClear = () => {
    setPrompt('');
    setOriginalScore(undefined);
    setImprovedPrompt('');
    setImprovedScore(undefined);
    setOptimizeResult(undefined);
    setError('');
  };

  const handleHistoryLoad = (entry: HistoryEntry, which: 'original' | 'improved') => {
    if (which === 'original') {
      setPrompt(entry.original);
      setOriginalScore(entry.originalScore);
    } else if (which === 'improved' && entry.improved) {
      setPrompt(entry.improved);
      setOriginalScore(entry.improvedScore);
    }
    setImprovedPrompt('');
    setImprovedScore(undefined);
    setOptimizeResult(undefined);
  };

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const isLoading = isScoring || isOptimizing;

  return (
    <Theme
      appearance="dark"
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="95%"
    >
      <div style={{ width: '400px', height: '600px', padding: '16px', overflow: 'auto' }}>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        <Flex direction="column" gap="4" style={{ height: '100%' }}>
          {/* Header */}
          <Flex justify="between" align="center">
            <Text size="5" weight="bold">Prompt Optimizer</Text>
            <Button size="1" variant="ghost" onClick={openOptions}>
              Open Options
            </Button>
          </Flex>

          {/* API Key Warning */}
          {!apiKeyConfigured && (
            <Callout.Root color="red">
              <Callout.Text>
                API key not configured.{' '}
                <Button variant="ghost" size="1" onClick={openOptions}>
                  Open Options
                </Button>
              </Callout.Text>
            </Callout.Root>
          )}

          {/* Error Display */}
          {error && (
            <Callout.Root color="red">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          {/* Loading Animation */}
          {isScoring && (
            <LoadingAnimation message="Analyzing your prompt..." />
          )}
          
          {isOptimizing && (
            <LoadingAnimation message="Optimizing your prompt..." />
          )}

          {/* Prompt Editor */}
          <PromptEditor
            value={prompt}
            onChange={setPrompt}
            onClear={handleClear}
            onPresetSelect={handlePresetSelect}
            disabled={isLoading}
          />

          {/* Toolbar */}
          <Toolbar
            onScore={handleScore}
            onOptimize={handleOptimize}
            onCopyOriginal={() => handleCopy(prompt, 'Original prompt')}
            onCopyImproved={() => handleCopy(improvedPrompt, 'Improved prompt')}
            disabled={{
              score: !prompt.trim() || isLoading || !apiKeyConfigured,
              optimize: !prompt.trim() || isLoading || !apiKeyConfigured,
              copyOriginal: !prompt.trim(),
              copyImproved: !improvedPrompt
            }}
            loading={{
              scoring: isScoring,
              optimizing: isOptimizing
            }}
          />

          {/* Score Panels */}
          <ScorePanel title="Current score" score={originalScore} />
          
          {/* Improved Panel */}
          <ImprovedPanel
            improved={improvedPrompt}
            checklist={optimizeResult?.checklist}
            onCopy={(text) => handleCopy(text, 'Improved prompt')}
          />
          
          {/* New Score Panel */}
          {improvedPrompt && (
            <ScorePanel title="New score" score={improvedScore} />
          )}

          {/* History */}
          <HistoryList
            entries={history}
            onLoad={handleHistoryLoad}
          />
        </Flex>
      </div>
    </Theme>
  );
};

export default Popup;