import { createLazyFileRoute } from '@tanstack/react-router';
import { MonitoringHistoryPage } from '@/pages/monitoring-history';

export const Route = createLazyFileRoute('/_auth/monitoring/history')({
	component: MonitoringHistoryPage,
});
