import React, {useEffect, useState} from 'react';
import { Text, Box, Button,NumberInput, NumberInputField } from "@chakra-ui/core"

export default function Unstake({web3, address, lidStakingSC, accountLidStaked}) {
  const toBN = web3.utils.toBN
  const toWei = web3.utils.toWei
  const fromWei = web3.utils.fromWei

  const [displayVal, setDisplayVal] = useState("")

  const handleUnstake = async ()=>{
    const requestBN = toBN(toWei(displayVal))
    if(!web3 || !address || !lidStakingSC) {
      alert("You are not connected. Connect and try again.")
      return
    }
    if(requestBN.lt(toBN("1"))){
      alert("Must unstake at least 1 LID.")
      return
    }
    if(requestBN.gt(toBN(accountLidStaked))){
      alert("Cannot unstake more LID than you have staked.")
      return
    }
    await lidStakingSC.methods.unstake(requestBN.toString()).send({from:address})
    alert("Unstake request sent. Check your wallet to see when it has completed, then refresh this page.")
  }

  return (
    <Box w="100%" pt="20px" position="relative" textAlign="center">
      <Text fontSize="36px">Unstake LID</Text>
      <Text color="lid.info" mt="10px" mb="0px">
        2% fee to unstake.<br/>
        Fee is paid as dividends to stakers.
      </Text>
      <NumberInput display="block" w="500px" maxW="100%" m="30px" ml="auto" mr="auto"
        value={displayVal}
        step="any"
        min={1}
        max={fromWei(accountLidStaked)}
      >
        <NumberInputField type="number" placeholder="Amount of LID to Unstake" h="60px" borderRadius="30px" pl="30px"
          borderColor="lid.stroke"
          focusBorderColor="blue.500"
          errorBorderColor="red.500"
          onChange={e => {
            console.log(e.target)
              e.target.setAttribute("pattern","[0-9\.]*")
              if(isNaN(e.target.value)) return
              if(e.target.value === "") {
                setDisplayVal("")
              } else if(Number(e.target.value) > 140000000) {
                setDisplayVal("140000000")
              } else if(Number(e.target.value) < 0) {
                setDisplayVal("0")
              } else{
                setDisplayVal(e.target.value)
              }
            }} />
      </NumberInput>
      <Button display="block" color="lid.bg" bg="lid.brand" h="60px" w="500px" maxW="100%" m="30px" borderRadius="30px" ml="auto" mr="auto"
        fontWeight="regular"
        onClick={handleUnstake}
      >
        Unstake
        </Button>
      <Button display="block" color="lid.bg" bg="lid.buttonBgDk" h="60px" w="500px" maxW="100%" m="30px" borderRadius="30px" ml="auto" mr="auto"
        fontWeight="regular"
        onClick={()=>setDisplayVal(fromWei(accountLidStaked))}
      >
        Max
      </Button>
    </Box>
  );
}
