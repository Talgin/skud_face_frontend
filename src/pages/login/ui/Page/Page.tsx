import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LoginForm } from "@/features/session/login";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

export function LoginPage() {
  const { location } = useRouterState();
  const navigate = useNavigate();

  function onComplete() {
    // @ts-expect-error: returnUrl is an extra property potentially set elsewhere
    navigate({ to: (location.state?.returnUrl as string) ?? "/" });
  }
  return (
    <div className="container flex justify-center pt-16">
      <Card className="xl:w-6/12 w-full">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onComplete={onComplete} />
        </CardContent>
      </Card>
    </div>
  );
}
