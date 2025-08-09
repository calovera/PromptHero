import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Box, TextArea } from '@radix-ui/themes';
const ImprovedPanel = ({ improvedPrompt }) => {
    return (_jsx(Card, { children: _jsxs(Box, { children: [_jsx(Text, { size: "2", weight: "medium", mb: "2", style: { display: 'block' }, children: "Improved Prompt" }), improvedPrompt ? (_jsx(TextArea, { value: improvedPrompt, readOnly: true, rows: 4, style: {
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                        backgroundColor: 'var(--gray-2)',
                        cursor: 'text'
                    } })) : (_jsx(Box, { p: "3", style: { backgroundColor: 'var(--gray-2)', borderRadius: 'var(--radius-2)' }, children: _jsx(Text, { size: "2", color: "gray", children: "No improved prompt yet" }) })), improvedPrompt && (_jsxs(Text, { size: "1", color: "gray", mt: "1", style: { display: 'block' }, children: [improvedPrompt.length, " characters"] }))] }) }));
};
export default ImprovedPanel;
