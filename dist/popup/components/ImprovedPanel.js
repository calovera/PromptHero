import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Button, Flex } from '@radix-ui/themes';
const ImprovedPanel = ({ improved, checklist, onCopy }) => {
    if (!improved) {
        return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Improved Prompt" }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: "No improved prompt yet" })] }));
    }
    return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '12px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: "Improved Prompt" }), _jsx(Button, { size: "1", variant: "ghost", onClick: () => onCopy(improved), "aria-label": "Copy improved prompt to clipboard", children: "Copy" })] }), _jsx("div", { style: {
                    background: 'var(--gray-3)',
                    border: '1px solid var(--gray-6)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: checklist ? '16px' : '0',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }, children: _jsx(Text, { size: "2", style: {
                        lineHeight: '1.6',
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                    }, children: improved }) }), checklist && checklist.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Improvements Made:" }), _jsx("div", { style: {
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
