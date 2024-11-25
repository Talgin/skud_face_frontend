import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/baseApi';
import { sessionSlice } from '@/entities/session';

export const rootReducer = combineReducers({
	[baseApi.reducerPath]: baseApi.reducer,
	[sessionSlice.name]: sessionSlice.reducer,
});
