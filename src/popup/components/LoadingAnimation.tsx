import React from 'react';
import Lottie from 'lottie-react';
import { Flex, Text } from '@radix-ui/themes';
import typingAnimation from '../../animations/typing.json';
import scoringAnimation from '../../animations/scoring.json';
import optimizingAnimation from '../../animations/optimizing.json';

interface LoadingAnimationProps {
  message: string;
  size?: number;
  type?: 'typing' | 'scoring' | 'optimizing';
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message, 
  size = 60, 
  type = 'typing' 
}) => {
  const getAnimation = () => {
    switch (type) {
      case 'scoring':
        return scoringAnimation;
      case 'optimizing':
        return optimizingAnimation;
      default:
        return typingAnimation;
    }
  };

  return (
    <Flex direction="column" align="center" gap="3">
      <Lottie 
        animationData={getAnimation()}
        style={{ width: size, height: size }}
        loop={true}
      />
      <Text size="3" weight="medium" style={{ color: 'var(--gray-12)' }}>
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingAnimation;