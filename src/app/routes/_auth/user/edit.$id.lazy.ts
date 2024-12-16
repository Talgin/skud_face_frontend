import { createLazyFileRoute } from '@tanstack/react-router';
import { EditUserPage } from '@/pages/edit-user';

export const Route = createLazyFileRoute('/_auth/user/edit/$id')({
	component: EditUserPage,
});
