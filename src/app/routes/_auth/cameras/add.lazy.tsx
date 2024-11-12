import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/cameras/add')({
	component: () => <div>Hello /_auth/cameras/add!</div>,
});
