import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Badge, Flex, Button, ScrollArea, DropdownMenu } from '@radix-ui/themes';
const HistoryList = ({ entries, onLoad }) => {
    if (entries.length === 0) {
        return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "History" }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: "No history yet" })] }));
    }
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMins < 1)
            return 'Just now';
        if (diffMins < 60)
            return `${diffMins}m ago`;
        if (diffHours < 24)
            return `${diffHours}h ago`;
        if (diffDays < 7)
            return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsxs(Text, { size: "2", weight: "medium", style: { marginBottom: '12px', display: 'block' }, children: ["History (", entries.length, ")"] }), _jsx(ScrollArea, { style: { height: '200px' }, children: _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: entries.slice(0, 10).map((entry, idx) => (_jsxs("div", { style: {
                            padding: '8px',
                            background: 'var(--gray-2)',
                            borderRadius: '4px',
                            border: '1px solid var(--gray-5)'
                        }, children: [_jsx(Text, { size: "1", style: {
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginBottom: '6px'
                                }, children: entry.original }), _jsxs(Flex, { justify: "between", align: "center", children: [_jsxs(Flex, { gap: "2", align: "center", children: [_jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: formatDate(entry.timestamp) }), entry.originalScore && (_jsxs(Badge, { size: "1", color: "gray", children: [entry.originalScore.score, "/100"] })), entry.improved && (_jsx(Badge, { size: "1", color: "green", children: "Optimized" }))] }), _jsxs(DropdownMenu.Root, { children: [_jsx(DropdownMenu.Trigger, { children: _jsx(Button, { size: "1", variant: "ghost", "aria-label": "Load prompt options", children: "Load" }) }), _jsxs(DropdownMenu.Content, { children: [_jsx(DropdownMenu.Item, { onClick: () => onLoad(entry, 'original'), "aria-label": "Load original prompt", children: "Load Original" }), entry.improved && (_jsx(DropdownMenu.Item, { onClick: () => onLoad(entry, 'improved'), "aria-label": "Load improved prompt", children: "Load Improved" }))] })] })] })] }, idx))) }) })] }));
};
export default HistoryList;
