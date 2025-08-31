import { useRejectEventMutation } from "@/entities/monitoring";
import { Button } from "@/shared/ui/button";

interface RejectButtonProps {
  eventId: string;
}

export function RejectButton({ eventId }: RejectButtonProps) {
  const [rejectEvent, { isLoading }] = useRejectEventMutation();

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectEvent(eventId);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleReject}
      disabled={isLoading}
    >
      🛑 Отклонить
    </Button>
  );
}
