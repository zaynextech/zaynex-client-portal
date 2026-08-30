"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
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
  UserPlus,
  
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";
import { Logo } from "@/components/ui/Logo";

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
  userPlus: UserPlus,
} as const;

interface AppSidebarProps {
  title?: string;
  items: readonly NavItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isFolded, setIsFolded] = useState(false);
  
  // useTransition manages pending route transitions natively without useEffect
  const [isPending, startTransition] = useTransition();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    // Ignore modified clicks (new tab, middle click, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    
    // Ignore if already on the active page
    if (pathname === url) return;

    e.preventDefault();
    setPendingUrl(url);

    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <motion.aside
      layout
      animate={{ width: isFolded ? "72px" : "256px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden h-screen flex-col border-r bg-background md:flex relative shrink-0"
    >
      {/* Sidebar Header Section */}
      <div
        className={cn(
          "flex h-16 items-center border-b px-4 transition-all duration-200 relative",
          isFolded ? "justify-center" : "justify-between"
        )}
      >
        <Logo isFolded={isFolded} />

        {!isFolded && (
          <button
            type="button"
            onClick={() => setIsFolded(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-popover text-muted-foreground shadow-sm transition-colors hover:bg-accent ml-2 cursor-pointer"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Floating Expand Toggle Button */}
      {isFolded && (
        <button
          type="button"
          onClick={() => setIsFolded(false)}
          className="absolute -right-3 top-5 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
          aria-label="Expand Sidebar"
        >
          <ChevronRight size={12} />
        </button>
      )}

      {/* Navigation Layout System */}
      <nav className={cn("flex-1 space-y-1 p-3 overflow-y-auto overflow-x-hidden", isFolded && "px-2")}>
        {items.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.url || pathname.startsWith(`${item.url}/`);
          const isLoading = isPending && pendingUrl === item.url;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={(e) => handleLinkClick(e, item.url)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative select-none",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted hover:text-foreground",
                isLoading && "opacity-80 pointer-events-none",
                isFolded && "justify-center px-0 h-10 w-10 mx-auto"
              )}
              title={isFolded ? item.title : undefined}
            >
              {/* Dynamic Icon / Spinner Switch */}
              {isLoading ? (
                <Loader2
                  className={cn(
                    "h-4 w-4 shrink-0 animate-spin text-cyan-500",
                    active && "text-primary-foreground",
                    isFolded && "h-5 w-5"
                  )}
                />
              ) : (
                <Icon className={cn("h-4 w-4 shrink-0", isFolded && "h-5 w-5")} />
              )}

              {/* Title & Loading Text Display */}
              <AnimatePresence mode="wait">
                {!isFolded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate whitespace-nowrap"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}