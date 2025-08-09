import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { sessionSlice } from "@/entities/session";
import { logoutMiddleware } from "@/features/session/logout";
import { baseApi } from "@/shared/api/baseApi";
import { rootReducer } from "./rootReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [sessionSlice.name],
};

export function makeStore() {
  const store = configureStore({
    reducer: persistReducer(
      persistConfig,
      rootReducer,
    ) as unknown as typeof rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware, logoutMiddleware.middleware),
  });

  setupListeners(store.dispatch);

  return store;
}

export const appStore = makeStore();
export const persistedStore = persistStore(appStore);

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
