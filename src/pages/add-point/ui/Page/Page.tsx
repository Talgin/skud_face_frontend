import { useCreatePointMutation } from "@/entities/point";
import { type PointValues, SubmitPointForm } from "@/features/point/submit";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";
export function AddPointPage() {
  const [createPoint, { isSuccess, error }] = useCreatePointMutation();

  function onSubmit(values: PointValues) {
    createPoint({
      name: values.name,
      address: values.address,
      camera_id: Number(values.cameraId),
      organization_id: values.organizationId
        ? Number(values.organizationId)
        : undefined,
    });
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Добавить точку")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmitPointForm onSubmit={onSubmit} isSuccess={isSuccess} />
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
