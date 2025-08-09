import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Container, Card, Heading, Text, TextField, Button, Flex, Box, Separator, Callout } from '@radix-ui/themes';
const Options = () => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        // Load existing API key on component mount
        loadApiKey();
    }, []);
    const loadApiKey = async () => {
        try {
            const result = await chrome.storage.sync.get(['geminiApiKey']);
            if (result.geminiApiKey) {
                setApiKey(result.geminiApiKey);
            }
        }
        catch (error) {
            console.error('Failed to load API key:', error);
        }
    };
    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            await chrome.storage.sync.set({ geminiApiKey: apiKey.trim() });
            setMessage({ type: 'success', text: 'API key saved successfully!' });
        }
        catch (error) {
            console.error('Failed to save API key:', error);
            setMessage({ type: 'error', text: 'Failed to save API key. Please try again.' });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleTest = async () => {
        if (!apiKey.trim()) {
            setMessage({ type: 'error', text: 'Please enter an API key first.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            const response = await chrome.runtime.sendMessage({
                type: 'TEST_API_KEY',
                apiKey: apiKey.trim()
            });
            if (response.ok && response.data.isValid) {
                setMessage({ type: 'success', text: 'API key is valid and working!' });
            }
            else {
                setMessage({ type: 'error', text: 'API key is invalid. Please check your key and try again.' });
            }
        }
        catch (error) {
            console.error('Failed to test API key:', error);
            setMessage({ type: 'error', text: 'Failed to test API key. Please check your connection.' });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleClear = async () => {
        try {
            await chrome.storage.sync.remove(['geminiApiKey']);
            setApiKey('');
            setMessage({ type: 'success', text: 'API key cleared successfully!' });
        }
        catch (error) {
            console.error('Failed to clear API key:', error);
            setMessage({ type: 'error', text: 'Failed to clear API key. Please try again.' });
        }
    };
    return (_jsxs(Container, { size: "2", p: "6", children: [_jsxs(Box, { mb: "6", children: [_jsx(Heading, { size: "6", mb: "2", children: "PromptHero Settings" }), _jsx(Text, { color: "gray", children: "Configure your API settings and preferences" })] }), _jsxs(Flex, { direction: "column", gap: "6", children: [_jsx(Card, { children: _jsxs(Flex, { direction: "column", gap: "4", children: [_jsx(Heading, { size: "4", children: "Gemini API Configuration" }), _jsxs(Box, { children: [_jsx(Text, { size: "2", weight: "medium", mb: "2", style: { display: 'block' }, children: "API Key" }), _jsx(TextField.Root, { value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "Enter your Gemini API key...", type: "password", size: "3" }), _jsx(Text, { size: "1", color: "gray", mt: "1", style: { display: 'block' }, children: "Your API key is stored locally and never shared with third parties." })] }), _jsxs(Flex, { gap: "2", children: [_jsx(Button, { onClick: handleSave, disabled: isLoading || !apiKey.trim(), style: { flex: 1 }, children: isLoading ? 'Saving...' : 'Save' }), _jsx(Button, { variant: "outline", onClick: handleTest, disabled: isLoading || !apiKey.trim(), style: { flex: 1 }, children: isLoading ? 'Testing...' : 'Test' }), _jsx(Button, { variant: "soft", color: "red", onClick: handleClear, disabled: isLoading, children: "Clear" })] }), message && (_jsx(Callout.Root, { color: message.type === 'success' ? 'green' : 'red', children: _jsx(Callout.Text, { children: message.text }) }))] }) }), _jsx(Separator, { size: "4" }), _jsx(Card, { children: _jsxs(Flex, { direction: "column", gap: "3", children: [_jsx(Heading, { size: "4", children: "Getting Your API Key" }), _jsx(Text, { size: "2", children: "To use PromptHero, you'll need a Gemini API key from Google AI Studio:" }), _jsxs(Box, { pl: "4", children: [_jsxs(Text, { size: "2", style: { display: 'block', marginBottom: '4px' }, children: ["1. Visit", ' ', _jsx(Text, { color: "blue", style: { cursor: 'pointer' }, onClick: () => chrome.tabs.create({ url: 'https://aistudio.google.com/app/apikey' }), children: "Google AI Studio" })] }), _jsx(Text, { size: "2", style: { display: 'block', marginBottom: '4px' }, children: "2. Sign in with your Google account" }), _jsx(Text, { size: "2", style: { display: 'block', marginBottom: '4px' }, children: "3. Click \"Create API Key\"" }), _jsx(Text, { size: "2", style: { display: 'block' }, children: "4. Copy the generated key and paste it above" })] })] }) }), _jsx(Card, { variant: "surface", children: _jsxs(Flex, { direction: "column", gap: "2", children: [_jsx(Heading, { size: "3", children: "Privacy & Security" }), _jsx(Text, { size: "2", color: "gray", children: "PromptHero prioritizes your privacy. Your API key and prompts are stored locally on your device and are only used to make requests to Google's Gemini API. No data is sent to any third-party servers or analytics services." })] }) })] })] }));
};
export default Options;
