import { createFileRoute } from '@tanstack/react-router';
import { AddUserPage } from '@/pages/add-user';

export const Route = createFileRoute('/_auth/user/add')({
	component: AddUserPage,
});
