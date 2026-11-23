import { useParams } from "@tanstack/react-router";
import {
  modelsFromKeys,
  useCameraQuery,
  useUpdateCameraMutation,
} from "@/entities/camera";
import {
  mapCamera,
  parseDateToString,
  SubmitCameraForm,
  type UpdateCameraValues,
} from "@/features/camera/submit";
import { t } from "@/shared/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
export function EditCameraPage() {
  const { id } = useParams({ strict: false });
  const [updateCamera, { isSuccess }] = useUpdateCameraMutation();
  const { data: camera, isSuccess: isCameraSuccess } = useCameraQuery(
    parseInt(id ?? ""),
  );

  function onSubmit(values: UpdateCameraValues) {
    if (id) {
      updateCamera({
        id: parseInt(id),
        newCamera: {
          serial_number: values.serialNumber,
          brand_name: values.brandName,
          camera_model_name: values.modelName,
          registration_date: parseDateToString(values.registrationDate),
          is_activated: values.isActivated,
          point_id: Number(values.pointId),
          url: values.url,
          // keep per-model settings (e.g. the LPR region) for models that stay ticked
          models: modelsFromKeys(values.models, camera?.models),
        },
      });
    }
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>{t("Изменить камеру")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isCameraSuccess && (
            <SubmitCameraForm
              // TODO: Пофиксить
              // @ts-ignore
              onSubmit={onSubmit}
              isSuccess={isSuccess}
              defaultValues={mapCamera(camera)}
              isEditing={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
