import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { AdminValues, SubmitAdminForm } from '@/features/admin/submit';
import { useCreateAdminMutation } from '@/entities/admins';

export function AddAdminPage() {
	const [createAdmin, { isSuccess }] = useCreateAdminMutation();

	function onSubmit(values: AdminValues) {
		createAdmin({
			name: values.name,
			surname: values.surname,
			card_id: values.cardId,
			role: values.role,
			active: values.isActive,
			username: values.username,
			password: values.password,
		}).unwrap();
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить админ</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitAdminForm onSubmit={onSubmit} isSuccess={isSuccess} />
				</CardContent>
			</Card>
		</div>
	);
}
