import { combineReducers } from 'redux';
import locationReducer from './location';
import postcardReducer from './postcard.js';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    postcard: postcardReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
