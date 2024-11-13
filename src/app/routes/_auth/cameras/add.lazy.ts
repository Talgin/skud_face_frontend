import { createLazyFileRoute } from '@tanstack/react-router';
import { AddCameraPage } from '@/pages/add-camera';

export const Route = createLazyFileRoute('/_auth/cameras/add')({
	component: AddCameraPage,
});
