import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { createStore, compose } from 'redux';
import reducers from './redux/reducers';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import type { GlobalStyleProps } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

const theme = extendTheme({
  styles: {
    global: (props: GlobalStyleProps) => ({
      body: {
        bg: '#486a5e',
        height: '100%',
        overflow: 'hidden',
      },
      Text: {
        color: '#202f2a',
      },
    }),
  },
  colors: {
    brand: {
      whiteish: {
        def: '#fff7f1',
        hover: '#DED0C5',
      },
      darkish: '#202f2a',
      darkish2: '#486a5e',
      darkish3: '#36443f',
      greenish: '#4b732f',
      blueish: '#f1f9ff',
    },
  },
});

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducers, composeEnhancers);

export type RootState = ReturnType<typeof store.getState>;

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH_DOMAIN}
      clientId={process.env.REACT_APP_AUTH_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
