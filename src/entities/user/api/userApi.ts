import { baseApi, STUDENT_TAG } from '@/shared/api';
import { UserDto, UserQueryParams } from './types';
import type { User } from '../model/types';
import { mapUser } from '../lib/mapUser';

const basePath = '/student';

export const userApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		users: build.query<User[], void>({
			query: () => ({ url: basePath }),
			transformResponse: (response: UserDto[]) => response.map(mapUser),
			providesTags: [STUDENT_TAG],
		}),
		user: build.query<User, number>({
			query: (id) => ({ url: `${basePath}/${id}` }),
			transformResponse: (response: UserDto) => mapUser(response),
			providesTags: [STUDENT_TAG],
		}),
		createUser: build.mutation<User, { queryParams: UserQueryParams; body: FormData }>({
			query: ({ queryParams, body }) => ({
				url: basePath,
				method: 'POST',
				params: queryParams,
				body,
			}),
			invalidatesTags: [STUDENT_TAG],
		}),
		batchUsers: build.mutation<void, FormData>({
			query: (formData) => ({
				url: `${basePath}/add-batch`,
				method: 'POST',
				body: formData,
			}),
		}),
		updateUser: build.mutation<
			User,
			{
				id: number;
				newUser: { queryParams: UserQueryParams; body: FormData };
			}
		>({
			query: ({ id, newUser: { queryParams, body } }) => ({
				url: `${basePath}/${id}/update`,
				method: 'PATCH',
				params: queryParams,
				body,
			}),
			invalidatesTags: [STUDENT_TAG],
		}),
		deleteUser: build.mutation<void, number>({
			query: (id: number) => ({
				url: `${basePath}/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [STUDENT_TAG],
		}),
	}),
});

export const {
	useUsersQuery,
	useUserQuery,
	useCreateUserMutation,
	useBatchUsersMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;
