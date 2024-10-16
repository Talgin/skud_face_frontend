import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RegisterUserForm } from '@/features/users/registerUser';

export function RegisterUserPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterUserForm />
				</CardContent>
			</Card>
		</div>
	);
}
