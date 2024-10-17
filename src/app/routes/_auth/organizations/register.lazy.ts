import { createLazyFileRoute } from '@tanstack/react-router';
import { RegisterOrganizationPage } from '@/pages/register-organization';

export const Route = createLazyFileRoute('/_auth/organizations/register')({
	component: RegisterOrganizationPage,
});
