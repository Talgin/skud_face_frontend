import { createLazyFileRoute } from '@tanstack/react-router';
import { RegisterUserPage } from '@/pages/register-user';

export const Route = createLazyFileRoute('/_auth/register-user')({
	component: RegisterUserPage,
});
