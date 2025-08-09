import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Lottie from 'lottie-react';
import { Flex, Text } from '@radix-ui/themes';
import typingAnimation from '../../animations/typing.json';
const LoadingAnimation = ({ message, size = 60 }) => {
    return (_jsxs(Flex, { direction: "column", align: "center", gap: "2", style: { padding: '16px' }, children: [_jsx(Lottie, { animationData: typingAnimation, style: { width: size, height: size }, loop: true }), _jsx(Text, { size: "1", style: { color: 'var(--gray-11)' }, children: message })] }));
};
export default LoadingAnimation;
