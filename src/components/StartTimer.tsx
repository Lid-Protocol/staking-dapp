import React from 'react';
import { Text, Box } from '@chakra-ui/core';
import CountDown from './CountDown';

interface IStartTimer {
  expiryTimestamp: number;
}

const StartTimer: React.FC<IStartTimer> = ({ expiryTimestamp }) => {
  return (
    <Box
      display="block"
      w="100%"
      my="40px"
      mx="auto"
      px={['20px', '20px', '0px']}
      maxW="1200px"
      textAlign="center"
    >
      <Text fontSize={['36px, 28px']} fontWeight="bold">
        Lid Staking starts in
      </Text>
      <CountDown expiryTimestamp={expiryTimestamp} />
    </Box>
  );
};

export default StartTimer;
