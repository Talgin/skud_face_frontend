import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitUserForm } from '@/features/user/submit';
import { useCreateUserMutation } from '@/entities/user';
import { type CreateValues } from '@/features/user/submit';
import { format } from 'date-fns';

export function AddUserPage() {
	const [createUser, { isSuccess }] = useCreateUserMutation();

	function onSubmit(values: CreateValues) {
		const formData = new FormData();

		formData.append('photo', values.photo[0]);

		createUser({
			queryParams: {
				name: values.name,
				surname: values.surname,
				card_id: values.cardId,
				gender: values.gender,
				birth_date: format(values.birthDate, 'yyyy-MM-dd'),
			},
			body: formData,
		}).unwrap();
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Добавить пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					<SubmitUserForm onSubmit={onSubmit} isSuccess={isSuccess} />
				</CardContent>
			</Card>
		</div>
	);
}
