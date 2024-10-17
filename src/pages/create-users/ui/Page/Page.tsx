import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateUsersForm } from '@/features/users/create';

export function CreateUsersPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить пользователей</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateUsersForm />
				</CardContent>
			</Card>
		</div>
	);
}
