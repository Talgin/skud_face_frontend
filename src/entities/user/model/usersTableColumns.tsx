import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import type { User } from './types';
import { useDeleteUserMutation } from '@/entities/user';

const EDIT_ROUTE = '/user/edit';

export const usersTableColumns: ColumnDef<User>[] = [
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
		accessorKey: 'cardId',
		header: () => <span>Номер карты</span>,
	},
	{
		accessorKey: 'gender',
		header: () => <span>Пол</span>,
	},
	{
		accessorKey: 'isActive',
		header: () => <span>Активирован</span>,
	},
	{
		accessorKey: 'photo',
		header: () => <span>Фото</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [deleteUser, { isSuccess, isLoading }] = useDeleteUserMutation();

			function onConfirm() {
				deleteUser(row.original.id);
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
