import { createRouter, RouterProvider as TanstackRouterProvider } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import React from 'react';
import { useAppSelector } from '@/shared/model';
import { selectIsAuthenticated } from '@/entities/session';

const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
	context: {
		auth: undefined!,
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

export function appRouter() {
	return router;
}

export const RouterProvider: React.FC = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	return <TanstackRouterProvider router={appRouter()} context={{ auth: { isAuthenticated } }} />;
};
