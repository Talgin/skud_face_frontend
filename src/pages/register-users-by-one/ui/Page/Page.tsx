import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RegisterUsersByOneForm } from '@/features/users/registerByOne';

export function RegisterUsersByOnePage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterUsersByOneForm />
				</CardContent>
			</Card>
		</div>
	);
}
