import { createLazyFileRoute } from '@tanstack/react-router';
import { EditOrganizationPage } from '@/pages/edit-organization';

export const Route = createLazyFileRoute(`/_auth/organization/edit/$id`)({
	component: EditOrganizationPage,
});
