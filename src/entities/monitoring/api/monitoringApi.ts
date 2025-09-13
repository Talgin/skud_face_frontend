import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetHistoryParams,
  HistoryResponse,
  MonitoringEvent,
} from "../types";
import { parseMonitoringEvent } from "../utils";

const baseQuery = fetchBaseQuery({
  baseUrl: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const monitoringApi = createApi({
  reducerPath: "monitoringApi",
  baseQuery,
  endpoints: (builder) => ({
    getEvents: builder.query<MonitoringEvent[], void>({
      queryFn: () => ({ data: [] as MonitoringEvent[] }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;
        const source = new EventSource("/api/events/events/");
        source.addEventListener("new_message", (event) => {
          try {
            const parsed = parseMonitoringEvent(event.data);
            if (!parsed) return;

            updateCachedData((draft) => {
              draft.unshift(parsed);
              if (draft.length > 1000) {
                draft.pop();
              }
            });
          } catch (e) {
            console.error("Failed to parse SSE event", e);
          }
        });
        source.onerror = (err) => {
          console.error("SSE error", err);
          source.close();
        };
        await cacheEntryRemoved;
        source.close();
      },
    }),
    getHistory: builder.query<HistoryResponse, GetHistoryParams>({
      query: (params) => ({
        url: "api/monitoring/history/",
        method: "GET",
        params,
      }),
    }),
    confirmEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/api/events/${eventId}/confirm`,
        method: "POST",
      }),
      async onQueryStarted(eventId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            monitoringApi.util.updateQueryData(
              "getEvents",
              undefined,
              (draft) => {
                return draft.filter((event) => event.id !== eventId);
              },
            ),
          );
        } catch {}
      },
    }),
    rejectEvent: builder.mutation<void, string>({
      query: (eventId) => ({
        url: `/api/events/${eventId}/reject`,
        method: "POST",
      }),
      async onQueryStarted(eventId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            monitoringApi.util.updateQueryData(
              "getEvents",
              undefined,
              (draft) => {
                return draft.filter((event) => event.id !== eventId);
              },
            ),
          );
        } catch {}
      },
    }),
  }),
});
export const {
  useGetEventsQuery,
  useGetHistoryQuery,
  useConfirmEventMutation,
  useRejectEventMutation,
} = monitoringApi;
