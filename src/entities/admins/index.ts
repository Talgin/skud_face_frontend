export { type Admins } from './model/types';
export { adminsTableColumns } from './model/adminsTableColumns';
export {
	useAdminsQuery,
	useAdminQuery,
	useCreateAdminMutation,
	useUpdateAdminMutation,
	useDeleteAdminMutation,
} from './api/adminApi';
export { mapAdmin } from './lib/mapAdmin';
