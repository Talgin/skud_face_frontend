import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import { Navbar } from "@/app/layouts/admin-panel/ui/navbar";
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
      <Navbar title="Ассистент" />
      <Chat convId={c} onSelect={onSelect} />
    </div>
  );
}
