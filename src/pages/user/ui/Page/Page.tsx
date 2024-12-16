import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { usersTableColumns, useUsersQuery } from '@/entities/user';
import { TableSkeleton } from '@/shared/ui/table-skeleton';

export function UserPage() {
	const navigate = useNavigate();
	const { data: users, isLoading } = useUsersQuery();

	function handleAddButtonClick() {
		navigate({ to: '/user/add' });
	}

	return (
		<div className="container pt-16">
			{isLoading ? (
				<>
					<TableSkeleton />
				</>
			) : (
				<>
					{users && <DataTable columns={usersTableColumns} data={users} />}
					<div className="mt-4">
						<Button className="float-right" onClick={handleAddButtonClick}>
							<CirclePlus className="mr-2" /> Добавить
						</Button>
					</div>
				</>
			)}
		</div>
	);
}
