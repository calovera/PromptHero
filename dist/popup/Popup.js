import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Box, Flex, Heading, Button, Text } from '@radix-ui/themes';
import PromptEditor from './components/PromptEditor';
import ScorePanel from './components/ScorePanel';
import ImprovedPanel from './components/ImprovedPanel';
import HistoryList from './components/HistoryList';
import Toolbar from './components/Toolbar';
const Popup = () => {
    const [prompt, setPrompt] = useState('');
    const [score, setScore] = useState(null);
    const [improvedPrompt, setImprovedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleOpenOptions = () => {
        chrome.runtime.openOptionsPage();
    };
    const handleScorePrompt = async () => {
        if (!prompt.trim())
            return;
        setIsLoading(true);
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'SCORE_PROMPT',
                prompt: prompt.trim()
            });
            if (response.ok) {
                setScore(response.data.score);
            }
            else {
                console.error('Failed to score prompt:', response.error);
                // You could show an error message to the user here
            }
        }
        catch (error) {
            console.error('Failed to score prompt:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOptimizePrompt = async () => {
        if (!prompt.trim())
            return;
        setIsLoading(true);
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'OPTIMIZE_PROMPT',
                prompt: prompt.trim()
            });
            if (response.ok) {
                setImprovedPrompt(response.data.improvedPrompt);
            }
            else {
                console.error('Failed to optimize prompt:', response.error);
                // You could show an error message to the user here
            }
        }
        catch (error) {
            console.error('Failed to optimize prompt:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx(Box, { p: "4", style: { width: '100%', height: '100%' }, children: _jsxs(Flex, { direction: "column", gap: "4", style: { height: '100%' }, children: [_jsxs(Flex, { justify: "between", align: "center", children: [_jsx(Heading, { size: "4", children: "PromptHero" }), _jsx(Button, { variant: "ghost", size: "2", onClick: handleOpenOptions, children: _jsx(Text, { size: "2", children: "Options" }) })] }), _jsx(PromptEditor, { value: prompt, onChange: setPrompt, placeholder: "Enter your prompt here to analyze and optimize..." }), _jsxs(Flex, { gap: "2", children: [_jsx(Button, { onClick: handleScorePrompt, disabled: !prompt.trim() || isLoading, style: { flex: 1 }, children: isLoading ? 'Scoring...' : 'Score' }), _jsx(Button, { onClick: handleOptimizePrompt, disabled: !prompt.trim() || isLoading, style: { flex: 1 }, children: isLoading ? 'Optimizing...' : 'Optimize' })] }), _jsxs(Flex, { direction: "column", gap: "3", style: { flex: 1 }, children: [_jsx(ScorePanel, { score: score }), _jsx(ImprovedPanel, { improvedPrompt: improvedPrompt })] }), _jsx(Toolbar, { prompt: prompt, improvedPrompt: improvedPrompt }), _jsx(HistoryList, {})] }) }));
};
export default Popup;
