import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { PointValues, SubmitPointForm } from '@/features/point/submit';
import { useCreatePointMutation } from '@/entities/point';

export function AddPointPage() {
	const [createPoint, { isSuccess }] = useCreatePointMutation();

	function onSubmit(values: PointValues) {
		createPoint({
			name: values.name,
			address: values.address,
			organization_id: Number(values.organizationId),
			camera_id: Number(values.cameraId),
		}).unwrap();
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить точку</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitPointForm onSubmit={onSubmit} isSuccess={isSuccess} />
				</CardContent>
			</Card>
		</div>
	);
}
