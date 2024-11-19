import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> =
	fetchBaseQuery({
		baseUrl: import.meta.env.PUBLIC_API_BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const { accessToken } = (getState() as RootState).session;

			if (accessToken) {
				headers.set('Authorization', `Bearer ${accessToken}`);
			}

			return headers;
		},
	});
