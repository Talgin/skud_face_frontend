import { baseApi, ROLE_TAG } from "@/shared/api";
import type { Roles } from "../model/types";

type RoleData = {
  role: Roles;
};

export const roleApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    role: build.query<RoleData, void>({
      query: () => ({ url: "/role" }),
      providesTags: [ROLE_TAG],
    }),
  }),
});

export const { useRoleQuery } = roleApi;
