import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Lottie from 'lottie-react';
import { Flex, Text } from '@radix-ui/themes';
import typingAnimation from '../../animations/typing.json';
import scoringAnimation from '../../animations/scoring.json';
import optimizingAnimation from '../../animations/optimizing.json';
const LoadingAnimation = ({ message, size = 60, type = 'typing' }) => {
    const getAnimation = () => {
        switch (type) {
            case 'scoring':
                return scoringAnimation;
            case 'optimizing':
                return optimizingAnimation;
            default:
                return typingAnimation;
        }
    };
    return (_jsxs(Flex, { direction: "column", align: "center", gap: "3", children: [_jsx(Lottie, { animationData: getAnimation(), style: { width: size, height: size }, loop: true }), _jsx(Text, { size: "3", weight: "medium", style: { color: 'var(--gray-12)' }, children: message })] }));
};
export default LoadingAnimation;
