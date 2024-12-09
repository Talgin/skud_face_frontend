import { createLazyFileRoute } from '@tanstack/react-router';
import { EditCameraPage } from '@/pages/edit-camera';

export const Route = createLazyFileRoute('/_auth/camera/edit/$id')({
	component: EditCameraPage,
});
