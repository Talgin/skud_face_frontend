import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Activity, BellRing, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/features/session/login";
import {
  BRAND_NAME,
  BRAND_PRODUCT,
  BrandMark,
  BrandWordmark,
} from "@/shared/ui/brand-mark";

const FEATURES = [
  {
    icon: Activity,
    title: "Мониторинг в реальном времени",
    text: "Распознавание лиц на всех подключённых камерах",
  },
  {
    icon: BellRing,
    title: "События и история",
    text: "Каждое появление сохраняется с кадром и временем",
  },
  {
    icon: ShieldCheck,
    title: "Контроль доступа",
    text: "База лиц, точки прохода и роли сотрудников",
  },
];

export function LoginPage() {
  const { location } = useRouterState();
  const navigate = useNavigate();

  function onComplete() {
    // @ts-expect-error: returnUrl is an extra property potentially set elsewhere
    navigate({ to: (location.state?.returnUrl as string) ?? "/" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Brand panel */}
      <aside className="dark relative hidden overflow-hidden bg-background text-foreground lg:flex lg:flex-col lg:justify-between p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_15%_10%,hsl(var(--primary)/0.28),transparent_60%),radial-gradient(60%_50%_at_90%_90%,rgba(34,211,238,0.16),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative flex items-center gap-3">
          <BrandMark className="h-11 w-11" iconClassName="h-6 w-6" />
          <BrandWordmark />
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Видеоаналитика
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              под полным контролем
            </span>
          </h2>
          <ul className="mt-10 space-y-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card/60">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="block text-sm text-muted-foreground">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-muted-foreground">
          {BRAND_NAME} {BRAND_PRODUCT} · Astana IT University
        </p>
      </aside>

      {/* Sign-in */}
      <main className="flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark />
            <BrandWordmark />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Вход в систему
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Введите email и пароль вашей учётной записи
          </p>
          <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
            <LoginForm onComplete={onComplete} />
          </div>
        </div>
      </main>
    </div>
  );
}
