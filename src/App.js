import React, { useState, useEffect } from "react";
import { createWatcher } from "@makerdao/multicall";
import addresses from "./contracts/addresses";
import abis from "./contracts/abis";
import { ThemeProvider, CSSReset, Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/core"
import theme from "./theme"
import "./App.css";

import Web3 from "web3";
import Web3Modal from "web3modal";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
import UniLogin from "@unilogin/provider";
import Portis from "@portis/web3";
import Squarelink from "squarelink";
import MewConnect from "@myetherwallet/mewconnect-web-client";

import Header from "./components/Header"
import Subheading from "./components/Subheading"
import StartTimer from "./components/StartTimer"
import ReferralCode from "./components/ReferralCode"
import Footer from "./components/Footer"
import Stake from "./components/Stake"
import Unstake from "./components/Unstake"
import Dividends from "./components/Dividends"

const INFURA_IDS = [
  "ddb5c708e4a7489abc4e403c97ef30fd", 
  "152fa2c73dc942fe9e854217e4e72cf9",
  "76bc1d064b684a0584cd0de79e477829"
]

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "5cacf72720454a679468551381b8cab9" // required
    }
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: "pk_live_B853BB3433E80B5B" // required
    }
  },
  torus: {
    package: Torus, // required
  },
  authereum: {
    package: Authereum // required
  },
  unilogin: {
    package: UniLogin // required
  },
  portis: {
    package: Portis, // required
    options: {
      id: "9b1635c2-43f4-4cbe-b8b6-73bf219d6a77" // required
    }
  },
  squarelink: {
    package: Squarelink, // required
    options: {
      id: "48ff2cdfaf26656bbd86" // required
    }
  },
  mewconnect: {
    package: MewConnect, // required
    options: {
      infuraId: "da5c8ad2181c405c8dc7bdaf8766edfa" // required
    }
  }
}

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});

const defaultWatcher = createWatcher([], {});
const walletWatcher = createWatcher([], {});

function App() {

  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'+INFURA_IDS[Math.floor(Math.random() * 100 % 3)]))
  const [web3, setWeb3] = useState(new Web3(provider))
  const [connected, setConnected] = useState(false)

  const [startTime, setStartTime] = useState(Date.UTC(2020,7,2,3,0,0,0))
  const [isActive, setIsActive] = useState(false)

  const [lidStakingSC, setLidStakingSC] = useState(null)
  const [lidTokenSC, setLidTokenSC] = useState(null)

  const [state, setState] = useState({
    totalLid: "0",
    totalStaked: "0",
    totalStakers: "0",
    isRegistered: false,
    accountLid: "0",
    referralCount: "0",
    accountLidStaked: "0",
    accountDividends: "0",
  });
  const {
    totalLid,
    totalStaked,
    totalStakers,
    isRegistered,
    accountLid,
    referralCount,
    accountLidStaked,
    accountDividends,
  } = state;
  

  const [stakeVal, setStakeVal] = useState("")
  const [unstakeVal, setUnstakeVal] = useState("")

  const toBN = web3.utils.toBN
  const toWei = web3.utils.toWei
  const fromWei = web3.utils.fromWei

  const referralEarnings = toBN(referralCount).mul(toBN(toWei("200")));

  let referralAddress = window.location.hash.substr(2);
  if(!referralAddress || referralAddress.length !== 42 ) referralAddress = "0x0000000000000000000000000000000000000000"

  const multiCallConfig = {
    web3,
    multicallAddress: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    interval: 5000,
  }

  useEffect(()=>{
    if(!web3) return

    const lidStakingSC = new web3.eth.Contract(abis.lidStaking, addresses.lidStaking)
    const lidTokenSC = new web3.eth.Contract(abis.lidToken, addresses.lidToken)
    
    setLidStakingSC(lidStakingSC)
    setLidTokenSC(lidTokenSC)

    defaultWatcher.recreate(
      [
        {
          target: addresses.lidToken,
          call: ["totalSupply()(uint256)"],
          returns: [["totalLid"]],
        },
        {
          target: addresses.lidStaking,
          call: ["totalStaked()(uint256)"],
          returns: [["totalStaked"]],
        },
        {
          target: addresses.lidStaking,
          call: ["totalStakers()(uint256)"],
          returns: [["totalStakers"]],
        },
      ],
      multiCallConfig
    );

    defaultWatcher.subscribe((update) => {
      setState((prevState) => ({
        ...prevState,
        [update.type]: update.value.toString(),
      }));
    });

    defaultWatcher.start();

  }, [web3])

  useEffect(() => {
    if (!web3 || !address) {
      return;
    }

    walletWatcher.recreate(
      [
        {
          target: addresses.lidStaking,
          call: ["stakerIsRegistered(address)(bool)", address],
          returns: [["isRegistered"]],
        },
        {
          target: addresses.lidToken,
          call: ["balanceOf(address)(uint256)", address],
          returns: [["accountLid"]],
        },
        {
          target: addresses.lidStaking,
          call: ["accountReferrals(address)(uint256)", address],
          returns: [["referralCount"]],
        },
        {
          target: addresses.lidStaking,
          call: ["stakeValue(address)(uint256)", address],
          returns: [["accountLidStaked"]],
        },
        {
          target: addresses.lidStaking,
          call: ["dividendsOf(address)(uint256)", address],
          returns: [["accountDividends"]],
        },
      ],
      multiCallConfig
    );

    walletWatcher.subscribe((update) => {
      setState((prevState) => ({
        ...prevState,
        [update.type]: update.value.toString(),
      }));
    });

    walletWatcher.start();

  }, [web3, address]);

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setAddress("")
    setWeb3(null)
    setProvider(null)
    setConnected(false)
  };

  //TODO: event subscriptions to auto update UI
  const subscribeProvider = async (provider,web3) => {
      if (!provider.on) {
        return
      }
      provider.on("close", () => resetApp(web3));
      provider.on("accountsChanged", async (accounts) => {
        setAddress(accounts[0])
      });
    };

  const onConnect = async () => {
    const provider = await web3Modal.connect()
    const web3 = await new Web3(provider)
    await subscribeProvider(provider,web3)
    const accounts = await web3.eth.getAccounts()
    const address = accounts[0]

    setConnected(true)
    setAddress(address)
    setProvider(provider)
    setWeb3(web3)
  }

  useEffect(()=>{
    if(window.web3) onConnect()
  },[])

  useEffect(()=>{
    if(Date.now() < startTime){
      let interval = setInterval(()=>{
        setIsActive(Date.now() > startTime)
      },500)
      return (interval)=>clearInterval(interval)
    }
  },[startTime])

  return (
    <ThemeProvider theme={theme} >
      <CSSReset />
      <Header web3={web3} address={address} onConnect={onConnect}  />
      <Subheading web3={web3} address={address} totalLid={totalLid} accountLidStaked={accountLidStaked}
        totalStakers={totalStakers} totalStaked={totalStaked} accountLid={accountLid} />
        <Box maxW="1200px" align="center" ml="auto" mr="auto"
            pt="20px" pl={{base:"20px", lg:"0px"}} pr={{base:"20px", lg:"0px"}}>
          <Tabs isFitted bg="#F3F5F9" p="20px" borderColor="lid.stroke" border="solid 1px" borderRadius="5px" >
            <TabList variant="unstyled" color="#ACB2BB" fontSize="24px" borderBottom="solid 2px" borderColor="lid.stroke" pb="20px" >
              <Tab _selected={{color:"lid.brand", border:"none"}}>Stake</Tab>
              <Tab  _selected={{color:"lid.brand", border:"none"}}>Unstake</Tab>
              <Tab  _selected={{color:"lid.brand", border:"none"}}>Rewards</Tab>
            </TabList>
            <TabPanels textAlign="center">
              <TabPanel>
                <Stake web3={web3} address={address} accountLid={accountLid} isRegistered={isRegistered} lidStakingSC={lidStakingSC} />
              </TabPanel>
              <TabPanel>
                <Unstake web3={web3} address={address} accountLidStaked={accountLidStaked} lidStakingSC={lidStakingSC} />
              </TabPanel>
              <TabPanel>
                <Dividends web3={web3} address={address} accountDividends={accountDividends} lidStakingSC={lidStakingSC} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <ReferralCode web3={web3} address={address} earnedReferrals={referralEarnings} referralCount={referralCount} />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
