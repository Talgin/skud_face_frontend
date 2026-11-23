import { Languages } from "lucide-react";
import {
  getLang,
  LANG_LABELS,
  LANGS,
  type Lang,
  setLang,
  t,
} from "@/shared/i18n";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function LanguageSwitcher({ className }: { className?: string }) {
  const lang = getLang();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={className}
          aria-label={t("Язык интерфейса")}
          title={t("Язык интерфейса")}
        >
          <Languages className="h-4 w-4 mr-1.5" />
          {LANG_LABELS[lang].short}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((l: Lang) => (
          <DropdownMenuItem
            key={l}
            className="hover:cursor-pointer"
            onClick={() => setLang(l)}
          >
            <span className="w-10 text-xs text-muted-foreground">
              {LANG_LABELS[l].short}
            </span>
            <span className={l === lang ? "font-semibold" : ""}>
              {LANG_LABELS[l].name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
