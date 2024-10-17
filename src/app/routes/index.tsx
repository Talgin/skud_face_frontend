import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/pages/login';
import { isAuthenticated } from '@/entities/session';
import { z } from 'zod';

const fallback = '/organizations/register' as const;

export const Route = createFileRoute('/')({
	validateSearch: z.object({
		redirect: z.string().optional().catch(''),
	}),
	component: LoginPage,
	beforeLoad: async ({ search }) => {
		if (isAuthenticated()) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
});
