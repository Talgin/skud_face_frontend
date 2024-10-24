import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { getAdmins, type Admins, adminsTableColumns } from '@/entities/admins';

export function AdminsPage() {
	const navigate = useNavigate();
	const [admins, setAdmins] = useState<Admins>([]);

	function handleAddButtonClick() {
		navigate({ to: '/admins/add' });
	}

	async function fetchOrganizations() {
		const response = await getAdmins();
		setAdmins(response);
	}

	useEffect(() => {
		fetchOrganizations();
	}, []);

	return (
		<div className="container pt-16">
			<DataTable columns={adminsTableColumns} data={admins} />
			<div className="mt-4">
				<Button className="float-right" onClick={handleAddButtonClick}>
					<CirclePlus className="mr-2" /> Добавить
				</Button>
			</div>
		</div>
	);
}
