import { createLazyFileRoute } from '@tanstack/react-router';
import { AddOrganizationPage } from '@/pages/add-organization';

export const Route = createLazyFileRoute('/_auth/organizations/add')({
	component: AddOrganizationPage,
});
