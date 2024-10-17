import { createLazyFileRoute } from '@tanstack/react-router';
import { RegisterUsersPage } from '@/pages/register-users';

export const Route = createLazyFileRoute('/_auth/users/register')({
	component: RegisterUsersPage,
});
