import { createLazyFileRoute } from '@tanstack/react-router';
import { LoginPage } from '@/pages/login';

export const Route = createLazyFileRoute('/')({
	component: LoginPage,
});
