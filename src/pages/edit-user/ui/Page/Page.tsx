import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitUserForm, type UserValues } from '@/features/user/submit';
import { UserParams, useUpdateUserMutation, useUserQuery } from '@/entities/user';
import { useParams } from '@tanstack/react-router';
import { mapUser } from '@/entities/user/lib/mapUser';

export function EditUserPage() {
	const { id } = useParams({ strict: false });
	const { data: user, isSuccess: isUserSuccess } = useUserQuery(parseInt(id));
	const [updateUser, { isSuccess }] = useUpdateUserMutation();

	function onSubmit(values: UserValues) {
		const formData = new FormData();

		formData.append(UserParams.NAME, values.name);
		formData.append(UserParams.SURNAME, values.surname);
		formData.append(UserParams.CARD_ID, values.cardId);
		formData.append(UserParams.ACTIVE, values.cardId);
		formData.append(UserParams.GENDER, values.gender);
		formData.append(UserParams.BIRTH_DATE, values.birthDate.toDateString());
		formData.append(UserParams.PHOTO, values.photo[0]);

		if (id) {
			updateUser({
				id: parseInt(id),
				newUser: formData,
			}).unwrap();
		}
	}

	return (
		<div className="container flex justify-center pt-16">
			<Card className="xl:w-6/12 w-full">
				<CardHeader>
					<CardTitle>Изменить пользователя</CardTitle>
				</CardHeader>
				<CardContent>
					{user && (
						<SubmitUserForm onSubmit={onSubmit} isSuccess={isSuccess} defaultValues={mapUser(user)} isEditing={true} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
