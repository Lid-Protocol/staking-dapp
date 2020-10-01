import React, { useState, useEffect } from 'react';
import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/core';

import Web3 from 'web3';
// @ts-ignore
import { createWatcher } from '@makerdao/multicall';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

import Header from 'components/Header';
import SubHeading from 'components/SubHeading';
import Unstake from 'components/Unstake';
import Stake from 'components/Stake';
import Dividends from 'components/Dividends';
import ReferralCode from 'components/ReferralCode';
import Footer from 'components/Footer';

import abis from 'contracts/abis';
import { addresses } from 'config';
import { toBN, toWei } from 'utils';

const defaultWatcher = createWatcher([], {});
const walletWatcher = createWatcher([], {});

interface IMainApp {
  address: string;
  web3: Web3 | null;
  onConnect: () => void;
}

const MainApp: React.FC<IMainApp> = ({ address, web3, onConnect }) => {
  const [lidStakingSC, setLidStakingSC] = useState<Contract | null>(null);

  const [state, setState] = useState({
    totalLid: '0',
    totalStaked: '0',
    totalStakers: '0',
    isRegistered: false,
    accountLid: '0',
    referralCount: '0',
    accountLidStaked: '0',
    accountDividends: '0'
  });
  const {
    totalLid,
    totalStaked,
    totalStakers,
    isRegistered,
    accountLid,
    referralCount,
    accountLidStaked,
    accountDividends
  } = state;

  const referralEarnings = toBN(referralCount)
    .mul(toBN(toWei('200')))
    .toString();

  let referralAddress = window.location.hash.substr(2);
  if (!referralAddress || referralAddress.length !== 42)
    referralAddress = '0x0000000000000000000000000000000000000000';
  const multiCallConfig = {
    web3,
    multicallAddress: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    interval: 10000
  };

  useEffect(() => {
    if (!web3) return;

    const lidStakingSC = new web3.eth.Contract(
      abis.lidStaking as AbiItem[],
      addresses.lidStaking
    );

    setLidStakingSC(lidStakingSC);

    defaultWatcher.stop();

    defaultWatcher.recreate(
      [
        {
          target: addresses.lidToken,
          call: ['totalSupply()(uint256)'],
          returns: [['totalLid']]
        },
        {
          target: addresses.lidStaking,
          call: ['totalStaked()(uint256)'],
          returns: [['totalStaked']]
        },
        {
          target: addresses.lidStaking,
          call: ['totalStakers()(uint256)'],
          returns: [['totalStakers']]
        }
      ],
      multiCallConfig
    );

    defaultWatcher.subscribe((update: any) => {
      setState((prevState) => ({
        ...prevState,
        [update.type]: update.value.toString()
      }));
    });

    defaultWatcher.start();
  }, [web3]);

  useEffect(() => {
    if (!web3 || !address) {
      return;
    }

    walletWatcher.stop();

    walletWatcher.recreate(
      [
        {
          target: addresses.lidStaking,
          call: ['stakerIsRegistered(address)(bool)', address],
          returns: [['isRegistered']]
        },
        {
          target: addresses.lidToken,
          call: ['balanceOf(address)(uint256)', address],
          returns: [['accountLid']]
        },
        {
          target: addresses.lidStaking,
          call: ['accountReferrals(address)(uint256)', address],
          returns: [['referralCount']]
        },
        {
          target: addresses.lidStaking,
          call: ['stakeValue(address)(uint256)', address],
          returns: [['accountLidStaked']]
        },
        {
          target: addresses.lidStaking,
          call: ['dividendsOf(address)(uint256)', address],
          returns: [['accountDividends']]
        }
      ],
      multiCallConfig
    );

    walletWatcher.subscribe((update: any) => {
      const { type, value } = update;
      setState((prevState) => ({
        ...prevState,
        [update.type]: type === 'isRegistered' ? value : value.toString()
      }));
    });

    walletWatcher.start();
  }, [web3, address]);

  return (
    <>
      <Header address={address} onConnect={onConnect} />
      <SubHeading
        web3={web3}
        address={address}
        totalLid={totalLid}
        accountLidStaked={accountLidStaked}
        totalStakers={totalStakers}
        totalStaked={totalStaked}
        accountLid={accountLid}
      />
      <Box
        maxW="1200px"
        textAlign="center"
        mx="auto"
        pt="20px"
        px={['20px', '20px', '0px']}
      >
        <Tabs
          isFitted
          bg="#F3F5F9"
          p="20px"
          border="solid 1px"
          borderColor="lid.stroke"
          borderRadius="5px"
        >
          <TabList
            color="#ACB2BB"
            fontSize="24px"
            borderBottom="solid 2px"
            borderColor="lid.stroke"
            pb="20px"
          >
            <Tab _selected={{ color: 'lid.brand', border: 'none' }}>Stake</Tab>
            <Tab _selected={{ color: 'lid.brand', border: 'none' }}>
              Unstake
            </Tab>
            <Tab _selected={{ color: 'lid.brand', border: 'none' }}>
              Rewards
            </Tab>
          </TabList>
          <TabPanels textAlign="center">
            <TabPanel>
              <Stake
                web3={web3}
                address={address}
                accountLid={accountLid}
                isRegistered={isRegistered}
                lidStakingSC={lidStakingSC}
              />
            </TabPanel>
            <TabPanel>
              <Unstake
                web3={web3}
                address={address}
                accountLidStaked={accountLidStaked}
                lidStakingSC={lidStakingSC}
              />
            </TabPanel>
            <TabPanel>
              <Dividends
                web3={web3}
                address={address}
                accountDividends={accountDividends}
                lidStakingSC={lidStakingSC}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <ReferralCode
        address={address}
        earnedReferrals={referralEarnings}
        referralCount={referralCount}
      />
      <Footer />
    </>
  );
};

export default MainApp;
