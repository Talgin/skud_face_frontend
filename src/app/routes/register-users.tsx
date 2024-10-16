import { createFileRoute } from '@tanstack/react-router';
import { RegisterUsersPage } from '@/pages/register-users';

export const Route = createFileRoute('/register-users')({
	component: RegisterUsersPage,
});
