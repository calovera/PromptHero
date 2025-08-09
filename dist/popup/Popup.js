import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Theme, Button, Flex, Text, Callout } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { scorePromptViaBg, optimizePromptViaBg } from '../lib/messages';
import { saveWorkingState, loadWorkingState, saveHistory, loadHistory, getKey } from '../lib/storage';
// Components
import PromptEditor from './components/PromptEditor';
import ScorePanel from './components/ScorePanel';
import ImprovedPanel from './components/ImprovedPanel';
import HistoryList from './components/HistoryList';
import Toolbar from './components/Toolbar';
import LoadingAnimation from './components/LoadingAnimation';
import Toast from './components/Toast';
const Popup = () => {
    const [prompt, setPrompt] = useState('');
    const [originalScore, setOriginalScore] = useState();
    const [improvedPrompt, setImprovedPrompt] = useState('');
    const [improvedScore, setImprovedScore] = useState();
    const [optimizeResult, setOptimizeResult] = useState();
    const [history, setHistory] = useState([]);
    const [toast, setToast] = useState(null);
    const [apiKeyConfigured, setApiKeyConfigured] = useState(true);
    const [error, setError] = useState('');
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
        }
        catch (error) {
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
        }
        catch (error) {
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
            const entry = {
                original: prompt.trim(),
                originalScore: score,
                improved: improvedPrompt || undefined,
                improvedScore: improvedScore,
                timestamp: Date.now()
            };
            await saveHistory(entry);
            const updatedHistory = await loadHistory();
            setHistory(updatedHistory);
        }
        catch (error) {
            console.error('Score error:', error);
            setError(error instanceof Error ? error.message : 'Failed to score prompt');
        }
        finally {
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
            }
            catch (scoreError) {
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
            const entry = {
                original: prompt.trim(),
                originalScore: originalScore,
                improved: result.improved_prompt,
                improvedScore: improvedScore,
                timestamp: Date.now()
            };
            await saveHistory(entry);
            const updatedHistory = await loadHistory();
            setHistory(updatedHistory);
        }
        catch (error) {
            console.error('Optimize error:', error);
            setError(error instanceof Error ? error.message : 'Failed to optimize prompt');
        }
        finally {
            setIsOptimizing(false);
        }
    };
    const handleCopy = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setToast({ message: `${label} copied!`, type: 'success' });
        }
        catch (error) {
            console.error('Failed to copy:', error);
            setToast({ message: 'Failed to copy', type: 'error' });
        }
    };
    const handlePresetSelect = (preset) => {
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
    const handleHistoryLoad = (entry, which) => {
        if (which === 'original') {
            setPrompt(entry.original);
            setOriginalScore(entry.originalScore);
        }
        else if (which === 'improved' && entry.improved) {
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
    return (_jsx(Theme, { appearance: "dark", accentColor: "blue", grayColor: "slate", radius: "medium", scaling: "95%", children: _jsxs("div", { style: { width: '400px', height: '600px', padding: '16px', overflow: 'auto' }, children: [toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) })), _jsxs(Flex, { direction: "column", gap: "4", style: { height: '100%' }, children: [_jsxs(Flex, { justify: "between", align: "center", children: [_jsx(Text, { size: "5", weight: "bold", children: "Prompt Optimizer" }), _jsx(Button, { size: "1", variant: "ghost", onClick: openOptions, children: "Open Options" })] }), !apiKeyConfigured && (_jsx(Callout.Root, { color: "red", children: _jsxs(Callout.Text, { children: ["API key not configured.", ' ', _jsx(Button, { variant: "ghost", size: "1", onClick: openOptions, children: "Open Options" })] }) })), error && (_jsx(Callout.Root, { color: "red", children: _jsx(Callout.Text, { children: error }) })), !isLoading && (_jsx(PromptEditor, { value: prompt, onChange: setPrompt, onClear: handleClear, onPresetSelect: handlePresetSelect, disabled: isLoading })), isScoring && (_jsx("div", { style: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }, children: _jsxs("div", { style: {
                                    background: 'var(--gray-1)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    border: '1px solid var(--gray-6)'
                                }, children: [_jsx(LoadingAnimation, { message: "Analyzing your prompt...", size: 120, type: "scoring" }), _jsx(Text, { size: "2", style: { color: 'var(--gray-11)', marginTop: '12px', display: 'block' }, children: "This might take a few seconds" })] }) })), isOptimizing && (_jsx("div", { style: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }, children: _jsxs("div", { style: {
                                    background: 'var(--gray-1)',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    textAlign: 'center',
                                    border: '1px solid var(--gray-6)'
                                }, children: [_jsx(LoadingAnimation, { message: "Creating your improved prompt...", size: 120, type: "optimizing" }), _jsx(Text, { size: "2", style: { color: 'var(--gray-11)', marginTop: '12px', display: 'block' }, children: "This might take a few seconds" })] }) })), _jsx(Toolbar, { onScore: handleScore, onOptimize: handleOptimize, onCopyOriginal: () => handleCopy(prompt, 'Original prompt'), onCopyImproved: () => handleCopy(improvedPrompt, 'Improved prompt'), disabled: {
                                score: !prompt.trim() || isLoading || !apiKeyConfigured,
                                optimize: !prompt.trim() || isLoading || !apiKeyConfigured,
                                copyOriginal: !prompt.trim(),
                                copyImproved: !improvedPrompt
                            }, loading: {
                                scoring: isScoring,
                                optimizing: isOptimizing
                            } }), _jsx(ScorePanel, { title: "Current score", score: originalScore }), _jsx(ImprovedPanel, { improved: improvedPrompt, checklist: optimizeResult?.checklist, onCopy: (text) => handleCopy(text, 'Improved prompt') }), improvedPrompt && (_jsx(ScorePanel, { title: "New score", score: improvedScore })), _jsx(HistoryList, { entries: history, onLoad: handleHistoryLoad })] })] }) }));
};
export default Popup;
