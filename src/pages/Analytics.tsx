import React from 'react';
import { Text, Box } from '@chakra-ui/core';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { AggregateChart } from 'components/AggregateChart';
import { VolumeChart } from 'components/VolumeChart';
import { DailyApys } from 'components/DailyApys';

interface IProps {
  address: string;
  onConnect: () => void;
}

const Analytics: React.FC<IProps> = ({ address, onConnect }) => {
  return (
    <>
      <Header address={address} onConnect={onConnect} isAnalytics />
      <Box w="100%" backgroundColor="lid.bgDark">
        <Box maxW="1200px" mx="auto" pt="20px" px={['20px', '20px', '0px']}>
          <Text fontSize={['26px', '34px']} color="lid.textLight">
            Staking APY
          </Text>
          <Box
            w={['110%', '100%']}
            ml={['-20px', '0px']}
            px={['3px', '60px']}
            mt={['15px', '50px']}
          >
            <DailyApys />
          </Box>
        </Box>
      </Box>
      <Box w="100%" backgroundColor="lid.bgDark">
        <Box maxW="1200px" mx="auto" pt="20px" px={['20px', '20px', '0px']}>
          <Text fontSize={['26px', '34px']} color="lid.textLight">
            Volumes
          </Text>
          <Text fontSize={['16px', '18px']} color="lid.textGray">
            All values in LID
          </Text>
          <Box
            w={['110%', '100%']}
            ml={['-15px', '0px']}
            px={['3px', '60px']}
            mt={['0', '50px']}
          >
            <VolumeChart />
          </Box>
        </Box>
      </Box>
      <Box w="100%" backgroundColor="lid.bgDark">
        <Box maxW="1200px" mx="auto" pt="20px" px={['20px', '20px', '0px']}>
          <Text fontSize={['26px', '34px']} color="lid.textLight">
            Totals
          </Text>
          <Text fontSize={['16px', '18px']} color="lid.textGray">
            All values in LID
          </Text>
          <Box
            w={['115%', '100%']}
            ml={['-7px', '0px']}
            px={['3px', '60px']}
            mt={['0px', '50px']}
          >
            <AggregateChart />
          </Box>
        </Box>
      </Box>
      <Footer isAnalytics />
    </>
  );
};

export default Analytics;
