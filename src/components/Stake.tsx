import React, { useEffect, useState } from 'react';
import {
  Text,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/core';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

import { toBN, toWei, fromWei } from 'utils';

interface IStakeProps {
  web3: Web3 | null;
  address: string;
  lidStakingSC: Contract | null;
  accountLid: string;
  isRegistered: boolean;
}

const Stake: React.FC<IStakeProps> = ({
  web3,
  address,
  lidStakingSC,
  accountLid,
  isRegistered
}) => {
  const [referralAddress, setReferralAddress] = useState(
    window.location.hash.substr(2)
  );
  useEffect(() => {
    if (!referralAddress || referralAddress.length !== 42)
      setReferralAddress('0x0000000000000000000000000000000000000000');
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [displayVal, setDisplayVal] = useState('');

  const handleStake = async () => {
    const requestBN = toBN(toWei(displayVal || '0'));
    if (!web3 || !address || !lidStakingSC) {
      alert('You are not connected. Connect and try again.');
      return;
    }
    const min = isRegistered
      ? 1
      : referralAddress !== '0x0000000000000000000000000000000000000000'
      ? 201
      : 401;
    if (requestBN.lt(toBN(toWei(min.toString())))) {
      alert(
        'Must send at least ' + min.toString() + ' LID to stake and register.'
      );
      return;
    }
    if (requestBN.gt(toBN(accountLid))) {
      alert('Cannot stake more LID than is in your account.');
      return;
    }
    if (isRegistered) {
      await lidStakingSC.methods
        .stake(requestBN.toString())
        .send({ from: address });
    } else {
      await lidStakingSC.methods
        .registerAndStake(requestBN.toString(), referralAddress)
        .send({ from: address });
    }
    alert(
      'Stake request sent. Check your wallet to see when it has completed, then refresh this page.'
    );
  };

  return (
    <Box w="100%" pt="20px" position="relative" textAlign="center">
      <Text fontSize="36px">Stake LID</Text>
      <Text color="lid.info" mt="10px" mb="0px">
        Initial fee for staking registration is 400 LID.
        <br />
        With a referral code, intitial fee is 200 LID.
      </Text>
      <Text color="#55595D" m="20px">
        Your registration fee will be
        <Text as="span" color="lid.fg">
          {isRegistered
            ? ' 0 '
            : referralAddress !== '0x0000000000000000000000000000000000000000'
            ? ' 200 '
            : ' 400 '}
          LID
        </Text>
        .
      </Text>
      <Input
        display="block"
        w="500px"
        maxW="100%"
        h="60px"
        m="30px"
        ml="auto"
        mr="auto"
        pl="30px"
        type="number"
        placeholder="Amount of LID to Stake"
        borderRadius="30px"
        pattern="[0-9\.]*"
        focusBorderColor="blue.500"
        errorBorderColor="red.500"
        isInvalid={
          !!displayVal &&
          (Number(displayVal) < 1 ||
            Number(displayVal) > Number(fromWei(accountLid)))
        }
        value={displayVal}
        onChange={(e: any) => {
          const tempVal = e.target.value.replace(/[^\d.]/g, '');
          if (tempVal === '') {
            setDisplayVal('');
          } else if (Number(tempVal) > 140000000) {
            setDisplayVal('140000000');
          } else if (Number(tempVal) < 0) {
            setDisplayVal('0');
          } else {
            setDisplayVal(tempVal);
          }
        }}
      />

      <Button
        display="block"
        color="lid.bg"
        bg="lid.brand"
        h="60px"
        w="500px"
        maxW="100%"
        m="30px"
        borderRadius="30px"
        ml="auto"
        mr="auto"
        fontWeight="regular"
        onClick={handleStake}
      >
        Stake
      </Button>
      <Button
        display="block"
        color="lid.bg"
        bg="lid.buttonBgDk"
        h="60px"
        w="500px"
        maxW="100%"
        m="30px"
        borderRadius="30px"
        ml="auto"
        mr="auto"
        fontWeight="regular"
        onClick={() => setDisplayVal(fromWei(accountLid))}
      >
        Max
      </Button>
      <Button onClick={onOpen}>Enter Referral Code</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay zIndex={100} />
        <ModalContent
          zIndex={101}
          p="20px"
          position="fixed"
          top="20px"
          left="50%"
          w="360px"
          ml="-180px"
        >
          <ModalHeader>Referral Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Enter a referral code.</Text>
            <Input
              type="text"
              onChange={(e: any) => {
                if (!e.target.value || e.target.value.length !== 42) {
                  setReferralAddress(
                    '0x0000000000000000000000000000000000000000'
                  );
                } else {
                  setReferralAddress(e.target.value);
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Text color="#55595D">
        Referral Code :{' '}
        {!referralAddress ||
        referralAddress === '0x0000000000000000000000000000000000000000'
          ? 'None'
          : referralAddress.substring(0, 6) + '...' + referralAddress.slice(-4)}
      </Text>
    </Box>
  );
};

export default Stake;
