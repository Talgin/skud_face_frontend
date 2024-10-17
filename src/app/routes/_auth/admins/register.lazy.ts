import { createLazyFileRoute } from '@tanstack/react-router';
import { RegisterAdminPage } from '@/pages/register-admin';

export const Route = createLazyFileRoute('/_auth/admins/register')({
	component: RegisterAdminPage,
});
