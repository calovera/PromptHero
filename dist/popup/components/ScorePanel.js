import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Badge, Flex } from '@radix-ui/themes';
const ScorePanel = ({ title, score }) => {
    if (!score) {
        return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { marginBottom: '8px', display: 'block' }, children: title }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: "No score yet" })] }));
    }
    const getScoreColor = (score) => {
        if (score >= 80)
            return 'green';
        if (score >= 60)
            return 'yellow';
        return 'red';
    };
    return (_jsxs(Card, { style: { padding: '16px' }, children: [_jsxs(Flex, { justify: "between", align: "center", style: { marginBottom: '12px' }, children: [_jsx(Text, { size: "2", weight: "medium", children: title }), _jsxs(Badge, { size: "2", color: getScoreColor(score.score), children: [score.score, "/100"] })] }), score.issues.length > 0 && (_jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx(Text, { size: "2", weight: "medium", style: { color: 'var(--red-11)', marginBottom: '8px', display: 'block' }, children: "Issues Found:" }), _jsx("div", { style: {
                            background: 'var(--red-2)',
                            border: '1px solid var(--red-6)',
                            borderRadius: '6px',
                            padding: '12px'
                        }, children: score.issues.map((issue, idx) => (_jsxs(Text, { size: "2", style: {
                                display: 'block',
                                marginBottom: '6px',
                                lineHeight: '1.5'
                            }, children: ["\u2022 ", issue] }, idx))) })] })), score.suggestions.length > 0 && (_jsxs("div", { children: [_jsx(Text, { size: "2", weight: "medium", style: { color: 'var(--green-11)', marginBottom: '8px', display: 'block' }, children: "Suggestions:" }), _jsx("div", { style: {
                            background: 'var(--green-2)',
                            border: '1px solid var(--green-6)',
                            borderRadius: '6px',
                            padding: '12px'
                        }, children: score.suggestions.map((suggestion, idx) => (_jsxs(Text, { size: "2", style: {
                                display: 'block',
                                marginBottom: '6px',
                                lineHeight: '1.5'
                            }, children: ["\u2022 ", suggestion] }, idx))) })] }))] }));
};
export default ScorePanel;
