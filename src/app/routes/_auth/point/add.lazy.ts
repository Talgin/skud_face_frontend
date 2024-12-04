import { createLazyFileRoute } from '@tanstack/react-router';
import { AddPointPage } from '@/pages/add-point';

export const Route = createLazyFileRoute('/_auth/point/add')({
	component: AddPointPage,
});
