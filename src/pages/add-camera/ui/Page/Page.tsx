import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitCameraForm, type AddCameraValues, parseDateToString } from '@/features/camera/submit';
import { useCreateCameraMutation } from '@/entities/camera';

export function AddCameraPage() {
	const [createCamera, { isSuccess }] = useCreateCameraMutation();

	function onSubmit(values: AddCameraValues) {
		createCamera({
			serial_number: values.serialNumber,
			brand_name: values.brandName,
			camera_model_name: values.modelName,
			registration_date: parseDateToString(values.registrationDate),
			url: values.url,
		}).unwrap();
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить камеру</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitCameraForm onSubmit={onSubmit} isSuccess={isSuccess} />
				</CardContent>
			</Card>
		</div>
	);
}
