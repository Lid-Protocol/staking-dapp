import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { HttpProvider, IpcProvider, WebsocketProvider } from 'web3-core';
import { getRandomInfuraId, web3Modal } from 'utils';

type Web3Provider = HttpProvider | IpcProvider | WebsocketProvider;

export interface ConnectedWeb3ContextProps {
  address: string;
  web3: Web3 | null;
  onConnect: () => void;
}

const ConnectedWeb3Context = React.createContext<ConnectedWeb3ContextProps | null>(
  null
);

export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context);

  if (!context) {
    throw new Error('Component rendered outside the provider tree');
  }

  return context;
};

const Web3Wrapper: React.FC = ({ children }) => {
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState<Web3Provider | null>(
    new Web3.providers.HttpProvider(
      `https://mainnet.infura.io/v3/${getRandomInfuraId()}`
    )
  );
  const [web3, setWeb3] = useState<Web3 | null>(new Web3(provider as any));

  const onConnect = async () => {
    const provider = await web3Modal.connect();
    const web3 = await new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    setAddress(accounts[0]);
    setProvider(provider);
    setWeb3(web3);

    // Subscribe to accounts change
    provider.on('accountsChanged', (accounts: string[]) => {
      setAddress(accounts[0]);
    });

    // Subscribe to provider disconnection
    provider.on('disconnect', (error: { code: number; message: string }) => {
      console.log(error);
      setAddress('');
      const infuraProvider = new Web3.providers.HttpProvider(
        `https://mainnet.infura.io/v3/${getRandomInfuraId()}`
      );
      setProvider(infuraProvider);
      setWeb3(new Web3(infuraProvider));
    });

    // TODO: handle the network change, should only allow only mainnet
    // // Subscribe to chainId change
    // provider.on('chainChanged', (chainId: number) => {
    //   console.log(chainId);
    // });

    // // Subscribe to provider connection
    // provider.on('connect', (info: { chainId: number }) => {
    //   console.log(info);
    // });
  };

  useEffect(() => {
    if (window.web3) onConnect();
  }, []);

  const value = {
    address: address,
    web3: web3,
    onConnect
  };

  return (
    <ConnectedWeb3Context.Provider value={value}>
      {children}
    </ConnectedWeb3Context.Provider>
  );
};

export default Web3Wrapper;
