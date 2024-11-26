import { createLazyFileRoute } from '@tanstack/react-router';
import { AddOrganizationPage } from '@/pages/add-organization';

export const Route = createLazyFileRoute('/_auth/organization/add')({
	component: AddOrganizationPage,
});
