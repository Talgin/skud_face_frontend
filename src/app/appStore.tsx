import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { baseApi } from '@/shared/api/baseApi';
import { logoutMiddleware } from '@/features/session/logout';
import { rootReducer } from './rootReducer';
import { sessionSlice } from '@/entities/session';

const persistConfig = {
	key: 'root',
	storage,
	whitelist: [sessionSlice.name],
};

export function makeStore() {
	const store = configureStore({
		reducer: persistReducer(persistConfig, rootReducer) as unknown as typeof rootReducer,
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

export type RootState = ReturnType<typeof makeStore>;
export type AppDispatch = typeof appStore.dispatch;
