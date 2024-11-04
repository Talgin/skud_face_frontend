import { AddOrganizationForm } from '@/features/organizations/add';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function EditOrganizationPage() {
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить организацию</CardTitle>
				</CardHeader>
				<CardContent>
					<AddOrganizationForm />
				</CardContent>
			</Card>
		</div>
	);
}
