import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateSingleUserForm } from '@/features/users/create-single-user';

export function CreateSingleUserPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateSingleUserForm />
				</CardContent>
			</Card>
		</div>
	);
}
