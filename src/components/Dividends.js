import React, {useEffect, useState} from 'react';
import { Text, Box, Button,NumberInput, NumberInputField } from "@chakra-ui/core"
import {shortEther} from "../utils"

export default function Dividends({web3, address, lidStakingSC, accountDividends}) {
  const toBN = web3.utils.toBN
  const toWei = web3.utils.toWei
  const fromWei = web3.utils.fromWei

  const handleWithdraw = async ()=>{
    const requestBN = toBN(accountDividends)
    if(!web3 || !address || !lidStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(requestBN.lt(toBN("1"))){
      alert("Must have at least 1 LID in dividends.")
      return
    }
    await lidStakingSC.methods.withdraw(requestBN.toString()).send({from:address})
    alert("Unstake request sent. Check your wallet to see when it has completed, then refresh this page.")
  }

  const handleReinvest = async ()=>{
    const requestBN = toBN(accountDividends)
    if(!web3 || !address || !lidStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(requestBN.lt(toBN("1"))){
      alert("Must have at least 1 LID in dividends.")
      return
    }
    await lidStakingSC.methods.reinvest(requestBN.toString()).send({from:address})
    alert("Reinvest request sent. Check your wallet to see when it has completed, then refresh this page.")
  }

  return (
    <Box w="100%" pt="20px" position="relative" textAlign="center">
      <Text fontSize="36px">Rewards</Text>
      <Text color="lid.info" mt="10px" mb="0px">
        Free to withdraw or reinvest.
      </Text>
      <Text fontSize="36px" m="20px">{shortEther(accountDividends,web3)}</Text>
      <Button display="block" color="lid.bg" bg="lid.brand" h="60px" w="500px" maxW="100%" m="30px" borderRadius="30px" ml="auto" mr="auto"
        fontWeight="regular"
        onClick={handleWithdraw}
      >
        Withdraw
      </Button>
      <Button display="block" color="lid.bg" bg="lid.brand" h="60px" w="500px" maxW="100%" m="30px" borderRadius="30px" ml="auto" mr="auto"
        fontWeight="regular"
        onClick={handleReinvest}
      >
        Reinvest
      </Button>
    </Box>
  );
}
