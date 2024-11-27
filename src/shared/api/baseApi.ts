import { createApi } from '@reduxjs/toolkit/query/react';
import { ORGANIZATION_TAG, SESSION_TAG } from '@/shared/api/tags';
import { baseQueryWithReauth } from './baseQueryWithReauth';

export const baseApi = createApi({
	tagTypes: [SESSION_TAG, ORGANIZATION_TAG],
	reducerPath: 'api',
	baseQuery: baseQueryWithReauth,
	endpoints: () => ({}),
});
