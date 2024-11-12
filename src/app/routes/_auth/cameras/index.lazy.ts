import { createLazyFileRoute } from '@tanstack/react-router';
import { CamerasPage } from '@/pages/cameras';

export const Route = createLazyFileRoute('/_auth/cameras/')({
	component: CamerasPage,
});
