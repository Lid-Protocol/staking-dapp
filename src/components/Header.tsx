import React from 'react';
import { Text, Box, Flex, Image, Link, Button } from '@chakra-ui/core';
import Blockie from './Blockie';

interface IHeader {
  address: string;
  onConnect: () => void;
}

const Header: React.FC<IHeader> = ({ address, onConnect }) => {
  return (
    <Box w="100%" bg="lid.bgMed" m="0" pt="0px">
      <Flex
        maxW="1200px"
        align="center"
        mx="auto"
        pt="20px"
        px={['20px', '20px', '0px']}
      >
        <Link display="inline-block" href="https://lid.sh" m="0px" ml="-3px">
          <Image
            src="/logo-200.png"
            alt="Lid Website"
            w="auto"
            h="60px"
            display="inline-block"
            position="relative"
            top="-10px"
          />
          <Text
            as="span"
            fontWeight="bold"
            fontSize={['28px', '42px']}
            display="inline-block"
            ml="20px"
            color="lid.brand"
          >
            LID Staking
          </Text>
        </Link>
        {address ? (
          <Box ml="auto" display="inline-block">
            <Blockie address={address} size={40} />
            <Text
              fontSize="10px"
              textAlign="center"
              fontFamily="monospace"
              color="lid.dkGray"
            >
              {address.substring(0, 6)}
            </Text>
          </Box>
        ) : (
          <Button
            variant="solid"
            background="lid.buttonBgDk"
            color="lid.bg"
            ml="auto"
            p="25px"
            w="140px"
            fontSize="18px"
            fontWeight="500"
            borderRadius="25px"
            onClick={onConnect}
          >
            Connect
          </Button>
        )}
      </Flex>
      <Box
        color="lid.fgMed"
        display="block"
        w="100%"
        px={['20px', '20px', '0px']}
        mx="auto"
        maxW="1200px"
      >
        <Text>v0.1.5</Text>
      </Box>
    </Box>
  );
};

export default Header;
