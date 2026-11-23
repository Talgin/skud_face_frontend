import { useNavigate, useParams } from "@tanstack/react-router";

import {
  AgeCell,
  formatGender,
  formatSimilarity,
  type MonitoringEventRaw,
  PersonCell,
  useApproveEventMutation,
  useGetEventsQuery,
} from "@/entities/monitoring";
import { Can } from "@/entities/role";
import { currentUsername } from "@/entities/session";
import { intlLocale, t } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { EvidenceImage } from "@/shared/ui/evidence-image";

function renderSimilarity(value?: number | null, isKnown?: boolean | null) {
  const { text, className } = formatSimilarity(value, isKnown);
  return <span className={className}>{text}</span>;
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
            <CardTitle>{t("Событие не найдено")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("Проверьте ссылку или вернитесь на список мониторинга.")}
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
            <CardTitle>{t("Кадр лица")}</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceImage
              url={event.crop_image_url}
              alt="crop"
              className="w-full min-h-40 max-h-[420px] object-contain rounded-lg border"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>{t("Полный кадр")}</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceImage
              url={event.frame_image_url}
              alt="frame"
              className="w-full min-h-40 max-h-[420px] object-contain rounded-lg border"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Информация")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground">ID</div>
              <div className="font-medium break-all">{event.event_id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("Камера")}</div>
              <div className="font-medium">{cameraStr}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t("Человек")}
              </div>
              <div className="text-lg">
                <PersonCell event={event} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t("Пол")}</div>
              <div className="font-medium">{formatGender(event.gender)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t("Возраст")}
              </div>
              <div className="font-medium">
                <AgeCell event={event} />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t("Сходство")}
              </div>
              <div className="text-4xl font-bold">
                {renderSimilarity(event.recognition_confidence, event.is_known)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">
                {t("Дата/время")}
              </div>
              <div className="font-medium">
                {new Date(event.datetime).toLocaleString(intlLocale())}
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
          {t("← Назад")}
        </Button>
        <Can req={{ anyOf: ["monitoring-approve", "monitoring-reject"] }}>
          <Button
            variant="success"
            onClick={() => {
              approve({
                eventId: event.event_id,
                isApproved: true,
                reviewedBy: currentUsername(),
              });
              navigate({ to: "/monitoring" });
            }}
            disabled={approving}
          >
            {t("✅ Подтвердить")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              approve({
                eventId: event.event_id,
                isApproved: false,
                reviewedBy: currentUsername(),
              });
              navigate({ to: "/monitoring" });
            }}
            disabled={approving}
          >
            {t("🛑 Отклонить")}
          </Button>
        </Can>
      </div>
    </div>
  );
}
