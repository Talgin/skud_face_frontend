import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AddUsersForm } from '@/features/users/add';

export function AddUsersPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить пользователей</CardTitle>
				</CardHeader>
				<CardContent>
					<AddUsersForm />
				</CardContent>
			</Card>
		</div>
	);
}
