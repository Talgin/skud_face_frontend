import { type OrganizationValues, SubmitOrganizationForm } from '@/features/organizations/submitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useUpdateOrganizationMutation } from '@/entities/organization';
import { useParams } from '@tanstack/react-router';

const successMessage = 'Организация успешно обновлено!';

export function EditOrganizationPage() {
	const [updateOrganization, { isLoading, isSuccess }] = useUpdateOrganizationMutation();
	const { id } = useParams({ strict: false });

	function onSubmit(values: OrganizationValues) {
		if (id) {
			updateOrganization({
				id: parseInt(id),
				newOrganization: {
					name: values.organizationName,
					ceo_name: values.ceoName,
					address: values.address,
					phone: values.phoneNumber,
				},
			});
		}
	}
	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить организацию</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitOrganizationForm
						onSubmit={onSubmit}
						isLoading={isLoading}
						isSuccess={isSuccess}
						successMessage={successMessage}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
