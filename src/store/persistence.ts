import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { ADDRESSES, LOB_API_KEY } from "../constants.ts";
import { setInLocalStorage } from "../util.ts";
import { addAddress, deleteAddress, setLobApiKey, type PostcardState } from "./postcard-slice.ts";

interface PersistedState {
  postcard: PostcardState;
}

/**
 * Mirrors the durable slices of state into localStorage. Keeping this out of
 * the reducers leaves them pure, and therefore testable without a DOM.
 */
export const persistenceMiddleware = createListenerMiddleware();

persistenceMiddleware.startListening({
  actionCreator: setLobApiKey,
  effect: (_action, api) => {
    const { postcard } = api.getState() as PersistedState;
    setInLocalStorage(LOB_API_KEY, postcard.lob.apiKey);
  },
});

persistenceMiddleware.startListening({
  matcher: isAnyOf(addAddress, deleteAddress),
  effect: (_action, api) => {
    const { postcard } = api.getState() as PersistedState;
    setInLocalStorage(ADDRESSES, postcard.address.addresses);
  },
});
