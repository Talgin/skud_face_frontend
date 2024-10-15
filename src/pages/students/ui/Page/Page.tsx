import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { RegisterStudentsForm } from '@/features/students/register';

export function StudentsPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация студентов</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterStudentsForm />
				</CardContent>
			</Card>
		</div>
	);
}
