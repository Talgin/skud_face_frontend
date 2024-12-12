import { createLazyFileRoute } from '@tanstack/react-router';
import { AddAdminPage } from '@/pages/add-admin';

export const Route = createLazyFileRoute('/_auth/admin/add')({
	component: AddAdminPage,
});
