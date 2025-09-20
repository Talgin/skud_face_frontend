import { useNavigate, useParams } from "@tanstack/react-router";

import {
  type MonitoringEventRaw,
  useApproveEventMutation,
  useGetEventsQuery,
} from "@/entities/monitoring";
import { Can } from "@/entities/role";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

function formatConfidence(c0to1?: number) {
  const v = Math.max(0, Math.min(1, c0to1 ?? 0)) * 100;
  const pct = `${v.toFixed(1)}%`;
  const cls =
    v >= 80 ? "text-green-600" : v >= 50 ? "text-yellow-600" : "text-red-600";
  return <span className={cls}>{pct}</span>;
}

export function MonitoringDetails() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/_auth/monitoring/$id" });
  const { data: events = [] } = useGetEventsQuery();
  const event = events.find((e) => e.event_id === id) as
    | MonitoringEventRaw
    | undefined;

  const [approve, { isLoading: approving }] = useApproveEventMutation();

  if (!event) {
    return (
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Событие не найдено</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Проверьте ссылку или вернитесь на список мониторинга.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const cameraStr = `${event.camera_host}:${event.camera_id}`;

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Crop image</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={event.crop_image_url}
              alt="crop"
              className="w-full max-h-[420px] object-contain rounded-lg border"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Full frame</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={event.frame_image_url ?? ""}
              alt="frame"
              className="w-full max-h-[420px] object-contain rounded-lg border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">ID</div>
              <div className="font-medium break-all">{event.event_id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Камера</div>
              <div className="font-medium">{cameraStr}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Точность</div>
              <div className="text-4xl font-bold">
                {formatConfidence(event.recognition_confidence ?? 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Дата/время</div>
              <div className="font-medium">
                {new Date(event.datetime).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/monitoring" })}
        >
          ← Назад
        </Button>
        <Can req={{ anyOf: ["monitoring-approve", "monitoring-reject"] }}>
          <Button
            variant="success"
            onClick={() => {
              approve({ eventId: event.event_id, isApproved: true });
              navigate({ to: "/monitoring" });
            }}
            disabled={approving}
          >
            ✅ Подтвердить
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              approve({ eventId: event.event_id, isApproved: false });
              navigate({ to: "/monitoring" });
            }}
            disabled={approving}
          >
            🛑 Отклонить
          </Button>
        </Can>
      </div>
    </div>
  );
}
