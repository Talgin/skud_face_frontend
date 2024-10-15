import { createLazyFileRoute } from '@tanstack/react-router';
import { StudentsPage } from '@/pages/students';

export const Route = createLazyFileRoute('/_auth/students')({
	component: StudentsPage,
});
