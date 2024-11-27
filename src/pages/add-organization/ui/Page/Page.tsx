import { SubmitOrganizationForm, type OrganizationValues } from '@/features/organizations/submitForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { useCreateOrganizationMutation } from '@/entities/organization';

const successMessage = 'Организация успешно создана!';

export function AddOrganizationPage() {
	const [createOrganization, { isLoading, isSuccess }] = useCreateOrganizationMutation();

	function onSubmit(values: OrganizationValues) {
		createOrganization({
			name: values.organizationName,
			ceo_name: values.ceoName,
			address: values.address,
			phone: values.phoneNumber,
		}).unwrap();
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить организации</CardTitle>
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
