import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AdminPanelLayout } from '@/app/layouts/admin-panel';

export const Route = createFileRoute('/_auth')({
	beforeLoad: async ({ location, context }) => {
		if (!(context as { auth: { isAuthenticated: boolean } }).auth.isAuthenticated) {
			throw redirect({
				to: '/',
				search: {
					// Use the current location to power a redirect after login
					// (Do not use `router.state.resolvedLocation` as it can
					// potentially lag behind the actual current location)
					redirect: location.href,
				},
			});
		}
	},
	component: AuthComponent,
});

function AuthComponent() {
	return (
		<AdminPanelLayout>
			<Outlet />
		</AdminPanelLayout>
	);
}
