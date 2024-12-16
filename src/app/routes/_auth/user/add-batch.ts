import { createFileRoute } from '@tanstack/react-router';
import { AddBatchUsersPage } from '@/pages/add-batch-users';

export const Route = createFileRoute('/_auth/user/add-batch')({
	component: AddBatchUsersPage,
});
