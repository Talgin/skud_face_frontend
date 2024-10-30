import { createFileRoute } from '@tanstack/react-router';
import { AddUsersPage } from '@/pages/add-users';

export const Route = createFileRoute('/_auth/users/add')({
	component: AddUsersPage,
});
