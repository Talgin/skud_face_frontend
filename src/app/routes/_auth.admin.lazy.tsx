import { createLazyFileRoute } from '@tanstack/react-router';
import { AdminPage } from '@/pages/admin';

export const Route = createLazyFileRoute('/_auth/admin')({
	component: AdminPage,
});
