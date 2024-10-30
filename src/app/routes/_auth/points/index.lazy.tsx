import { createLazyFileRoute } from '@tanstack/react-router';
import { PointsPage } from '@/pages/points';

export const Route = createLazyFileRoute('/_auth/points/')({
	component: PointsPage,
});
