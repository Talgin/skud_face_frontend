import { createLazyFileRoute } from '@tanstack/react-router';
import { PointPage } from '@/pages/point';

export const Route = createLazyFileRoute('/_auth/point/')({
	component: PointPage,
});
