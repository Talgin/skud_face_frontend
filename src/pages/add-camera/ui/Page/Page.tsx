import { modelsFromKeys, useCreateCameraMutation } from "@/entities/camera";
import {
  type AddCameraValues,
  parseDateToString,
  SubmitCameraForm,
} from "@/features/camera/submit";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ServerError } from "@/shared/ui/server-error";
export function AddCameraPage() {
  const [createCamera, { isSuccess, error }] = useCreateCameraMutation();

  function onSubmit(values: AddCameraValues) {
    createCamera({
      serial_number: values.serialNumber,
      brand_name: values.brandName,
      camera_model_name: values.modelName,
      registration_date: parseDateToString(values.registrationDate),
      url: values.url,
      models: modelsFromKeys(values.models),
    });
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Добавить камеру")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SubmitCameraForm onSubmit={onSubmit} isSuccess={isSuccess} />
          <ServerError error={error} />
        </CardContent>
      </Card>
    </div>
  );
}
