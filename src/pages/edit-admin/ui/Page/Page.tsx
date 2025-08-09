import { useParams } from "@tanstack/react-router";
import { useAdminQuery, useUpdateAdminMutation } from "@/entities/admins";
import { type AdminValues, SubmitAdminForm } from "@/features/admin/submit";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function EditAdminPage() {
  const { id } = useParams({ strict: false });
  const [updateAdmin, { isSuccess }] = useUpdateAdminMutation();
  const { data: admin, isSuccess: isAdminSuccess } = useAdminQuery(
    parseInt(id ?? ""),
  );

  function onSubmit(values: AdminValues) {
    if (id) {
      updateAdmin({
        id: parseInt(id),
        //TODO: пофиксить
        // @ts-ignore
        newAdmin: {
          name: values.name,
          surname: values.surname,
          card_id: values.cardId,
          role: values.role,
        },
      });
    }
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>Изменить админ</CardTitle>
        </CardHeader>
        <CardContent>
          {isAdminSuccess && (
            <SubmitAdminForm
              onSubmit={onSubmit}
              isSuccess={isSuccess}
              //TODO: пофиксить
              // @ts-ignore
              defaultValues={admin}
              isEditing={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
