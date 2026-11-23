import { ScanFace } from "lucide-react";
import { cn } from "@/shared/lib/shadcn-ui/utils";

export const BRAND_NAME = "Nception";
export const BRAND_PRODUCT = "Monitoring";

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
}

/** Gradient logo tile used in the sidebar, login page and favicon. */
export function BrandMark({ className, iconClassName }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/10",
        className,
      )}
    >
      <ScanFace className={cn("h-5 w-5", iconClassName)} strokeWidth={2.2} />
    </span>
  );
}

interface BrandWordmarkProps {
  className?: string;
}

export function BrandWordmark({ className }: BrandWordmarkProps) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        {BRAND_NAME}
      </span>
      <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {BRAND_PRODUCT}
      </span>
    </span>
  );
}
