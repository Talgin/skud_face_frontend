import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AddCameraForm } from '@/features/cameras/add';

export function EditCameraPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить камеру</CardTitle>
				</CardHeader>
				<CardContent>
					<AddCameraForm />
				</CardContent>
			</Card>
		</div>
	);
}
