import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { t } from "@/shared/i18n";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/403")({
  component: Forbidden,
});

function Forbidden() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <ShieldAlert className="h-12 w-12 text-muted-foreground" />
      <h1 className="text-xl font-semibold">{t("Нет доступа")}</h1>
      <p className="max-w-md text-muted-foreground">
        {t(
          "У вашей учётной записи нет прав на эту страницу. Если доступ нужен для работы, обратитесь к администратору.",
        )}
      </p>
      <Button asChild>
        <Link to="/monitoring">{t("На главную")}</Link>
      </Button>
    </div>
  );
}
