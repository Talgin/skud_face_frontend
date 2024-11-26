import { createApi } from '@reduxjs/toolkit/query/react';
import { SESSION_TAG } from '@/shared/api/tags';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const baseApi = createApi({
	tagTypes: [SESSION_TAG],
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
