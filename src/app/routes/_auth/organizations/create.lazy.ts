import { createLazyFileRoute } from '@tanstack/react-router';
import { CreateOrganizationPage } from '@/pages/create-organization';

export const Route = createLazyFileRoute('/_auth/organizations/create')({
	component: CreateOrganizationPage,
});
