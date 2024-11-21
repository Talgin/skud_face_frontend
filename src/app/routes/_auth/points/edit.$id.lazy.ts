import { createLazyFileRoute } from '@tanstack/react-router';
import { EditPointPage } from '@/pages/edit-point';

export const Route = createLazyFileRoute('/_auth/points/edit/$id')({
	component: EditPointPage,
});
