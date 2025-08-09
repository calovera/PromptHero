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
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
      <div style={{ width: '400px', height: '600px', padding: '16px', overflow: 'auto', position: 'relative' }}>
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

          {/* Loading Animation - Center Overlay */}
          {(isScoring || isOptimizing) && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--gray-1)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              border: '2px solid var(--blue-6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              minWidth: '200px'
            }}>
              {isScoring && (
                <>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    margin: '0 auto 16px',
                    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'spin 2s linear infinite'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'var(--gray-1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text size="4" weight="bold" style={{ color: 'var(--blue-11)' }}>📊</Text>
                    </div>
                  </div>
                  <Text size="3" weight="medium" style={{ color: 'var(--gray-12)', marginBottom: '8px', display: 'block' }}>
                    Analyzing your prompt...
                  </Text>
                </>
              )}
              
              {isOptimizing && (
                <>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    margin: '0 auto 16px',
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: 'var(--gray-1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Text size="4" weight="bold" style={{ color: 'var(--green-11)' }}>⚡</Text>
                    </div>
                  </div>
                  <Text size="3" weight="medium" style={{ color: 'var(--gray-12)', marginBottom: '8px', display: 'block' }}>
                    Creating your improved prompt...
                  </Text>
                </>
              )}
              
              <Text size="2" style={{ color: 'var(--gray-11)' }}>
                This might take a few seconds
              </Text>
            </div>
          )}

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