import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Text, Flex, Badge } from '@radix-ui/themes';
const ScorePanel = ({ score }) => {
    const getScoreColor = (score) => {
        if (score >= 8)
            return 'green';
        if (score >= 6)
            return 'yellow';
        if (score >= 4)
            return 'orange';
        return 'red';
    };
    const getScoreLabel = (score) => {
        if (score >= 8)
            return 'Excellent';
        if (score >= 6)
            return 'Good';
        if (score >= 4)
            return 'Fair';
        return 'Needs Improvement';
    };
    return (_jsx(Card, { children: _jsxs(Flex, { direction: "column", gap: "2", children: [_jsx(Text, { size: "2", weight: "medium", children: "Prompt Score" }), score !== null ? (_jsxs(Flex, { align: "center", gap: "2", children: [_jsxs(Text, { size: "6", weight: "bold", children: [score, "/10"] }), _jsx(Badge, { color: getScoreColor(score), variant: "soft", children: getScoreLabel(score) })] })) : (_jsx(Text, { size: "2", color: "gray", children: "No score yet" })), score !== null && (_jsx(Text, { size: "1", color: "gray", children: "This score reflects clarity, specificity, and potential effectiveness of your prompt." }))] }) }));
};
export default ScorePanel;
