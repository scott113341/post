import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import makeRootReducer from "./reducers";

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk];

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(applyMiddleware(...middleware)),
  );
  store.asyncReducers = {};

  return store;
};
