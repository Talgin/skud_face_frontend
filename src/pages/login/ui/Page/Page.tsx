import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { LoginForm } from '@/features/session/login';

export function LoginPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Вход в систему</CardTitle>
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	);
}
