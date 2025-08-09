import React from 'react';
import { TextArea, Text, Box } from '@radix-ui/themes';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => {
  return (
    <Box>
      <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
        Prompt
      </Text>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        style={{ 
          resize: 'vertical',
          minHeight: '120px',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
        }}
      />
      <Text size="1" color="gray" mt="1" style={{ display: 'block' }}>
        {value.length} characters
      </Text>
    </Box>
  );
};

export default PromptEditor;
