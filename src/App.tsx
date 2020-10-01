import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Web3Wrapper from 'containers/Web3Wrapper';
import MainApp from './pages/MainApp';

export default () => {
  return (
    <>
      <Web3Wrapper>
        {(address, web3, onConnect) => (
          <Switch>
            <Route
              component={() => (
                <MainApp address={address} web3={web3} onConnect={onConnect} />
              )}
              path="/"
              exact
            />
          </Switch>
        )}
      </Web3Wrapper>
    </>
  );
};
