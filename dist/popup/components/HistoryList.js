import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Text, Box, Flex, ScrollArea } from '@radix-ui/themes';
const HistoryList = () => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        // TODO: Load history from chrome.storage
        // loadHistoryFromStorage();
    }, []);
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };
    const truncateText = (text, maxLength = 60) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };
    return (_jsxs(Card, { style: { maxHeight: '200px' }, children: [_jsx(Text, { size: "2", weight: "medium", mb: "2", style: { display: 'block' }, children: "Recent History" }), history.length > 0 ? (_jsx(ScrollArea, { style: { height: '160px' }, children: _jsx(Flex, { direction: "column", gap: "2", children: history.map((item) => (_jsx(Box, { p: "2", style: { backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }, children: _jsxs(Flex, { justify: "between", align: "start", gap: "2", children: [_jsxs(Box, { style: { flex: 1, minWidth: 0 }, children: [_jsx(Text, { size: "1", style: { display: 'block', wordBreak: 'break-word' }, children: truncateText(item.originalPrompt) }), item.score && (_jsxs(Text, { size: "1", color: "gray", children: ["Score: ", item.score, "/10"] }))] }), _jsx(Text, { size: "1", color: "gray", style: { flexShrink: 0 }, children: formatDate(item.timestamp) })] }) }, item.id))) }) })) : (_jsx(Box, { p: "3", style: { backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }, children: _jsx(Text, { size: "2", color: "gray", children: "No history yet. Start by scoring or optimizing a prompt!" }) }))] }));
};
export default HistoryList;
