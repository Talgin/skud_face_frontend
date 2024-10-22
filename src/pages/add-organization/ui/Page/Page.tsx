import { AddOrganizationForm } from '@/features/organizations/add';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function AddOrganizationPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить организации</CardTitle>
				</CardHeader>
				<CardContent>
					<AddOrganizationForm />
				</CardContent>
			</Card>
		</div>
	);
}
