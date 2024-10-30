import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Admin } from './pointsSchema';

export const pointsTableColumns: ColumnDef<Admin>[] = [
	{
		accessorKey: 'id',
		header: () => <span>Идентификатор</span>,
	},
	{
		accessorKey: 'name',
		header: () => <span>Название</span>,
	},
	{
		accessorKey: 'surname',
		header: () => <span>Адрес</span>,
	},
	{
		id: 'actions',
		cell: () => <TableRowActions />,
	},
];
