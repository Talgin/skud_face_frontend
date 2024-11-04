import { createLazyFileRoute } from '@tanstack/react-router';
import { EditOrganizationPage } from '@/pages/edit-organization';

export const Route = createLazyFileRoute(`/_auth/organizations/edit`)({
	component: EditOrganizationPage,
});
