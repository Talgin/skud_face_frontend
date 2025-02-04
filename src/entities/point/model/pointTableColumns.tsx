import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { useDeletePointMutation } from '@/entities/point';
import { type Point } from './types';

const EDIT_ROUTE = '/point/edit';

export const pointTableColumns: ColumnDef<Point>[] = [
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
		accessorKey: 'cameraId',
		header: () => <span>Камера</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [deletePoint, { isSuccess, isLoading }] = useDeletePointMutation();

			function onConfirm() {
				deletePoint(row.original.id);
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
