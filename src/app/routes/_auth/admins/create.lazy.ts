import { createLazyFileRoute } from '@tanstack/react-router';
import { CreateAdminPage } from '@/pages/create-admin';

export const Route = createLazyFileRoute('/_auth/admins/create')({
	component: CreateAdminPage,
});
