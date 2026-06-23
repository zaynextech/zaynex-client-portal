"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
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
} as const;

interface AppSidebarProps {
  title: string;
  items: readonly NavItem[];
}

export function AppSidebar({ items }: AppSidebarProps) {
  const pathname = usePathname();
  const [isFolded, setIsFolded] = useState(false);

  return (
    <motion.aside
      layout
      animate={{ width: isFolded ? "72px" : "256px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden h-screen flex-col border-r bg-background md:flex relative shrink-0"
    >
      {/* Sidebar Header Section */}
      <div className={cn(
        "flex h-16 items-center border-b px-4 transition-all duration-200 relative",
        isFolded ? "justify-center" : "justify-between"
      )}>
        {/* Adaptive Logo containing internal structural animations */}
        <Logo isFolded={isFolded} />

        {/* Collapse Toggle Button - visible only when expanded */}
        {!isFolded && (
          <button
            onClick={() => setIsFolded(true)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-popover text-muted-foreground shadow-sm transition-colors hover:bg-accent ml-2 cursor-pointer"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Floating Expand Toggle Button - Positioned outside container limits to bypass overflow clipping */}
      {isFolded && (
        <button
          onClick={() => setIsFolded(false)}
          className="absolute -right-3 top-5 z-50 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
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

          return (
            <Link
              key={item.url}
              href={item.url}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                active 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-muted  hover:text-foreground",
                isFolded && "justify-center px-0 h-10 w-10 mx-auto"
              )}
              title={isFolded ? item.title : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isFolded && "h-5 w-5")} />

              <AnimatePresence mode="wait">
                {!isFolded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate whitespace-nowrap select-none"
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