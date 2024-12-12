import { ColumnDef } from '@tanstack/react-table';
import { useDeleteAdminMutation } from '@/entities/admins';
import type { Admin } from '../model/types';
import { TableRowActions } from '@/shared/ui/table-row-actions';

const EDIT_ROUTE = '/admin/edit';

export const adminsTableColumns: ColumnDef<Admin>[] = [
	{
		accessorKey: 'id',
		header: () => <span>Идентификатор</span>,
	},
	{
		accessorKey: 'name',
		header: () => <span>Имя</span>,
	},
	{
		accessorKey: 'surname',
		header: () => <span>Фамилия</span>,
	},
	{
		accessorKey: 'organization',
		header: () => <span>Организация</span>,
	},
	{
		accessorKey: 'cardId',
		header: () => <span>Номер карты</span>,
	},
	{
		accessorKey: 'phoneNumber',
		header: () => <span>Номер телефона</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [deleteAdmin, { isSuccess, isLoading }] = useDeleteAdminMutation();

			function onConfirm() {
				deleteAdmin(row.original.id);
			}

			return (
				<TableRowActions
					editRouteTo={`${EDIT_ROUTE}/${row.original.id}`}
					onConfirm={onConfirm}
					isDeletedSuccessfully={isSuccess}
					isLoading={isLoading}
				/>
			);
		},
	},
];
