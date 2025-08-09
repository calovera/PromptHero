import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Button, Flex } from '@radix-ui/themes';
const ImprovedPanel = ({ improved, checklist, onCopy }) => {
    if (!improved) {
        return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Improved Prompt" }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: "No improved prompt yet" })] }));
    }
    return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '12px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: "Improved Prompt" }), _jsx(Button, { size: "1", variant: "ghost", onClick: () => onCopy(improved), "aria-label": "Copy improved prompt to clipboard", children: "Copy" })] }), _jsx("pre", { style: {
                    background: 'var(--gray-3)',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    marginBottom: checklist ? '12px' : '0',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                }, children: improved }), checklist && checklist.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "1", weight: "medium", style: { marginBottom: '6px', display: 'block' }, children: "Improvements made:" }), checklist.map((item, idx) => (_jsxs(Text, { size: "1", style: { display: 'block', marginLeft: '8px', marginBottom: '2px' }, children: ["\u2713 ", item] }, idx)))] }))] }));
};
export default ImprovedPanel;
