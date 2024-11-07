import { createLazyFileRoute } from '@tanstack/react-router';
import { MonitoringPage } from '@/pages/monitoring';

export const Route = createLazyFileRoute('/_auth/monitoring/')({
	component: MonitoringPage,
});
