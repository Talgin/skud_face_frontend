import { baseApi, EMPLOYEE_TAG } from '@/shared/api';
import type { Admin } from '../model/types';
import type { AdminDto, CreateAdminRequestBody, UpdateAdminRequestBody } from './types';
import { mapAdmin } from '../lib/mapAdmin';

export const basePath = '/employee';

export const adminApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		admins: build.query<Admin[], void>({
			query: () => ({ url: basePath }),
			transformResponse: (response: AdminDto[]) => response.map(mapAdmin),
			providesTags: [EMPLOYEE_TAG],
		}),
		admin: build.query<Admin, number>({
			query: (id) => ({ url: `${basePath}/${id}` }),
			transformResponse: (response: AdminDto) => mapAdmin(response),
			providesTags: [EMPLOYEE_TAG],
		}),
		createAdmin: build.mutation<Admin, CreateAdminRequestBody>({
			query: (admin) => ({
				url: basePath,
				method: 'POST',
				body: admin,
			}),
			invalidatesTags: [EMPLOYEE_TAG],
		}),
		updateAdmin: build.mutation<Admin, UpdateAdminRequestBody>({
			query: ({ id, newAdmin }) => ({
				url: `${basePath}/${id}/update`,
				method: 'PATCH',
				body: newAdmin,
			}),
			invalidatesTags: [EMPLOYEE_TAG],
		}),
		deleteAdmin: build.mutation<void, number>({
			query: (id: number) => ({
				url: `${basePath}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [EMPLOYEE_TAG],
		}),
	}),
});

export const { useAdminsQuery, useAdminQuery, useCreateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } =
	adminApi;
