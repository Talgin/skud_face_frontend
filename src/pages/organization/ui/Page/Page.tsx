import { RegisterOrganizationForm } from '@/features/organization/register';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function OrganizationPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-4/12 w-full">
				<CardHeader>
					<CardTitle>Регистрация организации</CardTitle>
				</CardHeader>
				<CardContent>
					<RegisterOrganizationForm />
				</CardContent>
			</Card>
		</div>
	);
}
