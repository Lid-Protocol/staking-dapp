import React from 'react';
import { Text, Box, Flex, Image,  Button } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom'
import Blockie from './Blockie';

interface IHeader {
  isAnalytics?: boolean;
  address: string;
  onConnect: () => void;
}

const Header: React.FC<IHeader> = ({ isAnalytics, address, onConnect }) => {
  const history = useHistory();

  const onClickLogo = () => {
    history.push("/");
  }

  return (
    <Box w="100%" bg={isAnalytics ? 'lid.bgDark' : 'lid.bgMed'} m="0" pt="0px">
      <Flex
        maxW="1200px"
        align="center"
        mx="auto"
        pt="20px"
        px={['20px', '20px', '0px']}
      >
        <Box
          display="flex"
          alignItems="center"
          m="0px"
          ml="-3px"
          cursor="pointer"
          onClick={onClickLogo}
        >
          <Image
            src="/logo-200.png"
            alt="Lid Website"
            w="auto"
            h="60px"
            display="inline-block"
            position="relative"
          />
          <Text
            as="span"
            fontWeight="bold"
            fontSize={isAnalytics ? ['20px', '28px'] : ['28px', '42px']}
            display="inline-block"
            ml="20px"
            color={isAnalytics ? 'lid.textLight' : 'lid.brand'}
          >
            {`LID ${isAnalytics ? 'ANALYTICS' : 'Staking'}`}
          </Text>
        </Box>
        {address ? (
          <Box ml="auto" display="inline-block">
            <Blockie address={address} size={40} />
            <Text
              fontSize="10px"
              textAlign="center"
              fontFamily="monospace"
              color={isAnalytics ? 'lid.textLight' : 'lid.fg'}
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
      {!isAnalytics && (
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
      )}
    </Box>
  );
};

export default Header;
