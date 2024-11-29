import { baseApi, ORGANIZATION_TAG } from '@/shared/api';
import type { Organization } from '../model/types';
import type { OrganizationDto, CreateRequestOrganizationBody, UpdateRequestOrganizationBody } from './types';
import { mapOrganization } from '../lib/mapOrganization';

export const organizationsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		organizations: build.query<Organization[], void>({
			query: () => ({ url: '/organization' }),
			transformResponse: (response: OrganizationDto[]) => response.map(mapOrganization),
			providesTags: [ORGANIZATION_TAG],
		}),
		organization: build.query<Organization, number>({
			query: (id) => ({ url: `/organization/${id}` }),
			transformResponse: (response: OrganizationDto) => mapOrganization(response),
			providesTags: [ORGANIZATION_TAG],
		}),
		createOrganization: build.mutation<Organization, CreateRequestOrganizationBody>({
			query: (organization) => ({
				url: '/organization',
				method: 'POST',
				body: organization,
			}),
			invalidatesTags: [ORGANIZATION_TAG],
		}),
		updateOrganization: build.mutation<Organization, UpdateRequestOrganizationBody>({
			query: ({ id, newOrganization }) => ({
				url: `/organization/${id}/update`,
				method: 'PATCH',
				body: newOrganization,
			}),
			invalidatesTags: [ORGANIZATION_TAG],
		}),
		deleteOrganization: build.mutation<void, number>({
			query: (id: number) => ({
				url: `/organization/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [ORGANIZATION_TAG],
		}),
	}),
});

export const {
	useOrganizationsQuery,
	useOrganizationQuery,
	useCreateOrganizationMutation,
	useUpdateOrganizationMutation,
	useDeleteOrganizationMutation,
} = organizationsApi;
