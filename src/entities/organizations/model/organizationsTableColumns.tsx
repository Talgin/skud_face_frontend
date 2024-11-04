import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Organization } from './organizationsSchema';

const EDIT_ROUTE = '/organizations/edit';

export const organizationsTableColumns: ColumnDef<Organization>[] = [
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
