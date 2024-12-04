import React from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { pointTableColumns, usePointsQuery } from '@/entities/point';
import { TableSkeleton } from '@/shared/ui/table-skeleton';

export function PointPage() {
	const navigate = useNavigate();
	const { data: points, isLoading } = usePointsQuery();

	function handleAddButtonClick() {
		navigate({ to: '/point/add' });
	}

	return (
		<div className="container pt-16">
			{isLoading ? (
				<>
					<TableSkeleton />
				</>
			) : (
				<>
					{points && <DataTable columns={pointTableColumns} data={points} />}
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
