import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { SubmitUserForm, type UserValues } from '@/features/user/submit';
import { useUpdateUserMutation, useUserQuery } from '@/entities/user';
import { useParams } from '@tanstack/react-router';
import { format } from 'date-fns';

export function EditUserPage() {
	const { id } = useParams({ strict: false });
	const userId = parseInt(id);
	const { data: user, isSuccess: isUserSuccess } = useUserQuery(userId);
	const [updateUser, { isSuccess }] = useUpdateUserMutation();

	function onSubmit(values: UserValues) {
		const formData = new FormData();

		formData.append('photo', values.photo?.[0] || '');

		if (userId) {
			updateUser({
				id: userId,
				newUser: {
					queryParams: {
						name: values.name,
						surname: values.surname,
						card_id: values.cardId,
						gender: values.gender,
						birth_date: values.birthDate && format(values.birthDate, 'yyyy-MM-dd'),
					},
					body: formData,
				},
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
					{isUserSuccess && (
						<SubmitUserForm onSubmit={onSubmit} isSuccess={isSuccess} defaultValues={user} isEditing={true} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
