import { baseApi, POINTS_TAG } from "@/shared/api";
import { mapPoint } from "../lib/mapPoint";
import type { Point } from "../model/types";
import type {
  CreatePointRequestBody,
  PointDto,
  UpdatePointRequestBody,
} from "./types";

const basePath = "/point";

export const pointsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    points: build.query<Point[], void>({
      query: () => ({ url: basePath }),
      transformResponse: (response: PointDto[]) => response.map(mapPoint),
      providesTags: [POINTS_TAG],
    }),
    point: build.query<Point, number>({
      query: (id) => ({ url: `${basePath}/${id}` }),
      transformResponse: (response: PointDto) => mapPoint(response),
      providesTags: [POINTS_TAG],
    }),
    createPoint: build.mutation<Point, CreatePointRequestBody>({
      query: (point) => ({
        url: basePath,
        method: "POST",
        body: point,
      }),
      invalidatesTags: [POINTS_TAG],
    }),
    updatePoint: build.mutation<
      Point,
      { id: number; newPoint: UpdatePointRequestBody }
    >({
      query: ({ id, newPoint }) => ({
        url: `${basePath}/${id}/update`,
        method: "PATCH",
        body: newPoint,
      }),
      invalidatesTags: [POINTS_TAG],
    }),
    deletePoint: build.mutation<void, number>({
      query: (id: number) => ({
        url: `${basePath}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [POINTS_TAG],
    }),
  }),
});

export const {
  usePointsQuery,
  usePointQuery,
  useCreatePointMutation,
  useUpdatePointMutation,
  useDeletePointMutation,
} = pointsApi;
