import { ColumnDef } from '@tanstack/react-table';
import { useDeleteOrganizationMutation } from '@/entities/organization';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Camera } from './types';

const EDIT_ROUTE = '/camera/edit';

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
		cell: ({ row }) => {
			const [deleteCamera, { isSuccess, isLoading }] = useDeleteOrganizationMutation();

			function onConfirm() {
				deleteCamera(row.original.id);
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
