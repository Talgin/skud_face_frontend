import { AlertCircle } from "lucide-react";
import { apiErrorMessage } from "@/shared/lib/apiErrorMessage";
import { Alert, AlertDescription } from "@/shared/ui/alert";

/** The reason a save failed, shown under a form (nothing when there is no error). */
export function ServerError({ error }: { error: unknown }) {
  const message = apiErrorMessage(error);
  if (!message) return null;
  return (
    <Alert variant="destructive" className="mt-6" role="alert">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
