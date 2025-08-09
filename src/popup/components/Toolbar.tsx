import React from 'react';
import { Button, Flex, Tooltip } from '@radix-ui/themes';

interface ToolbarProps {
  onScore: () => void;
  onOptimize: () => void;
  onCopyOriginal: () => void;
  onCopyImproved: () => void;
  disabled: {
    score: boolean;
    optimize: boolean;
    copyOriginal: boolean;
    copyImproved: boolean;
  };
  loading: {
    scoring: boolean;
    optimizing: boolean;
  };
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onScore, 
  onOptimize, 
  onCopyOriginal, 
  onCopyImproved, 
  disabled,
  loading 
}) => {
  return (
    <Flex gap="2" style={{ marginBottom: '16px' }}>
      <Button
        onClick={onScore}
        disabled={disabled.score}
        variant="solid"
        style={{ flex: 1 }}
        aria-label="Score current prompt"
      >
        {loading.scoring ? 'Scoring...' : 'Score'}
      </Button>
      
      <Button
        onClick={onOptimize}
        disabled={disabled.optimize}
        variant="solid"
        style={{ flex: 1 }}
        aria-label="Optimize current prompt"
      >
        {loading.optimizing ? 'Optimizing...' : 'Optimize'}
      </Button>
      
      <Tooltip content="Copy original prompt to clipboard">
        <Button
          onClick={onCopyOriginal}
          disabled={disabled.copyOriginal}
          variant="outline"
          size="2"
          aria-label="Copy original prompt"
        >
          Copy Original
        </Button>
      </Tooltip>
      
      <Tooltip content="Copy improved prompt to clipboard">
        <Button
          onClick={onCopyImproved}
          disabled={disabled.copyImproved}
          variant="outline"
          size="2"
          aria-label="Copy improved prompt"
        >
          Copy Improved
        </Button>
      </Tooltip>
    </Flex>
  );
};

export default Toolbar;