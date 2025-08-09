import React, { useEffect, useState } from 'react';
import { Card, Text } from '@radix-ui/themes';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
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

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Card style={{ 
        padding: '12px 16px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <Text size="2" style={{ color: textColor }}>
          {message}
        </Text>
      </Card>
    </div>
  );
};

export default Toast;