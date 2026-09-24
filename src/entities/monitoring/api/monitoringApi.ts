import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetHistoryParams,
  HistoryResponse,
  MonitoringEventRaw,
  UniqueCountParams,
  UniqueCountResponse,
} from "../types";
import {
  historyRecordToEvent,
  mergeEvents,
  openLiveStream,
} from "../lib/liveEvents";
import { isReviewed } from "../lib/formatReview";
import { setLiveStatus } from "../lib/liveStatus";
import { parseMonitoringEvent } from "../utils";

// events already saved are shown right away; live ones are added on top
const RECENT_EVENTS_ON_OPEN = 50;

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
      async queryFn(_arg, _api, _extra, fetchWithBaseQuery) {
        const result = await fetchWithBaseQuery({
          url: "api/monitoring/history/",
          params: { page: 1, page_size: RECENT_EVENTS_ON_OPEN },
        });
        if (result.error) {
          // still open the live stream even if history is unavailable
          return { data: [] as MonitoringEventRaw[] };
        }
        const records = (result.data as HistoryResponse).records ?? [];
        // already confirmed/rejected events are not shown again
        return {
          data: records
            .filter((record) => !isReviewed(record))
            .map(historyRecordToEvent),
        };
      },
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(
        _arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;
        } catch {
          return;
        }
        const close = openLiveStream({
          url: "/api/events/events",
          eventName: "new_message",
          onStatus: setLiveStatus,
          onMessage: (data) => {
            try {
              const parsed = parseMonitoringEvent(data);
              if (!parsed) return;
              updateCachedData((draft) => mergeEvents(draft, [parsed]));
            } catch (e) {
              console.error("Failed to parse SSE event", e);
            }
          },
        });
        await cacheEntryRemoved;
        close();
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
      { eventId: string; isApproved: boolean; reviewedBy?: string | null }
    >({
      query: ({ eventId, isApproved, reviewedBy }) => ({
        url: `api/monitoring/history/${eventId}`,
        method: "PATCH",
        body: {
          is_approved: isApproved,
          reviewed_by: reviewedBy ?? null,
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
