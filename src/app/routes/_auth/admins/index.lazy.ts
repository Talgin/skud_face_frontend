import { createLazyFileRoute } from '@tanstack/react-router';
import { AdminsPage } from '@/pages/admins';

export const Route = createLazyFileRoute('/_auth/admins/')({
	component: AdminsPage,
});
