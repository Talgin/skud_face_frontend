import { useParams } from "@tanstack/react-router";
import { usePointQuery, useUpdatePointMutation } from "@/entities/point";
import {
  mapPoint,
  type PointValues,
  SubmitPointForm,
} from "@/features/point/submit";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function EditPointPage() {
  const { id } = useParams({ strict: false });
  const [updatePoint, { isSuccess }] = useUpdatePointMutation();
  const { data: point, isSuccess: isPointSuccess } = usePointQuery(
    parseInt(id ?? ""),
  );

  function onSubmit(values: PointValues) {
    if (id) {
      updatePoint({
        id: parseInt(id),
        newPoint: {
          name: values.name,
          address: values.address,
          camera_id: Number(values.cameraId),
        },
      });
    }
  }

  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>Изменить точку</CardTitle>
        </CardHeader>
        <CardContent>
          {isPointSuccess && (
            <SubmitPointForm
              onSubmit={onSubmit}
              isSuccess={isSuccess}
              defaultValues={mapPoint(point)}
              isEditing={true}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
