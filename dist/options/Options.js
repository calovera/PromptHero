import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Theme, Button, Card, Text, TextField, Flex } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { setKey, getKey } from '../lib/storage';
import { testApiKeyViaBg } from '../lib/messages';
const Toast = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (_jsx("div", { style: {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            background: type === 'success' ? '#0d9488' : '#dc2626',
            color: 'white',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }, children: message }));
};
const Options = () => {
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    useEffect(() => {
        // Load saved API key on component mount
        loadApiKey();
    }, []);
    const loadApiKey = async () => {
        try {
            const key = await getKey();
            if (key) {
                setApiKey(key);
            }
        }
        catch (error) {
            console.error('Failed to load API key:', error);
        }
    };
    const saveApiKey = async () => {
        if (!apiKey.trim()) {
            showToast('error', 'Please enter an API key');
            return;
        }
        setIsLoading(true);
        try {
            await setKey(apiKey.trim());
            showToast('success', 'API key saved successfully');
        }
        catch (error) {
            console.error('Failed to save API key:', error);
            showToast('error', 'Failed to save API key');
        }
        finally {
            setIsLoading(false);
        }
    };
    const testApiKey = async () => {
        if (!apiKey.trim()) {
            showToast('error', 'Please enter an API key first');
            return;
        }
        setIsLoading(true);
        try {
            // Save the key first so the background can access it
            await setKey(apiKey.trim());
            const result = await testApiKeyViaBg();
            if (result.ok) {
                showToast('success', 'Key works');
            }
            else {
                showToast('error', 'API key test failed');
            }
        }
        catch (error) {
            console.error('Failed to test API key:', error);
            showToast('error', `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        finally {
            setIsLoading(false);
        }
    };
    const showToast = (type, message) => {
        setToast({ type, message });
    };
    const closeToast = () => {
        setToast(null);
    };
    return (_jsx(Theme, { appearance: "dark", accentColor: "blue", grayColor: "slate", radius: "medium", scaling: "100%", children: _jsxs("div", { style: { padding: '24px', maxWidth: '600px', margin: '0 auto' }, children: [toast && (_jsx(Toast, { type: toast.type, message: toast.message, onClose: closeToast })), _jsx(Card, { style: { padding: '24px' }, children: _jsxs(Flex, { direction: "column", gap: "4", children: [_jsxs("div", { children: [_jsx(Text, { size: "6", weight: "bold", children: "PromptHero Options" }), _jsx(Text, { size: "2", style: { color: 'var(--gray-11)', marginTop: '4px', display: 'block' }, children: "Configure your Gemini API key to start optimizing prompts" })] }), _jsxs("div", { children: [_jsx(Text, { size: "3", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Gemini API Key" }), _jsx(TextField.Root, { value: apiKey, onChange: (e) => setApiKey(e.target.value), placeholder: "Enter your Gemini API key (starts with AIza...)", size: "3", style: { width: '100%' }, type: "password" }), _jsxs(Text, { size: "1", style: { color: 'var(--gray-11)', marginTop: '4px', display: 'block' }, children: ["Get your free API key from", ' ', _jsx("a", { href: "https://aistudio.google.com/app/apikey", target: "_blank", rel: "noopener noreferrer", style: { color: 'var(--accent-11)' }, children: "Google AI Studio" })] })] }), _jsxs(Flex, { gap: "3", style: { marginTop: '16px' }, children: [_jsx(Button, { onClick: saveApiKey, disabled: isLoading || !apiKey.trim(), size: "3", variant: "solid", children: isLoading ? 'Saving...' : 'Save' }), _jsx(Button, { onClick: testApiKey, disabled: isLoading || !apiKey.trim(), size: "3", variant: "outline", children: isLoading ? 'Testing...' : 'Test' })] }), _jsxs("div", { style: { marginTop: '24px', padding: '16px', background: 'var(--gray-3)', borderRadius: '8px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Privacy & Security" }), _jsxs(Text, { size: "1", style: { color: 'var(--gray-11)', lineHeight: '1.5' }, children: ["\u2022 Your API key is stored locally in your browser and never shared", _jsx("br", {}), "\u2022 Prompts are only sent to Google's Gemini API for analysis", _jsx("br", {}), "\u2022 No data is collected or stored by PromptHero", _jsx("br", {}), "\u2022 All communication uses HTTPS encryption"] })] }), _jsxs("div", { style: { marginTop: '16px', padding: '16px', background: 'var(--accent-3)', borderRadius: '8px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "How to Use PromptHero" }), _jsxs(Text, { size: "1", style: { color: 'var(--gray-12)', lineHeight: '1.5' }, children: ["1. Enter your API key above and click \"Save\"", _jsx("br", {}), "2. Click the PromptHero icon in your browser toolbar", _jsx("br", {}), "3. Type or paste any AI prompt you want to improve", _jsx("br", {}), "4. Click \"Score\" to get quality ratings and feedback", _jsx("br", {}), "5. Click \"Optimize\" to get an enhanced version of your prompt"] })] })] }) })] }) }));
};
export default Options;
