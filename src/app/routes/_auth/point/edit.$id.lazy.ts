import { createLazyFileRoute } from '@tanstack/react-router';
import { EditPointPage } from '@/pages/edit-point';

export const Route = createLazyFileRoute('/_auth/point/edit/$id')({
	component: EditPointPage,
});
