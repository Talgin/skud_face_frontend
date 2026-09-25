import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SEARCH_BASE } from "../lib/format";
import type {
  EvalEntry,
  EvalQuery,
  EvalReport,
  SearchCamera,
  SearchHealth,
  SearchRequestBody,
  SearchResponse,
  SearchSettings,
} from "../types";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${SEARCH_BASE}/` }),
  tagTypes: ["Settings", "Eval"],
  endpoints: (builder) => ({
    search: builder.mutation<SearchResponse, SearchRequestBody>({
      query: (body) => ({ url: "search", method: "POST", body }),
    }),
    getSearchCameras: builder.query<SearchCamera[], void>({
      query: () => "cameras",
      transformResponse: (r: { cameras: SearchCamera[] }) => r.cameras ?? [],
    }),
    getSearchSettings: builder.query<SearchSettings, void>({
      query: () => "settings",
      providesTags: ["Settings"],
    }),
    setPipelineModes: builder.mutation<unknown, string[]>({
      query: (pipeline_modes) => ({
        url: "settings",
        method: "PUT",
        body: { pipeline_modes },
      }),
      invalidatesTags: ["Settings"],
    }),
    getSearchHealth: builder.query<SearchHealth, void>({
      query: () => "health",
    }),
    getEvalQueries: builder.query<EvalQuery[], void>({
      query: () => "eval/queries",
      transformResponse: (r: { queries: EvalQuery[] }) => r.queries ?? [],
      providesTags: ["Eval"],
    }),
    getEvalLabels: builder.query<EvalEntry, string>({
      query: (query) => ({ url: "eval/labels", params: { query } }),
      providesTags: ["Eval"],
    }),
    setEvalLabel: builder.mutation<
      EvalEntry,
      { query: string; id: string; relevant: boolean | null; by: string }
    >({
      query: (body) => ({ url: "eval/label", method: "PUT", body }),
      invalidatesTags: ["Eval"],
    }),
    getEvalReport: builder.query<EvalReport, number>({
      query: (k) => ({ url: "eval/report", params: { k } }),
    }),
  }),
});

export const {
  useSearchMutation,
  useGetSearchCamerasQuery,
  useGetSearchSettingsQuery,
  useSetPipelineModesMutation,
  useGetSearchHealthQuery,
  useGetEvalQueriesQuery,
  useGetEvalLabelsQuery,
  useSetEvalLabelMutation,
  useLazyGetEvalReportQuery,
} = searchApi;
