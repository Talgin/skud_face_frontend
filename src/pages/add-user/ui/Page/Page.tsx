import { format } from "date-fns";
import { useCreateUserMutation } from "@/entities/user";
import { type CreateValues, SubmitUserForm } from "@/features/user/submit";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function AddUserPage() {
  const [createUser, { isSuccess }] = useCreateUserMutation();

  function onSubmit(values: CreateValues) {
    const formData = new FormData();

    formData.append("photo", values.photo[0]);

    createUser({
      queryParams: {
        name: values.name,
        surname: values.surname,
        card_id: values.cardId,
        gender: values.gender,
        birth_date: format(values.birthDate, "yyyy-MM-dd"),
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
          {/* TODO: пофиксить */
          /* @ts-ignore */}
          <SubmitUserForm onSubmit={onSubmit} isSuccess={isSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
