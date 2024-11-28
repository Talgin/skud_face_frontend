import { baseApi } from '@/shared/api/baseApi';
import { SESSION_TAG } from '@/shared/api/tags';
import type { Session } from '../model/types';
import type { RequestLoginBody, SessionDto } from './types';
import { mapSession } from '../lib/mapSession';

export const sessionApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<Session, RequestLoginBody>({
			query: (body) => ({
				url: '/auth/login',
				method: 'POST',
				body,
			}),
			invalidatesTags: [SESSION_TAG],
			transformResponse: (response: SessionDto) => mapSession(response),
		}),
	}),
});

export const { useLoginMutation } = sessionApi;
