import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextArea, Text, Box } from '@radix-ui/themes';
const PromptEditor = ({ value, onChange, placeholder }) => {
    return (_jsxs(Box, { children: [_jsx(Text, { size: "2", weight: "medium", mb: "2", style: { display: 'block' }, children: "Prompt" }), _jsx(TextArea, { value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, rows: 6, style: {
                    resize: 'vertical',
                    minHeight: '120px',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                } }), _jsxs(Text, { size: "1", color: "gray", mt: "1", style: { display: 'block' }, children: [value.length, " characters"] })] }));
};
export default PromptEditor;
