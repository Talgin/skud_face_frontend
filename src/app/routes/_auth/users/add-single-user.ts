import { createFileRoute } from '@tanstack/react-router';
import { AddSingleUserPage } from '@/pages/add-single-user';

export const Route = createFileRoute('/_auth/users/add-single-user')({
	component: AddSingleUserPage,
});
