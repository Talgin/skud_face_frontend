import { createFileRoute } from '@tanstack/react-router';
import { CreateUsersPage } from '@/pages/create-users';

export const Route = createFileRoute('/_auth/users/create')({
	component: CreateUsersPage,
});
