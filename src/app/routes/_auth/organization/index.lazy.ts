import { createLazyFileRoute } from '@tanstack/react-router';
import { OrganizationPage } from '@/pages/organization';

export const Route = createLazyFileRoute('/_auth/organization/')({
	component: OrganizationPage,
});
