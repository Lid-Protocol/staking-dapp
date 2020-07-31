import React, { useState, useEffect } from "react";
import addresses from "./contracts/addresses";
import abis from "./contracts/abis";
import { ThemeProvider, CSSReset, Box } from "@chakra-ui/core"
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
import CountDown from "./components/CountDown"

const INFURA_ID = "c0a5d6437d9e42d28f48961b1dfcefb8"

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "82ca85988839411784c7bc1da12925de" // required
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
      infuraId: "98751a7645d8470489b41cee014c25ec" // required
    }
  }
}

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});



function App() {

  const [address, setAddress] = useState("")
  const [provider, setProvider] = useState(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/'+INFURA_ID))
  const [web3, setWeb3] = useState(new Web3(provider))
  const [connected, setConnected] = useState(false)

  const [startTime, setStartTime] = useState(Date.UTC(2020,7,1,23,0,0,0))
  const [isActive, setIsActive] = useState(false)

  const [lidStakingSC, setLidStakingSC] = useState(null)
  const [lidTokenSC, setLidTokenSC] = useState(null)

  const [totalLid, setTotalLid] = useState("0")
  const [totalStaked, setTotalStaked] = useState("0")
  const [totalStakers, setTotalStakers] = useState("0")

  const [accountLid, setAccountLid] = useState("0")
  const [accountLidStaked, setAccountLidStaked] = useState("0")
  const [isRegistered, setIsRegistered] = useState(false)

  const [referralEarnings, setReferralEarnings] = useState("0")
  const [referralCount, setReferralCount] = useState("0")

  const [stakeVal, setStakeVal] = useState("")
  const [unstakeVal, setUnstakeVal] = useState("")

  const toBN = web3.utils.toBN
  const toWei = web3.utils.toWei
  const fromWei = web3.utils.fromWei

  let referralAddress = window.location.hash.substr(2);
  if(!referralAddress || referralAddress.length !== 42 ) referralAddress = "0x0000000000000000000000000000000000000000"

  useEffect(()=>{
    if(!web3) return
    if(!address) return

    const lidStakingSC = new web3.eth.Contract(abis.lidStaking, addresses.lidStaking)
    const lidTokenSC = new web3.eth.Contract(abis.lidToken, addresses.lidToken)
    if (!lidStakingSC) return
    if (!lidTokenSC) return

    setLidStakingSC(lidStakingSC)
    setLidTokenSC(lidTokenSC)

    //TODO: Switch to multicall.js
    let fetchData = async(web3,address,lidStakingSC,lidTokenSC)=>{
      const [
        totalLid,
        totalStaked,
        totalStakers,
        isRegistered,
        accountLid,
        referralCount,
        accountLidStaked
      ] = await Promise.all([
        lidTokenSC.methods.totalSupply().call(),
        lidStakingSC.methods.totalStaked().call(),
        lidStakingSC.methods.totalStakers().call(),
        lidStakingSC.methods.stakerIsRegistered(address).call(),
        lidTokenSC.methods.balanceOf(address).call(),
        lidStakingSC.methods.accountReferrals(address).call(),
        lidStakingSC.methods.stakeValue(address).call()
      ])

      setTotalLid(totalLid)
      setTotalStaked(totalStaked)
      setTotalStakers(totalStakers)
      setIsRegistered(isRegistered)
      setAccountLid(accountLid)
      setReferralCount(referralCount)
      setAccountLidStaked(accountLidStaked)
      setReferralEarnings(toBN(referralCount).mul(toBN(toWei("200"))))
    }

    fetchData(web3,address,lidStakingSC,lidTokenSC)

    let interval;
    if(window.web3){
      interval = setInterval((web3,address,lidStakingSC,lidTokenSC)=>{
        if(!web3 || !address || !lidStakingSC || !lidTokenSC) return
        fetchData(web3,address,lidStakingSC,lidTokenSC)
      },2000)
    } else {
      interval = setInterval((web3,address,lidStakingSC,lidTokenSC)=>{
        if(!web3 || !address || !lidStakingSC || !lidTokenSC) return
        fetchData(web3,address,lidStakingSC,lidTokenSC)
      },10000)
    }

    return ()=>clearInterval(interval)

  },[web3,address])

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
      {isActive && (<>
        <ReferralCode web3={web3} address={address} earnedReferrals={referralEarnings} referralCount={referralCount} />
      </>)}
      {!isActive && (<>
        <StartTimer expiryTimestamp={startTime} />
      </>)}
      <Footer />
    </ThemeProvider>
  );
}

export default App;
