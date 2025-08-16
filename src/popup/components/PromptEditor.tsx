import React from 'react';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onPresetSelect: (preset: string) => void;
  disabled?: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ 
  value, 
  onChange, 
  onClear, 
  onPresetSelect,
  disabled = false 
}) => {
  // This component is no longer used - replaced by inline content in Popup.tsx
  return null;
};

export default PromptEditor;