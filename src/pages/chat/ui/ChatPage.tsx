import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { Navbar } from "@/app/layouts/admin-panel/ui/navbar";
import { t } from "@/shared/i18n";
import { Chat } from "@/widgets/Chat";
export function ChatPage() {
  const { c } = useSearch({ from: "/_auth/chat/" });
  const navigate = useNavigate({ from: "/chat" });
  const onSelect = useCallback(
    (id: string | undefined) =>
      navigate({ search: id ? { c: id } : {}, replace: false }),
    [navigate],
  );
  return (
    <div>
      <Navbar title={t("Ассистент")} />
      <Chat convId={c} onSelect={onSelect} />
    </div>
  );
}
