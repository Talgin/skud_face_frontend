import React, { useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { type Point, pointTableColumns, usePointsQuery } from '@/entities/point';
import { TableSkeleton } from '@/shared/ui/table-skeleton';
import { useCamerasQuery } from '@/entities/camera';
import { type ColumnDef } from '@tanstack/react-table';

export function PointPage() {
	const navigate = useNavigate();
	const { data: points, isLoading } = usePointsQuery();
	const { data: cameras } = useCamerasQuery();

	function handleAddButtonClick() {
		navigate({ to: '/point/add' });
	}

	const mappedPointTableColumns = useMemo(() => {
		return pointTableColumns.map((column: ColumnDef<Point>) => {
			if (column.accessorKey !== 'cameraId') {
				return column;
			}

			return {
				accessorKey: 'cameraId',
				header: () => <span>Камера</span>,
				cell: ({ row }) => {
					const camera = cameras?.find((camera) => camera.id === row.original.cameraId);

					return <p>{camera?.serialNumber}</p>;
				},
			};
		});
	}, [pointTableColumns, cameras]);

	return (
		<div className="container pt-16">
			{isLoading ? (
				<>
					<TableSkeleton />
				</>
			) : (
				<>
					{points && <DataTable columns={mappedPointTableColumns} data={points} />}
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
