import { useApproveEventMutation } from "@/entities/monitoring";
import { Button } from "@/shared/ui/button";

interface ConfirmButtonProps {
  eventId: string;
}

export function ConfirmButton({ eventId }: ConfirmButtonProps) {
  const [confirmEvent, { isLoading }] = useApproveEventMutation();

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmEvent({ eventId, isApproved: true });
  };

  return (
    <Button
      variant="success"
      size="sm"
      onClick={handleConfirm}
      disabled={isLoading}
    >
      ✅ Подтвердить
    </Button>
  );
}
