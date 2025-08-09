import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Tooltip } from '@radix-ui/themes';
export const CopyButton = ({ text, disabled = false, label = 'Copy', size = '2', variant = 'outline' }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        if (!text || disabled)
            return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        catch (error) {
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
            }
            catch (fallbackError) {
                console.error('Fallback copy also failed:', fallbackError);
            }
        }
    };
    return (_jsx(Tooltip, { content: copied ? 'Copied!' : 'Copy to clipboard', children: _jsx(Button, { onClick: handleCopy, disabled: disabled, variant: variant, size: size, children: copied ? '✓ Copied' : label }) }));
};
export const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeMap = {
        small: '16px',
        medium: '24px',
        large: '32px'
    };
    return (_jsx("div", { style: {
            width: sizeMap[size],
            height: sizeMap[size],
            border: '2px solid var(--gray-6)',
            borderTop: '2px solid var(--accent-9)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            display: 'inline-block'
        } }));
};
export const ErrorMessage = ({ message, onDismiss }) => {
    return (_jsxs("div", { style: {
            padding: '12px',
            backgroundColor: 'var(--red-3)',
            border: '1px solid var(--red-6)',
            borderRadius: 'var(--radius-2)',
            color: 'var(--red-11)',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }, children: [_jsx("span", { children: message }), onDismiss && (_jsx("button", { onClick: onDismiss, style: {
                    background: 'none',
                    border: 'none',
                    color: 'var(--red-11)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px'
                }, children: "\u00D7" }))] }));
};
export const SuccessMessage = ({ message, onDismiss }) => {
    return (_jsxs("div", { style: {
            padding: '12px',
            backgroundColor: 'var(--green-3)',
            border: '1px solid var(--green-6)',
            borderRadius: 'var(--radius-2)',
            color: 'var(--green-11)',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }, children: [_jsx("span", { children: message }), onDismiss && (_jsx("button", { onClick: onDismiss, style: {
                    background: 'none',
                    border: 'none',
                    color: 'var(--green-11)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginLeft: '8px'
                }, children: "\u00D7" }))] }));
};
// Confirm dialog hook
export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState(null);
    const confirm = (options) => {
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
        if (!isOpen || !config)
            return null;
        return (_jsx("div", { style: {
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
            }, children: _jsxs("div", { style: {
                    backgroundColor: 'var(--color-background)',
                    padding: '24px',
                    borderRadius: 'var(--radius-3)',
                    maxWidth: '400px',
                    width: '90%',
                    border: '1px solid var(--gray-6)'
                }, children: [_jsx("h3", { style: { margin: '0 0 12px 0', fontSize: '16px' }, children: config.title }), _jsx("p", { style: { margin: '0 0 20px 0', fontSize: '14px', color: 'var(--gray-11)' }, children: config.message }), _jsxs("div", { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' }, children: [_jsx(Button, { variant: "ghost", onClick: handleCancel, children: "Cancel" }), _jsx(Button, { onClick: handleConfirm, children: "Confirm" })] })] }) }));
    };
    return { confirm, ConfirmDialog };
};
// Format text utilities
export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
};
export const formatTimestamp = (timestamp) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(date);
};
export const formatRelativeTime = (timestamp) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMinutes < 1)
        return 'Just now';
    if (diffMinutes < 60)
        return `${diffMinutes}m ago`;
    if (diffHours < 24)
        return `${diffHours}h ago`;
    if (diffDays < 7)
        return `${diffDays}d ago`;
    return formatTimestamp(date);
};
