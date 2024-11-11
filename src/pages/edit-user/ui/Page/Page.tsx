import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AddSingleUserForm } from '@/features/users/add-single-user';

export function EditUserPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<AddSingleUserForm />
				</CardContent>
			</Card>
		</div>
	);
}
