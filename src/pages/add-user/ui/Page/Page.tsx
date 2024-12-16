import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitUserForm } from '@/features/user/submit';
import { useCreateUserMutation, UserParams } from '@/entities/user';
import { UserValues } from '@/features/user/submit';

export function AddUserPage() {
	const [createUser, { isSuccess }] = useCreateUserMutation();

	function onSubmit(values: UserValues) {
		const formData = new FormData();

		formData.append(UserParams.NAME, values.name);
		formData.append(UserParams.SURNAME, values.surname);
		formData.append(UserParams.CARD_ID, values.cardId);
		formData.append(UserParams.GENDER, values.gender);
		formData.append(UserParams.BIRTH_DATE, values.birthDate.toDateString());
		formData.append(UserParams.PHOTO, values.photo[0]);

		createUser(formData).unwrap();
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
