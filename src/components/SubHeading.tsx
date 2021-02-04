import React, { useMemo } from 'react';
import { Text, Box, Flex, Link, Grid, Image } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

import { shortEther, percentageFormat } from 'utils';
import { addresses } from 'config';

import { startOfDay, subDays, getUnixTime } from 'date-fns';

import { DateRange } from './Metrics';

import {
  TransactionType,
  AggregateMetricType,
  TimeMetricPeriod,
  useVolumeMetricsOfTypeQuery,
  useAggregateMetricsOfTypeQuery
} from '../graphql';

const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  from: startOfDay(subDays(new Date(), 7)),
  end: startOfDay(subDays(new Date(), 1))
};

const useAverageApysForPastWeek = () => {
  const queryStake = useAggregateMetricsOfTypeQuery({
    variables: {
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
      type: AggregateMetricType.TotalStaked
    },
    skip: false,
    fetchPolicy: 'cache-and-network'
  });

  const queryDistribute = useVolumeMetricsOfTypeQuery({
    variables: {
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
      type: TransactionType.StakingContractDistribute
    },
    skip: false,
    fetchPolicy: 'cache-and-network'
  });

  return useMemo(() => {
    if (!queryStake.data || !queryDistribute.data) return 0;
    let aggregateApy = 0;

    queryStake.data.aggregateMetrics.map(({ value: stakeVal }, index) => {
      const distributeVal = queryDistribute.data?.volumeMetrics[index].value;
      const percentage =
        parseFloat(stakeVal) === 0
          ? 0
          : parseFloat(
              (
                ((parseFloat(distributeVal!) * 365) / parseFloat(stakeVal)) *
                100
              ).toFixed(2)
            );
      aggregateApy += percentage;
    });
    return aggregateApy / 7;
  }, [queryStake.data, queryDistribute.data]);
};

interface ISubHeadingProps {
  totalLid: string;
  totalStaked: string;
  totalStakers: string;
  accountLidStaked: string;
  accountLid: string;
}

const SubHeading: React.FC<ISubHeadingProps> = ({
  totalLid,
  totalStaked,
  totalStakers,
  accountLidStaked,
  accountLid
}) => {
  const averageApy = useAverageApysForPastWeek();
  const history = useHistory();
  console.log('averageApy', averageApy);

  const onClickAnalytics = () => {
    history.push('/analytics');
  };

  return (
    <Box
      w="100%"
      m="0"
      p={['20px', '20px', '0px']}
      pt="0px"
      pb="20px"
      bg="lid.bgMed"
      position="relative"
    >
      <Box
        position="absolute"
        zIndex={1}
        left="0px"
        right="0px"
        bottom="0px"
        height="100px"
        bg="lid.bg"
      />
      <Flex
        w="100%"
        maxW="1200px"
        align="center"
        ml="auto"
        mr="auto"
        p="0px"
        pt="20px"
        pb="20px"
        position="relative"
        zIndex={2}
      >
        <Grid
          w="100%"
          gap="20px"
          templateRows={['repeat(6, 1fr)', 'repeat(2, max-content)']}
          templateColumns={['auto', 'repeat(3, minmax(0, 1fr))']}
        >
          <Box
            w="100%"
            borderRadius="5px"
            p="25px"
            border="solid 1px"
            borderColor="lid.stroke"
            bg="lid.bg"
          >
            <Text fontSize="18px" m="0" p="0" color="lid.fgMed">
              Verified LID Staking Contract
            </Text>
            <Link
              wordBreak="break-word"
              color="lid.brand"
              href={'https://etherscan.io/address/' + addresses.lidStaking}
              mt="15px"
              display="block"
            >
              {addresses.lidStaking}
            </Link>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="white"
            borderRadius="5px"
            p="25px"
            background="linear-gradient(0deg, rgba(12,101,235,1) 0%, rgba(28,158,247,1) 100%)"
          >
            <Image
              src="/LID_logo_pure_white.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.bg" display="inline-block">
              Your Staked LID
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold">
              {shortEther(accountLidStaked)}
            </Text>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="white"
            borderRadius="5px"
            p="25px"
            background="linear-gradient(0deg, rgba(12,101,235,1) 0%, rgba(28,158,247,1) 100%)"
          >
            <Image
              src="/LID_logo_pure_white.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.bg" display="inline-block">
              Your LID Wallet
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold">
              {shortEther(accountLid)}
            </Text>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="lid.fg"
            borderRadius="5px"
            p="25px"
            bg="lid.bg"
          >
            <Image
              src="/Depositor.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.fgMed" display="inline-block">
              Total LID Stakers
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold" color="lid.brand">
              {totalStakers}
            </Text>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="lid.fg"
            borderRadius="5px"
            p="25px"
            bg="lid.bg"
          >
            <Image
              src="/logo-200.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.fgMed" display="inline-block">
              Total Staked LID
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold" color="lid.brand">
              {shortEther(totalStaked)}
            </Text>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="lid.fg"
            borderRadius="5px"
            p="25px"
            bg="lid.bg"
          >
            <Image
              src="/logo-200.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.fgMed" display="inline-block">
              Total Lid
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold" color="lid.brand">
              {shortEther(totalLid)}
            </Text>
          </Box>
          <Box
            w="100%"
            border="solid 1px"
            borderColor="lid.stroke"
            color="lid.fg"
            borderRadius="5px"
            p="25px"
            bg="lid.bg"
          >
            <Image
              src="/logo-200.png"
              alt="Lid Website"
              w="auto"
              h="25px"
              display="inline-block"
              position="relative"
              top="-3px"
            />
            <Text ml="10px" mt="5px" color="lid.fgMed" display="inline-block">
              7 Days Average Staking APY
            </Text>
            <Text fontSize="38px" w="100%" fontWeight="bold" color="lid.brand">
              {percentageFormat(averageApy)}
            </Text>
            <Box
              color="lid.brand"
              mt="5px"
              display="block"
              cursor="pointer"
              onClick={onClickAnalytics}
            >
              Staking Analytics
            </Box>
          </Box>
        </Grid>
      </Flex>
    </Box>
  );
};

export default SubHeading;
