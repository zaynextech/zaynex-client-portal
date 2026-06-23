"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Menu,
  LayoutDashboard,
  Users,
  FolderKanban,
  FolderOpen,
  Receipt,
  LifeBuoy,
  BarChart3,
  Settings,
  Trash2,
  Bell,
  Mail,
  Star,
  Briefcase,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type IconName =
  | "dashboard"
  | "clients"
  | "projects"
  | "files"
  | "invoices"
  | "support"
  | "analytics"
  | "settings"
  | "trash"
  | "bell"
  | "mail"
  | "star"
  | "briefcase";

type NavItem = {
  title: string;
  url: string;
  icon: IconName;
};

interface MobileSidebarProps {
  title: string;
  items: readonly NavItem[];
}

const icons = {
  dashboard: LayoutDashboard,
  clients: Users,
  projects: FolderKanban,
  files: FolderOpen,
  invoices: Receipt,
  support: LifeBuoy,
  analytics: BarChart3,
  settings: Settings,
  trash: Trash2,
  bell: Bell,
  mail: Mail,
  star: Star,
  briefcase: Briefcase,
} as const;

export function MobileSidebar({ title, items }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-70 p-0 flex flex-col h-full bg-background"
      >
        {/* Header Block with screen-reader friendly accessibility setup */}
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </SheetTitle>
          {/* Visually hidden description to support strict web accessibility requirements */}
          <SheetDescription className="sr-only">
            Navigation links for the client portal.
          </SheetDescription>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const active =
              pathname === item.url || pathname.startsWith(`${item.url}/`);

            return (
              <SheetClose key={item.url} asChild>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}