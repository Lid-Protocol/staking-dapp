import React, { FC, ReactNode } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  // uri: process.env.REACT_APP_SUBGRAPH_ENDPOINT,
  uri:
    'https://api.thegraph.com/subgraphs/name/liaojikunwork/lid-staking-mainnet',
  cache: new InMemoryCache()
});

interface IProps {
  children: ReactNode;
}

const ApolloWrapper: FC<IProps> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloWrapper;
