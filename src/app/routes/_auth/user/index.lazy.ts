import { createLazyFileRoute } from '@tanstack/react-router';
import { UserPage } from '@/pages/user';

export const Route = createLazyFileRoute('/_auth/user/')({
	component: UserPage,
});
