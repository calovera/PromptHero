import React from 'react';
import Lottie from 'lottie-react';
import { Flex, Text } from '@radix-ui/themes';
import typingAnimation from '../../animations/typing.json';

interface LoadingAnimationProps {
  message: string;
  size?: number;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ message, size = 60 }) => {
  return (
    <Flex direction="column" align="center" gap="2" style={{ padding: '16px' }}>
      <Lottie 
        animationData={typingAnimation}
        style={{ width: size, height: size }}
        loop={true}
      />
      <Text size="1" style={{ color: 'var(--gray-11)' }}>
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingAnimation;