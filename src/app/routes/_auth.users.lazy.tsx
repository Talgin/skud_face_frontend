import { createLazyFileRoute } from '@tanstack/react-router';
import { StudentsPage } from '@/pages/users';

export const Route = createLazyFileRoute('/_auth/users')({
	component: StudentsPage,
});
