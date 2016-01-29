import 'babel-polyfill';

import React from 'react';
import { createElement as r } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import App from './containers/AppContainer';
import reducer from './reducers';


const middleware = [ thunk, logger() ];
const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducer);


render(
  r(Provider, { store }, r(App)),
  document.getElementById('root')
);
