import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Button, Flex } from '@radix-ui/themes';
const ImprovedPanel = ({ improved, checklist, onCopy }) => {
    if (!improved) {
        return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Improved Prompt" }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: "No improved prompt yet" })] }));
    }
    return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '12px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: "Improved Prompt" }), _jsx(Button, { size: "1", variant: "ghost", onClick: () => onCopy(improved), "aria-label": "Copy improved prompt to clipboard", children: "Copy" })] }), _jsx("div", { style: {
                    background: 'var(--gray-2)',
                    border: '2px solid var(--gray-6)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: checklist ? '16px' : '0',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    fontSize: '14px',
                    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                }, children: _jsx("div", { style: {
                        lineHeight: '1.8',
                        color: 'var(--gray-12)',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }, children: improved.split('\n').map((paragraph, idx) => (_jsx("p", { style: {
                            margin: paragraph.trim() ? '0 0 12px 0' : '0',
                            fontSize: '14px',
                            fontWeight: '400'
                        }, children: paragraph }, idx))) }) }), checklist && checklist.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Improvements Made:" }), _jsx("div", { style: {
                            background: 'var(--blue-2)',
                            border: '1px solid var(--blue-6)',
                            borderRadius: '6px',
                            padding: '12px'
                        }, children: checklist.map((item, idx) => (_jsxs(Text, { size: "2", style: {
                                display: 'block',
                                marginBottom: '6px',
                                lineHeight: '1.5'
                            }, children: ["\u2713 ", item] }, idx))) })] }))] }));
};
export default ImprovedPanel;
