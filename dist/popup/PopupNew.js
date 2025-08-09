import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Theme, Button, Card, Text, Flex, TextArea, Badge, Separator } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { scorePromptViaBg, optimizePromptViaBg } from '../lib/messages';
import { saveWorkingState, loadWorkingState, saveHistory, loadHistory } from '../lib/storage';
const Popup = () => {
    const [prompt, setPrompt] = useState('');
    const [currentScore, setCurrentScore] = useState(null);
    const [improved, setImproved] = useState('');
    const [improvedScore, setImprovedScore] = useState(null);
    const [optimizeResult, setOptimizeResult] = useState(null);
    const [isScoring, setIsScoring] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
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
        }
        catch (error) {
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
                improvedScore
            });
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
                currentScore,
                improved: result.improved_prompt,
                improvedScore
            });
        }
        catch (error) {
            console.error('Optimize error:', error);
            setError(error instanceof Error ? error.message : 'Failed to optimize prompt');
        }
        finally {
            setIsOptimizing(false);
        }
    };
    const handleSaveToHistory = async () => {
        if (!prompt.trim())
            return;
        const entry = {
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
        }
        catch (error) {
            console.error('Failed to save to history:', error);
        }
    };
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        }
        catch (error) {
            console.error('Failed to copy:', error);
        }
    };
    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    };
    return (_jsx(Theme, { appearance: "dark", accentColor: "blue", grayColor: "slate", radius: "medium", scaling: "95%", children: _jsx("div", { style: { width: '400px', height: '600px', padding: '16px', overflow: 'auto' }, children: _jsxs(Flex, { direction: "column", gap: "4", style: { height: '100%' }, children: [_jsxs(Flex, { justify: "between", align: "center", children: [_jsx(Text, { size: "5", weight: "bold", children: "PromptHero" }), _jsx(Button, { size: "1", variant: "ghost", onClick: openOptions, children: "Options" })] }), error && (_jsx(Card, { style: { padding: '12px', background: 'var(--red-3)', border: '1px solid var(--red-6)' }, children: _jsx(Text, { size: "1", style: { color: 'var(--red-11)' }, children: error }) })), _jsxs("div", { children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Enter your prompt:" }), _jsx(TextArea, { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Type your AI prompt here...", style: { minHeight: '100px', width: '100%' }, size: "2" })] }), _jsxs(Flex, { gap: "2", children: [_jsx(Button, { onClick: handleScore, disabled: isScoring || !prompt.trim(), variant: "solid", style: { flex: 1 }, children: isScoring ? 'Scoring...' : 'Score' }), _jsx(Button, { onClick: handleOptimize, disabled: isOptimizing || !prompt.trim(), variant: "outline", style: { flex: 1 }, children: isOptimizing ? 'Optimizing...' : 'Optimize' })] }), currentScore && (_jsxs(Card, { style: { padding: '12px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '8px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: "Score" }), _jsxs(Badge, { size: "2", color: "blue", children: [currentScore.score, "/100"] })] }), currentScore.issues.length > 0 && (_jsxs("div", { style: { marginBottom: '8px' }, children: [_jsx(Text, { size: "1", weight: "medium", style: { color: 'var(--red-11)' }, children: "Issues:" }), currentScore.issues.map((issue, idx) => (_jsxs(Text, { size: "1", style: { display: 'block', marginLeft: '8px' }, children: ["\u2022 ", issue] }, idx)))] })), currentScore.suggestions.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "1", weight: "medium", style: { color: 'var(--green-11)' }, children: "Suggestions:" }), currentScore.suggestions.map((suggestion, idx) => (_jsxs(Text, { size: "1", style: { display: 'block', marginLeft: '8px' }, children: ["\u2022 ", suggestion] }, idx)))] }))] })), optimizeResult && (_jsxs(Card, { style: { padding: '12px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '8px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: "Improved Prompt" }), _jsx(Button, { size: "1", variant: "ghost", onClick: () => copyToClipboard(optimizeResult.improved_prompt), children: "Copy" })] }), _jsx(Text, { size: "1", style: {
                                    background: 'var(--gray-3)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    display: 'block',
                                    lineHeight: '1.4',
                                    marginBottom: '8px'
                                }, children: optimizeResult.improved_prompt }), optimizeResult.checklist.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "1", weight: "medium", children: "Improvements made:" }), optimizeResult.checklist.map((item, idx) => (_jsxs(Text, { size: "1", style: { display: 'block', marginLeft: '8px' }, children: ["\u2713 ", item] }, idx)))] }))] })), (currentScore || optimizeResult) && (_jsx(Button, { onClick: handleSaveToHistory, variant: "soft", size: "1", children: "Save to History" })), history.length > 0 && (_jsxs("div", { children: [_jsx(Separator, { style: { margin: '8px 0' } }), _jsxs(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: ["Recent History (", history.length, ")"] }), _jsx("div", { style: { maxHeight: '120px', overflow: 'auto' }, children: history.slice(0, 3).map((entry, idx) => (_jsxs(Card, { style: { padding: '8px', marginBottom: '4px' }, children: [_jsx(Text, { size: "1", style: {
                                                display: 'block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }, children: entry.original }), _jsxs(Flex, { gap: "2", style: { marginTop: '4px' }, children: [entry.originalScore && (_jsxs(Badge, { size: "1", color: "gray", children: [entry.originalScore.score, "/100"] })), entry.improved && (_jsx(Badge, { size: "1", color: "green", children: "Optimized" }))] })] }, idx))) })] }))] }) }) }));
};
export default Popup;
