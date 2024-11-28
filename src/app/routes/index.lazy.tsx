import { createLazyFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/pages/login';
import { z } from 'zod';

const fallback = '/monitoring' as const;

export const Route = createLazyFileRoute('/')({
	validateSearch: z.object({
		redirect: z.string().optional().catch(''),
	}),
	component: LoginPage,
	beforeLoad: async ({ search, context }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect || fallback });
		}
	},
});
