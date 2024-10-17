import { createFileRoute } from '@tanstack/react-router';
import { CreateSingleUserPage } from '@/pages/create-single-user';

export const Route = createFileRoute('/_auth/users/create-single-user')({
	component: CreateSingleUserPage,
});
