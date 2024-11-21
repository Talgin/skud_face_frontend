import { createLazyFileRoute } from '@tanstack/react-router';
import { AddPointPage } from '@/pages/add-point';

export const Route = createLazyFileRoute('/_auth/points/add')({
	component: AddPointPage,
});
