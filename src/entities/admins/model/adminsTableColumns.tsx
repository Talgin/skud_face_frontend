import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Admin } from '../model/adminsSchema';

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
		cell: () => <TableRowActions />,
	},
];
