import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { adminsTableColumns, useAdminsQuery } from '@/entities/admins';
import { TableSkeleton } from '@/shared/ui/table-skeleton';

export function AdminPage() {
	const navigate = useNavigate();
	const { data: admins, isLoading } = useAdminsQuery();

	function handleAddButtonClick() {
		navigate({ to: '/admin/add' });
	}

	return (
		<div className="container pt-16">
			{isLoading ? (
				<>
					<TableSkeleton />
				</>
			) : (
				<>
					{admins && <DataTable columns={adminsTableColumns} data={admins} />}
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
