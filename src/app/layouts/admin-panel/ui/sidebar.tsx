"use client";
import { Link } from "@tanstack/react-router";
import { cn } from "@/shared/lib/shadcn-ui/utils";
import { BrandMark, BrandWordmark } from "@/shared/ui/brand-mark";
import { useSidebar } from "../lib/useSidebar";
import { useStore } from "../lib/useStore";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        // "dark" scopes the navy console palette to the sidebar only
        "dark fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-background text-foreground border-r border-border",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden",
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        role="toolbar"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto bg-[radial-gradient(120%_60%_at_0%_0%,hsl(var(--primary)/0.12),transparent_60%)]"
      >
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2 py-1.5 mb-2 transition-transform ease-in-out duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !getOpenState() ? "translate-x-1.5" : "translate-x-0",
          )}
        >
          <BrandMark />
          <BrandWordmark
            className={cn(
              "whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
              !getOpenState()
                ? "-translate-x-96 opacity-0 hidden"
                : "translate-x-0 opacity-100",
            )}
          />
        </Link>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
