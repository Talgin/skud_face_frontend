import React from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { organizationTableColumns, useOrganizationsQuery } from '@/entities/organization';

export function OrganizationPage() {
	const navigate = useNavigate();
	const { data: organizations } = useOrganizationsQuery();

	function handleAddButtonClick() {
		navigate({ to: '/organizations/add' });
	}

	return (
		<div className="container pt-16">
			<DataTable columns={organizationTableColumns} data={organizations} />
			<div className="mt-4">
				<Button className="float-right" onClick={handleAddButtonClick}>
					<CirclePlus className="mr-2" /> Добавить
				</Button>
			</div>
		</div>
	);
}
