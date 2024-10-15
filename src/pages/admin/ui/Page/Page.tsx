import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RegisterAdminForm } from '@/features/admin/register';

export function AdminPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация админ</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterAdminForm />
				</CardContent>
			</Card>
		</div>
	);
}
