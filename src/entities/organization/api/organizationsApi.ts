import { baseApi } from '@/shared/api';
import type { Organization } from '../model/types';
import type { OrganizationDto, RequestOrganizationBody } from './types';
import { mapOrganization } from '../lib/mapOrganization';

export const organizationsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		organizations: build.query<Organization[], void>({
			query: () => ({ url: '/organization' }),
			providesTags: [],
			transformResponse: (response: OrganizationDto[]) => response.map(mapOrganization),
		}),
		createOrganization: build.mutation<Organization, RequestOrganizationBody>({
			query: (organization) => ({
				url: '/organization',
				method: 'POST',
				body: organization,
			}),
		}),
	}),
});

export const { useOrganizationsQuery, useCreateOrganizationMutation } = organizationsApi;
