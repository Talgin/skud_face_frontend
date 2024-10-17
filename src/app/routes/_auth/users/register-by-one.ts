import { createFileRoute } from '@tanstack/react-router';
import { RegisterUsersByOnePage } from '@/pages/register-users-by-one';

export const Route = createFileRoute('/_auth/users/register-by-one')({
	component: RegisterUsersByOnePage,
});
