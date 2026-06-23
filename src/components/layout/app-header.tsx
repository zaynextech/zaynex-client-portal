import { createClient } from "@/lib/supabase/server";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { NotificationBell } from "@/components/shared/notification-bell";
import { GlobalSearchButton } from "@/components/shared/global-search-button";
import { GlobalSearchDialog } from "@/components/shared/global-search-dialog";

import Link from "next/link";
import { CalendarPlus, CalendarDays, ShieldAlert } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  sidebar?: React.ReactNode;
}

export async function AppHeader({
  title,
  sidebar,
}: AppHeaderProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadCount = 0;
  let notificationHref = "/auth/login";
  let isAdmin = false;
  let isOwner = false;

  if (user) {
    // 1. Fetch Notification Counts
    const { count } = await supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    unreadCount = count ?? 0;

    // 2. Fetch User Profile Context Rollups
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "ADMIN";
    isOwner = user.email === "gkasmiro@gmail.com";

    notificationHref = isAdmin
      ? "/admin/notifications"
      : "/client/notifications";
  }

  return (
    <>
      <GlobalSearchDialog />

      <header className="sticky top-0 z-40 h-14 sm:h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">
          
          {/* ================= LEFT CONTROLS ================= */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Sidebar mobile/desktop injection */}
            {sidebar && <div className="shrink-0">{sidebar}</div>}

            {title && (
              <h1 className="text-sm sm:text-lg font-semibold tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
                {title}
              </h1>
            )}
          </div>

          {/* ================= RIGHT CONTROLS ================= */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            
            {/* Action Grouping: Owner Dashboard Elements */}
            {isOwner && (
              <>
                <Link
                  href="/admin/admins"
                  className="hidden md:flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors hover:bg-muted"
                >
                  Admins
                </Link>
                <Link
                  href="/admin/admins"
                  className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  title="Admin Management"
                >
                  <ShieldAlert className="h-4 w-4" />
                </Link>
              </>
            )}

            {/* Action Grouping: Meetings Dashboards (Desktop Viewport) */}
            <Link
              href={isAdmin ? "/admin/meetings" : "/client/meetings"}
              className="hidden md:flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors hover:bg-muted"
            >
              <CalendarPlus className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Meetings</span>
            </Link>

            {/* Action Grouping: Meetings Shortcuts (Mobile Viewport Fallbacks) */}
            <Link
              href={isAdmin ? "/admin/meetings" : "/client/meetings"}
              className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Meetings Dashboard"
            >
              <CalendarDays className="h-4 w-4" />
            </Link>

            {!isAdmin && (
              <Link
                href="/book-meeting"
                className="flex md:hidden h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 shadow-sm"
                title="Book Meeting"
              >
                <CalendarPlus className="h-4 w-4" />
              </Link>
            )}

            {/* Vertical Segment Divider on Mobile Viewports */}
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 md:hidden mx-0.5" />

            {/* Core Global Utilities Actions Block */}
            <GlobalSearchButton />

            <NotificationBell
              count={unreadCount}
              href={notificationHref}
            />

            <ThemeToggle />

            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}