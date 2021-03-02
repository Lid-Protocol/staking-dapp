import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MainApp from './pages/MainApp';
import Analytics from './pages/Analytics';

export default () => {
  return (
    <>
      <Switch>
        <Route component={Analytics} path="/analytics" exact />
        <Route component={MainApp} path="/" />
      </Switch>
    </>
  );
};
