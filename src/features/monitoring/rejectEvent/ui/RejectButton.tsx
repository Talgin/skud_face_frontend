import { useApproveEventMutation } from "@/entities/monitoring";
import { currentUsername } from "@/entities/session";
import { Button } from "@/shared/ui/button";

interface RejectButtonProps {
  eventId: string;
}

export function RejectButton({ eventId }: RejectButtonProps) {
  const [rejectEvent, { isLoading }] = useApproveEventMutation();

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectEvent({ eventId, isApproved: false, reviewedBy: currentUsername() });
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
