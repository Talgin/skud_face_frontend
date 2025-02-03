import { ColumnDef } from '@tanstack/react-table';
import { TableRowActions } from '@/shared/ui/table-row-actions';
import type { User } from './types';
import { useDeleteUserMutation } from '@/entities/user';
import { Checkbox } from '@/shared/ui/checkbox';
import { format } from 'date-fns';

const EDIT_ROUTE = '/user/edit';

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
		accessorKey: 'gender',
		header: () => <span>Пол</span>,
		cell: ({ row }) => {
			return <p>{row.original.gender === 'male' ? 'мужчина' : 'женщина'}</p>;
		},
	},
	{
		accessorKey: 'birthDate',
		header: () => <span>Дата рождения</span>,
		cell: ({ row }) => {
			return <p>{format(row.original.birthDate, 'dd.MM.yyyy')}</p>;
		},
	},
	{
		accessorKey: 'isActive',
		header: () => <span>Активирован</span>,
		cell: ({ row }) => {
			return <Checkbox checked={row.original.isActive} disabled={true} />;
		},
	},
	{
		accessorKey: 'photoPath',
		header: () => <span>Фото</span>,
		cell: ({ row }) => <img src={row.original.photoPath} alt="photo" />,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const [deleteUser, { isSuccess, isLoading }] = useDeleteUserMutation();

			function onConfirm() {
				deleteUser(row.original.id);
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
