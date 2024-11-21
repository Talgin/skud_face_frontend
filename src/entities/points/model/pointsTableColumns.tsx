import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Point } from './pointsSchema';

const EDIT_ROUTE = '/points/edit';

export const pointsTableColumns: ColumnDef<Point>[] = [
	{
		accessorKey: 'id',
		header: () => <span>Идентификатор</span>,
	},
	{
		accessorKey: 'name',
		header: () => <span>Название</span>,
	},
	{
		accessorKey: 'address',
		header: () => <span>Адрес</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <TableRowActions editRouteTo={`${EDIT_ROUTE}/${row.id}`} />,
	},
];
