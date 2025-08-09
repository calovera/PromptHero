import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Card, Text } from '@radix-ui/themes';
const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        // Trigger animation
        setIsVisible(true);
        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 200); // Wait for animation
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    const bgColor = type === 'success' ? 'var(--green-3)' : 'var(--red-3)';
    const borderColor = type === 'success' ? 'var(--green-6)' : 'var(--red-6)';
    const textColor = type === 'success' ? 'var(--green-11)' : 'var(--red-11)';
    return (_jsx("div", { style: {
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 1000,
            transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.2s ease-in-out',
        }, children: _jsx(Card, { style: {
                padding: '12px 16px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }, children: _jsx(Text, { size: "2", style: { color: textColor }, children: message }) }) }));
};
export default Toast;
