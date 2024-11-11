import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type User } from './usersSchema';

const EDIT_ROUTE = '/users/edit';

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
		accessorKey: 'role',
		header: () => <span>Роль</span>,
	},
	{
		accessorKey: 'photo',
		header: () => <span>Фото</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <TableRowActions editRouteTo={`${EDIT_ROUTE}/${row.id}`} />,
	},
];
