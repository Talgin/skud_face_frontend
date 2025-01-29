import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import { type Camera } from './types';
import { Checkbox } from '@/shared/ui/checkbox';
import { useDeleteCameraMutation } from '@/entities/camera';

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
		cell: ({ row }) => {
			return <p>{new Date(row.original.registrationDate).toLocaleDateString('ru-RU')}</p>;
		},
	},
	{
		accessorKey: 'isActivated',
		header: () => <span>Активирована</span>,
		cell: ({ row }) => {
			return <Checkbox checked={row.original.isActivated} disabled={true} />;
		},
	},
	{
		accessorKey: 'pointId',
		header: () => <span>ИД точки</span>,
		cell: ({ row }) => {
			return <div>{row.original.pointId === null ? <p>Не указано</p> : row.original.pointId}</div>;
		},
	},
	{
		accessorKey: 'url',
		header: () => <span>Ссылка</span>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [deleteCamera, { isSuccess, isLoading }] = useDeleteCameraMutation();

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
