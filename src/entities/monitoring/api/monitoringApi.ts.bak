import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetHistoryParams,
  HistoryResponse,
  MonitoringEventRaw,
  UniqueCountParams,
  UniqueCountResponse,
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
    getEvents: builder.query<MonitoringEventRaw[], void>({
      queryFn: () => ({ data: [] as MonitoringEventRaw[] }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        await cacheDataLoaded;
        const source = new EventSource("http://10.1.22.5:50002/events");
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
    getUniqueCount: builder.query<UniqueCountResponse, UniqueCountParams>({
      query: ({ start_date, end_date } = {}) => ({
        url: "api/monitoring/history/unique-count/",
        params: { start_date, end_date },
      }),
    }),
    approveEvent: builder.mutation<
      void,
      { eventId: string; isApproved: boolean }
    >({
      query: ({ eventId, isApproved }) => ({
        url: `api/monitoring/history/${eventId}`,
        method: "PATCH",
        body: {
          is_approved: isApproved,
        },
      }),
      async onQueryStarted(params, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            monitoringApi.util.updateQueryData(
              "getEvents",
              undefined,
              (draft) => {
                return draft.filter(
                  (event) => event.event_id !== params.eventId,
                );
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
  useGetUniqueCountQuery,
  useApproveEventMutation,
} = monitoringApi;
