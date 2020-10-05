import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Web3Provider from 'containers/Web3Provider';
import MainApp from './pages/MainApp';
import Analytics from './pages/Analytics';

export default () => {
  return (
    <>
      <Web3Provider>
        {(address, web3, onConnect) => (
          <Switch>
            <Route
              component={() => (
                <MainApp address={address} web3={web3} onConnect={onConnect} />
              )}
              path="/"
              exact
            />
            <Route
              component={() => (
                <Analytics address={address} onConnect={onConnect} />
              )}
              path="/analytics"
              exact
            />
          </Switch>
        )}
      </Web3Provider>
    </>
  );
};
