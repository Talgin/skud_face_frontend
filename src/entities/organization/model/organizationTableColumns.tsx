import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Organization } from './types';

const EDIT_ROUTE = '/organization/edit';

export const organizationTableColumns: ColumnDef<Organization>[] = [
	{
		accessorKey: 'id',
		header: () => <span>Идентификатор</span>,
	},
	{
		accessorKey: 'organizationName',
		header: () => <span>Название организации</span>,
	},
	{
		accessorKey: 'ceoName',
		header: () => <span>Имя руководителя</span>,
	},
	{
		accessorKey: 'address',
		header: () => <span>Адрес</span>,
	},

	{
		accessorKey: 'phoneNumber',
		header: () => <span>Номер телефона</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <TableRowActions editRouteTo={`${EDIT_ROUTE}/${row.id}`} />,
	},
];
