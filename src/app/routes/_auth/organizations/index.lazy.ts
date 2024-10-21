import { createLazyFileRoute } from '@tanstack/react-router';
import { OrganizationsPage } from '@/pages/organizations';

export const Route = createLazyFileRoute('/_auth/organizations/')({
	component: OrganizationsPage,
});
