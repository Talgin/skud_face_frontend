import { baseApi, CAMERA_TAG } from "@/shared/api";
import { mapCamera } from "../lib/mapCamera";
import type { Camera } from "../model/types";
import type {
  CameraDto,
  CreateRequestCameraBody,
  UpdateRequestCameraBody,
} from "./types";

export const basePath = "/camera";

export const cameraApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    cameras: build.query<Camera[], void>({
      query: () => ({ url: basePath }),
      transformResponse: (response: CameraDto[]) => response.map(mapCamera),
      providesTags: [CAMERA_TAG],
    }),
    camera: build.query<Camera, number>({
      query: (id) => ({ url: `${basePath}/${id}` }),
      transformResponse: (response: CameraDto) => mapCamera(response),
      providesTags: [CAMERA_TAG],
    }),
    createCamera: build.mutation<Camera, CreateRequestCameraBody>({
      query: (camera) => ({
        url: basePath,
        method: "POST",
        body: camera,
      }),
      invalidatesTags: [CAMERA_TAG],
    }),
    updateCamera: build.mutation<Camera, UpdateRequestCameraBody>({
      query: ({ id, newCamera }) => ({
        url: `${basePath}/${id}/update`,
        method: "PATCH",
        body: newCamera,
      }),
      invalidatesTags: [CAMERA_TAG],
    }),
    deleteCamera: build.mutation<void, number>({
      query: (id: number) => ({
        url: `${basePath}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [CAMERA_TAG],
    }),
    activateCamera: build.mutation<void, number>({
      query: (id: number) => ({
        url: `${basePath}/${id}/activate`,
        method: "PUT",
      }),
      invalidatesTags: [CAMERA_TAG],
    }),
    deactivateCamera: build.mutation<void, number>({
      query: (id: number) => ({
        url: `${basePath}/${id}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: [CAMERA_TAG],
    }),
  }),
});

export const {
  useCamerasQuery,
  useCameraQuery,
  useCreateCameraMutation,
  useUpdateCameraMutation,
  useDeleteCameraMutation,
  useActivateCameraMutation,
  useDeactivateCameraMutation,
} = cameraApi;
