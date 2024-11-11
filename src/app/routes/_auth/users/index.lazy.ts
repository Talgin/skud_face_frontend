import { createLazyFileRoute } from '@tanstack/react-router';
import { UsersPage } from '@/pages/users';

export const Route = createLazyFileRoute('/_auth/users/')({
	component: UsersPage,
});
