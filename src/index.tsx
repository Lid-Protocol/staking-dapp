import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';

import * as serviceWorker from './serviceWorker';
import 'assets/styles/global.css';
import ThemeProvider from 'containers/ThemeProvider';
import ApolloProvider from 'containers/ApolloProvider';
import Web3Provider from 'containers/Web3Provider';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider>
      <ThemeProvider>
        <Web3Provider>
          <HashRouter>
            <App />
          </HashRouter>
        </Web3Provider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
