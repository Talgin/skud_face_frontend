import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";

import { BrandMark, BrandWordmark } from "@/shared/ui/brand-mark";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Menu } from "./menu";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="dark sm:w-72 px-3 h-full flex flex-col bg-background text-foreground border-border"
        side="left"
      >
        <SheetHeader>
          <Link to="/" className="flex items-center gap-3 px-2 pb-2 pt-1">
            <BrandMark />
            <BrandWordmark />
            <SheetTitle className="sr-only">Nception Monitoring</SheetTitle>
          </Link>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
