import { combineReducers } from "@reduxjs/toolkit";
import { searchApi } from "@/entities/appearance-search";
import { monitoringApi } from "@/entities/monitoring";
import { sessionSlice } from "@/entities/session";
import { baseApi } from "@/shared/api/baseApi";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [monitoringApi.reducerPath]: monitoringApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
});
