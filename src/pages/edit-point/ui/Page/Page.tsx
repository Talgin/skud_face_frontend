import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitPointForm, type PointValues } from '@/features/point/submit';
import { useParams } from '@tanstack/react-router';
import { usePointQuery, useUpdatePointMutation } from '@/entities/point';

const successMessage = 'Точка успешно обновлено!';

export function EditPointPage() {
	const { id } = useParams({ strict: false });
	const [updatePoint, { isLoading, isSuccess }] = useUpdatePointMutation();
	const { data: point, isSuccess: isPointSuccess } = usePointQuery(parseInt(id));

	function onSubmit(values: PointValues) {
		if (id) {
			updatePoint({
				id: parseInt(id),
				newPoint: {
					name: values.name,
					address: values.address,
					organization_id: Number(values.organizationId),
					camera_id: Number(values.cameraId),
				},
			});
		}
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить точку</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitPointForm
						onSubmit={onSubmit}
						isLoading={isLoading}
						isSuccess={isSuccess}
						successMessage={successMessage}
						defaultValues={point}
						isEditing={true}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
