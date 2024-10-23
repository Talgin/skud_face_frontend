import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { getOrganizations, type Organizations, organizationsTableColumns } from '@/entities/organizations';

export function OrganizationsPage() {
	const navigate = useNavigate();
	const [organizations, setOrganizations] = useState<Organizations>([]);

	function handleAddButtonClick() {
		navigate({ to: '/organizations/add' });
	}

	async function fetchOrganizations() {
		const response = await getOrganizations();
		setOrganizations(response);
	}

	useEffect(() => {
		fetchOrganizations();
	}, []);

	return (
		<div className="container pt-16">
			<DataTable columns={organizationsTableColumns} data={organizations} />
			<div className="mt-4">
				<Button className="float-right" onClick={handleAddButtonClick}>
					<CirclePlus className="mr-2" /> Добавить
				</Button>
			</div>
		</div>
	);
}
