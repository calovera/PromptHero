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
      accentColor="violet"
      grayColor="slate"
      radius="medium"
      scaling="95%"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
            --primary-purple: #6366f1;
            --secondary-purple: #8b5cf6;
            --accent-pink: #ec4899;
            --accent-cyan: #06b6d4;
            --text-primary: #f8fafc;
            --text-secondary: #cbd5e1;
            --text-readable: #e2e8f0;
            --text-muted: #94a3b8;
            --background-primary: #0f172a;
            --background-secondary: #1e293b;
        }
        
        body {
            background: linear-gradient(135deg, var(--background-primary) 0%, var(--background-secondary) 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--text-primary);
            margin: 0;
            padding: 0;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        .popup-container {
          width: 400px;
          height: 600px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 0;
          margin: 0;
          overflow: hidden;
          position: relative;
        }
        
        .popup-content {
          padding: 16px;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        
        .popup-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .popup-content::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .popup-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 3px;
        }
        
        .header-title {
          background: linear-gradient(135deg, var(--accent-cyan), var(--primary-purple), var(--accent-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 24px;
          margin-bottom: 6px;
          text-align: center;
          letter-spacing: -0.5px;
        }
        
        .glassmorphic {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          backdrop-filter: blur(15px);
        }
      `}</style>
      <div className="popup-container">
        <div className="popup-content">
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        <Flex direction="column" gap="4" style={{ height: '100%' }}>
          {/* Header */}
          <Flex direction="column" align="center" gap="2" style={{ marginBottom: '16px' }}>
            <h1 className="header-title">PromptHero</h1>
            <Text size="2" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              AI Prompt Optimizer
            </Text>
          </Flex>

          {/* API Key Warning */}
          {!apiKeyConfigured && (
            <div className="glassmorphic" style={{ padding: '12px', marginBottom: '12px', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <Text size="2" style={{ color: '#fca5a5' }}>
                ⚠️ API key not configured.{' '}
                <Button variant="ghost" size="1" onClick={openOptions} style={{ color: '#fca5a5' }}>
                  Open Options
                </Button>
              </Text>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="glassmorphic" style={{ padding: '12px', marginBottom: '12px', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <Text size="2" style={{ color: '#fca5a5' }}>
                ⚠️ {error}
              </Text>
            </div>
          )}

          {/* Tab Navigation */}
          <div style={{ display: 'flex', marginBottom: '16px' }}>
            <Button 
              variant={!improvedPrompt ? "solid" : "soft"} 
              size="2" 
              style={{ 
                flex: 1, 
                borderRadius: '8px 0 0 8px',
                background: !improvedPrompt ? 'linear-gradient(135deg, var(--primary-purple), var(--secondary-purple))' : 'rgba(255,255,255,0.1)'
              }}
              onClick={() => setImprovedPrompt('')}
            >
              📝 Original Prompt
            </Button>
            <Button 
              variant={improvedPrompt ? "solid" : "soft"} 
              size="2" 
              style={{ 
                flex: 1, 
                borderRadius: '0 8px 8px 0',
                background: improvedPrompt ? 'linear-gradient(135deg, var(--primary-purple), var(--secondary-purple))' : 'rgba(255,255,255,0.1)'
              }}
              disabled={!improvedPrompt}
            >
              ⚡ Optimized Result
            </Button>
          </div>

          {!improvedPrompt ? (
            <>
              {/* Original Prompt Tab */}
              <div className="glassmorphic" style={{ padding: '16px', marginBottom: '16px' }}>
                <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
                  Enter your AI prompt:
                </Text>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Write a story about a robot..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <Button 
                  onClick={handleScore}
                  disabled={!prompt.trim() || isLoading || !apiKeyConfigured}
                  style={{ 
                    flex: 1,
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white'
                  }}
                >
                  📊 Score Prompt
                </Button>
                <Button 
                  onClick={handleOptimize}
                  disabled={!prompt.trim() || isLoading || !apiKeyConfigured}
                  style={{ 
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white'
                  }}
                >
                  ⚡ Optimize Prompt
                </Button>
              </div>

              {/* Score Display */}
              <ScorePanel title="Prompt Score" score={originalScore} />
            </>
          ) : (
            <>
              {/* Optimized Result Tab */}
              <div style={{ marginBottom: '16px' }}>
                <Text size="3" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
                  Improved Prompt:
                </Text>
                <div className="glassmorphic" style={{ 
                  padding: '16px', 
                  maxHeight: '200px', 
                  overflowY: 'auto',
                  marginBottom: '16px'
                }}>
                  <Text size="2" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {improvedPrompt}
                  </Text>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text size="3" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
                  What was improved:
                </Text>
                <div className="glassmorphic" style={{ 
                  padding: '16px', 
                  maxHeight: '200px', 
                  overflowY: 'auto'
                }}>
                  <Text size="2" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {optimizeResult?.checklist?.join('\n') || 'Optimization details will appear here.'}
                  </Text>
                </div>
              </div>

              <Button 
                onClick={() => handleCopy(improvedPrompt, 'Improved prompt')}
                style={{ 
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--primary-purple), var(--secondary-purple))',
                  marginBottom: '12px'
                }}
              >
                📋 Copy to Clipboard
              </Button>

              <Button 
                variant="soft"
                onClick={() => setImprovedPrompt('')}
                style={{ width: '100%' }}
              >
                ← Back to Original
              </Button>
            </>
          )}

          {/* Loading Animation - Center Overlay */}
          {(isScoring || isOptimizing) && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.9)',
              borderRadius: '12px',
              padding: '30px 40px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(15px)',
              zIndex: 9999,
              minWidth: '200px'
            }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 16px',
                background: isScoring ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isScoring ? 'spin 2s linear infinite' : 'pulse 1.5s ease-in-out infinite'
              }}>
                <Text size="4" weight="bold" style={{ color: 'white' }}>
                  {isScoring ? '📊' : '⚡'}
                </Text>
              </div>
              <Text size="3" weight="medium" style={{ color: 'white', marginBottom: '8px', display: 'block' }}>
                {isScoring ? 'Analyzing your prompt...' : 'Creating your improved prompt...'}
              </Text>
              <Text size="2" style={{ color: '#888' }}>
                {isScoring ? 'This might take a few seconds' : 'Processing with Gemini AI'}
              </Text>
            </div>
          )}
        </Flex>
        </div>
      </div>
    </Theme>
  );
};

export default Popup;