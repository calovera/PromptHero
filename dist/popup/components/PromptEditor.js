import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TextArea, Button, Flex, Text, Badge } from '@radix-ui/themes';
const presets = {
    'Coding': `You are a senior engineer. Goal: <<task>>. Inputs I will provide. Steps to follow. Constraints. Output format: code block then short explanation.`,
    'Data extraction': `Extract structured fields from unstructured text. Goal. Required fields with types. Validation rules. Output format: strict JSON schema.`,
    'Brainstorm': `Generate 10 ideas. Constraints. Audience. Must-include. Output as numbered list with one-line rationales.`,
    'Customer support': `Act as support agent. Goal. Tone. Required checks. Escalation rules. Output: greeting, resolution steps, closing.`
};
const PromptEditor = ({ value, onChange, onClear, onPresetSelect, disabled = false }) => {
    const characterCount = value.length;
    return (_jsxs("div", { children: [_jsx(TextArea, { value: value, onChange: (e) => onChange(e.target.value), placeholder: "Paste your prompt\u2026", rows: 6, style: { width: '100%', marginBottom: '8px' }, disabled: disabled, "aria-label": "Prompt input" }), _jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '12px' }, children: [_jsxs(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: [characterCount, " characters"] }), _jsx(Button, { size: "1", variant: "ghost", onClick: onClear, disabled: disabled || !value, "aria-label": "Clear prompt", children: "Clear" })] }), _jsxs("div", { children: [_jsx(Text, { size: "1", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: "Quick presets:" }), _jsx(Flex, { gap: "2", wrap: "wrap", children: Object.entries(presets).map(([name, template]) => (_jsx(Badge, { size: "1", style: { cursor: disabled ? 'not-allowed' : 'pointer' }, onClick: () => !disabled && onPresetSelect(template), "aria-label": `Insert ${name} preset`, children: name }, name))) })] })] }));
};
export default PromptEditor;
