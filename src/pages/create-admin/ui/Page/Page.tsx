import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateAdminForm } from '@/features/admin/create';

export function CreateAdminPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Создать админ</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateAdminForm />
				</CardContent>
			</Card>
		</div>
	);
}
