import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { type Users, getUsers, usersTableColumns } from '@/entities/users';

export function UsersPage() {
	const navigate = useNavigate();
	const [users, setUsers] = useState<Users>([]);

	function handleAddButtonClick() {
		navigate({ to: '/users/add-single-user' });
	}

	async function fetchUsers() {
		const response = await getUsers();
		setUsers(response);
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<div className="container pt-16">
			<DataTable columns={usersTableColumns} data={users} />
			<div className="mt-4">
				<Button className="float-right" onClick={handleAddButtonClick}>
					<CirclePlus className="mr-2" /> Добавить
				</Button>
			</div>
		</div>
	);
}
