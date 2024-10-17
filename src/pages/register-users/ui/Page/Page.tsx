import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RegisterUsersForm } from '@/features/users/register';

export function RegisterUsersPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация пользователей</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterUsersForm />
				</CardContent>
			</Card>
		</div>
	);
}
