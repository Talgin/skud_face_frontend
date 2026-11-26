import { useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { useUpdateUserMutation, useUserQuery } from "@/entities/user";
import { SubmitUserForm, type UserValues } from "@/features/user/submit";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";
export function EditUserPage() {
  const { id } = useParams({ strict: false });
  const userId = parseInt(id ?? "");
  const { data: user, isSuccess: isUserSuccess } = useUserQuery(userId);
  const [updateUser, { isSuccess, error }] = useUpdateUserMutation();

  function onSubmit(values: UserValues) {
    const formData = new FormData();

    formData.append("photo", values.photo?.[0] || "");

    if (userId) {
      updateUser({
        id: userId,
        newUser: {
          queryParams: {
            name: values.name,
            surname: values.surname,
            card_id: values.cardId,
            gender: values.gender,
            birth_date:
              values.birthDate && format(values.birthDate, "yyyy-MM-dd"),
          },
          body: formData,
        },
      });
    }
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Изменить данные человека")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isUserSuccess && (
            <SubmitUserForm
              onSubmit={onSubmit}
              isSuccess={isSuccess}
              defaultValues={user}
              isEditing={true}
            />
          )}
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
