import React from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { CopyButton } from '../../lib/ui';

interface ToolbarProps {
  prompt: string;
  improvedPrompt: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ prompt, improvedPrompt }) => {
  return (
    <Flex gap="2" justify="center">
      <CopyButton 
        text={prompt} 
        disabled={!prompt.trim()}
        label="Copy Original"
      />
      <CopyButton 
        text={improvedPrompt} 
        disabled={!improvedPrompt.trim()}
        label="Copy Improved"
      />
    </Flex>
  );
};

export default Toolbar;
