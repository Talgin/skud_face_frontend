import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { DataTable } from '@/widgets/DataTable';
import { getPoints, type Points, pointsTableColumns } from '@/entities/points';

export function PointsPage() {
	const navigate = useNavigate();
	const [points, setPoints] = useState<Points>([]);

	function handleAddButtonClick() {
		navigate({ to: '/organizations/add' });
	}

	async function fetchPoints() {
		const response = await getPoints();
		setPoints(response);
	}

	useEffect(() => {
		fetchPoints();
	}, []);

	return (
		<div className="container pt-16">
			<DataTable columns={pointsTableColumns} data={points} />
			<div className="mt-4">
				<Button className="float-right" onClick={handleAddButtonClick}>
					<CirclePlus className="mr-2" /> Добавить
				</Button>
			</div>
		</div>
	);
}
