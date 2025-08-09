import React from 'react';
import { TextArea, Button, Flex, Text, Badge } from '@radix-ui/themes';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onPresetSelect: (preset: string) => void;
  disabled?: boolean;
}

const presets = {
  'Coding': `You are a senior engineer. Goal: <<task>>. Inputs I will provide. Steps to follow. Constraints. Output format: code block then short explanation.`,
  'Data extraction': `Extract structured fields from unstructured text. Goal. Required fields with types. Validation rules. Output format: strict JSON schema.`,
  'Brainstorm': `Generate 10 ideas. Constraints. Audience. Must-include. Output as numbered list with one-line rationales.`,
  'Customer support': `Act as support agent. Goal. Tone. Required checks. Escalation rules. Output: greeting, resolution steps, closing.`
};

const PromptEditor: React.FC<PromptEditorProps> = ({ 
  value, 
  onChange, 
  onClear, 
  onPresetSelect,
  disabled = false 
}) => {
  const characterCount = value.length;

  return (
    <div>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your prompt…"
        rows={6}
        style={{ width: '100%', marginBottom: '8px' }}
        disabled={disabled}
        aria-label="Prompt input"
      />
      
      <Flex justify="between" align="center" style={{ marginBottom: '12px' }}>
        <Text size="1" style={{ color: 'var(--gray-11)' }}>
          {characterCount} characters
        </Text>
        <Button 
          size="1" 
          variant="ghost" 
          onClick={onClear}
          disabled={disabled || !value}
          aria-label="Clear prompt"
        >
          Clear
        </Button>
      </Flex>

      <div>
        <Text size="1" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>
          Quick presets:
        </Text>
        <Flex gap="2" wrap="wrap">
          {Object.entries(presets).map(([name, template]) => (
            <Badge
              key={name}
              size="1"
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
              onClick={() => !disabled && onPresetSelect(template)}
              aria-label={`Insert ${name} preset`}
            >
              {name}
            </Badge>
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default PromptEditor;