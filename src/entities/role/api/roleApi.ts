import { baseApi, ROLE_TAG } from '@/shared/api';
import { Roles } from '../model/types';

export const roleApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		role: build.query<Roles, void>({
			query: () => ({ url: '/role' }),
			providesTags: [ROLE_TAG],
		}),
	}),
});

export const { useRoleQuery } = roleApi;
