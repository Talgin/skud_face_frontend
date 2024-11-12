import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Camera } from '../model/camerasSchema';

const EDIT_ROUTE = '/cameras/edit';

export const camerasTableColumns: ColumnDef<Camera>[] = [
	{
		accessorKey: 'id',
		header: () => <span>Идентификатор</span>,
	},
	{
		accessorKey: 'serialNumber',
		header: () => <span>Серийный номер</span>,
	},
	{
		accessorKey: 'brandName',
		header: () => <span>Название бренда</span>,
	},
	{
		accessorKey: 'modelName',
		header: () => <span>Название модели</span>,
	},
	{
		accessorKey: 'registrationDate',
		header: () => <span>Дата регистрации</span>,
	},
	{
		accessorKey: 'isActivated',
		header: () => <span>Активирована</span>,
	},
	{
		accessorKey: 'pointId',
		header: () => <span>ИД точки</span>,
	},
	{
		accessorKey: 'url',
		header: () => <span>Ссылка</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => <TableRowActions editRouteTo={`${EDIT_ROUTE}/${row.id}`} />,
	},
];
