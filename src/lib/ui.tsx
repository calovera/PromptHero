import React, { useState } from 'react';
import { Button, Tooltip } from '@radix-ui/themes';

// Copy button component with feedback
interface CopyButtonProps {
  text: string;
  disabled?: boolean;
  label?: string;
  size?: '1' | '2' | '3' | '4';
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
}

export const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  disabled = false, 
  label = 'Copy',
  size = '2',
  variant = 'outline'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || disabled) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      }
    }
  };

  return (
    <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
      <Button
        onClick={handleCopy}
        disabled={disabled}
        variant={variant}
        size={size}
      >
        {copied ? '✓ Copied' : label}
      </Button>
    </Tooltip>
  );
};

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium' 
}) => {
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: '2px solid var(--gray-6)',
        borderTop: '2px solid var(--accent-9)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        display: 'inline-block'
      }}
    />
  );
};

// Error message component
interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onDismiss 
}) => {
  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: 'var(--red-3)',
        border: '1px solid var(--red-6)',
        borderRadius: 'var(--radius-2)',
        color: 'var(--red-11)',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--red-11)',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Success message component
interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
  message, 
  onDismiss 
}) => {
  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: 'var(--green-3)',
        border: '1px solid var(--green-6)',
        borderRadius: 'var(--radius-2)',
        color: 'var(--green-11)',
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--green-11)',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Confirm dialog hook
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const confirm = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config?.onConfirm();
    setIsOpen(false);
    setConfig(null);
  };

  const handleCancel = () => {
    config?.onCancel?.();
    setIsOpen(false);
    setConfig(null);
  };

  const ConfirmDialog = () => {
    if (!isOpen || !config) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-background)',
            padding: '24px',
            borderRadius: 'var(--radius-3)',
            maxWidth: '400px',
            width: '90%',
            border: '1px solid var(--gray-6)'
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>
            {config.title}
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--gray-11)' }}>
            {config.message}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return { confirm, ConfirmDialog };
};

// Format text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const formatTimestamp = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export const formatRelativeTime = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatTimestamp(date);
};
