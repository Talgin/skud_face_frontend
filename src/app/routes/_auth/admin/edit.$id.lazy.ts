import { createLazyFileRoute } from '@tanstack/react-router';
import { EditAdminPage } from '@/pages/edit-admin';

export const Route = createLazyFileRoute('/_auth/admin/edit/$id')({
	component: EditAdminPage,
});
