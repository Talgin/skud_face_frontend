import { AddBatchUsersParams, useBatchUsersMutation } from "@/entities/user";
import {
  type BatchUserValues,
  SubmitBatchUserForm,
} from "@/features/user/submit-batch";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";
export function AddBatchUsersPage() {
  const [addBatchUsers, { isSuccess, error }] = useBatchUsersMutation();

  function onSubmit(values: BatchUserValues) {
    const formData = new FormData();

    if (values.excelFile?.[0]) {
      formData.append(AddBatchUsersParams.EXCEL_FILE, values.excelFile[0]);
    }

    if (values.photos && values.photos.length > 0) {
      Array.from(values.photos).forEach((photo) => {
        formData.append(AddBatchUsersParams.PHOTOS, photo);
      });
    }

    addBatchUsers(formData);
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Импорт людей из Excel")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmitBatchUserForm onSubmit={onSubmit} isSuccess={isSuccess} />
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
