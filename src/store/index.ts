import { configureStore } from "@reduxjs/toolkit";

import { persistenceMiddleware } from "./persistence.ts";
import postcardReducer from "./postcard-slice.ts";

export const store = configureStore({
  reducer: { postcard: postcardReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistenceMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
