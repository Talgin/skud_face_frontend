import { CreateOrganizationForm } from '@/features/organization/create';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function CreateOrganizationPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить организации</CardTitle>
				</CardHeader>
				<CardContent>
					<CreateOrganizationForm />
				</CardContent>
			</Card>
		</div>
	);
}
