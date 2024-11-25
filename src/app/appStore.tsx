import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import { baseApi } from '@/shared/api/baseApi';
import { rootReducer } from './rootReducer';

export function makeStore() {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				},
			}).concat(baseApi.middleware),
	});

	setupListeners(store.dispatch);

	return store;
}

export const appStore = makeStore();

export type RootState = ReturnType<typeof makeStore>;
export type AppDispatch = typeof appStore.dispatch;
