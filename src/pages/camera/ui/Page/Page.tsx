import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { camerasTableColumns } from '@/entities/camera';
import { useCamerasQuery } from '@/entities/camera';
import { TableSkeleton } from '@/shared/ui/table-skeleton';

export function CamerasPage() {
	const navigate = useNavigate();
	const { data: cameras, isLoading } = useCamerasQuery();

	function handleAddButtonClick() {
		navigate({ to: '/camera/add' });
	}

	return (
		<div className="container pt-16">
			{isLoading ? (
				<>
					<TableSkeleton />
				</>
			) : (
				<>
					{cameras && <DataTable columns={camerasTableColumns} data={cameras} />}
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
