import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AddAdminForm } from '@/features/admin/add';

export function AddAdminPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить админ</CardTitle>
				</CardHeader>
				<CardContent>
					<AddAdminForm />
				</CardContent>
			</Card>
		</div>
	);
}
