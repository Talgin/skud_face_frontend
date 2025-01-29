import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { type UpdateCameraValues, mapCamera, SubmitCameraForm, parseDateToString } from '@/features/camera/submit';
import { useParams } from '@tanstack/react-router';
import { useCameraQuery, useUpdateCameraMutation } from '@/entities/camera';

export function EditCameraPage() {
	const { id } = useParams({ strict: false });
	const [updateCamera, { isSuccess }] = useUpdateCameraMutation();
	const { data: camera, isSuccess: isCameraSuccess } = useCameraQuery(parseInt(id));

	function onSubmit(values: UpdateCameraValues) {
		if (id) {
			updateCamera({
				id: parseInt(id),
				newCamera: {
					serial_number: values.serialNumber,
					brand_name: values.brandName,
					camera_model_name: values.modelName,
					registration_date: parseDateToString(values.registrationDate),
					is_activated: values.isActivated,
					point_id: Number(values.pointId),
					url: values.url,
				},
			});
		}
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить камеру</CardTitle>
				</CardHeader>
				<CardContent>
					{isCameraSuccess && (
						<SubmitCameraForm
							onSubmit={onSubmit}
							isSuccess={isSuccess}
							defaultValues={mapCamera(camera)}
							isEditing={true}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
