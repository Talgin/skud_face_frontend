import { createLazyFileRoute } from '@tanstack/react-router';
import { EditAdminPage } from '@/pages/edit-admin';

export const Route = createLazyFileRoute('/_auth/admins/edit/$id')({
	component: EditAdminPage,
});
