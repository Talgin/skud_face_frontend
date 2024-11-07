import { AddAdminForm } from '@/features/admin/add';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function EditAdminPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить админ</CardTitle>
				</CardHeader>
				<CardContent>
					<AddAdminForm />
				</CardContent>
			</Card>
		</div>
	);
}
