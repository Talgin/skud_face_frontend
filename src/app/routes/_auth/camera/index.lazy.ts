import { createLazyFileRoute } from '@tanstack/react-router';
import { CamerasPage } from '@/pages/camera';

export const Route = createLazyFileRoute('/_auth/camera/')({
	component: CamerasPage,
});
