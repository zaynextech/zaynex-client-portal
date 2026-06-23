import { createClient } from "@/lib/supabase/server";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { NotificationBell } from "@/components/shared/notification-bell";
import { GlobalSearchButton } from "@/components/shared/global-search-button";
import { GlobalSearchDialog } from "@/components/shared/global-search-dialog";

import Link from "next/link";
import { CalendarPlus, CalendarDays } from "lucide-react";

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

  if (user) {
    const { count } = await supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    unreadCount = count ?? 0;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "ADMIN";

    notificationHref = isAdmin
      ? "/admin/notifications"
      : "/client/notifications";
  }

  return (
    <>
      <GlobalSearchDialog />

      <header className="sticky top-0 z-40 h-16 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">
          
          {/* ================= LEFT CONTROLS ================= */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Sidebar mobile/desktop injection */}
            {sidebar && <div className="shrink-0">{sidebar}</div>}

            {title && (
              <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate max-w-35 sm:max-w-75 md:max-w-none">
                {title}
              </h1>
            )}
          </div>

          {/* ================= RIGHT CONTROLS ================= */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Desktop Action: Meetings Dashboard */}
            <Link
              href={isAdmin ? "/admin/meetings" : "/client/meetings"}
              className="hidden md:flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              <CalendarPlus className="h-4 w-4" />
              Meetings
            </Link>



            {/* Mobile Action Fallbacks (Icons display only on smaller screens) */}
            <Link
              href={isAdmin ? "/admin/meetings" : "/client/meetings"}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title="Meetings Dashboard"
            >
              <CalendarDays className="h-4 w-4" />
            </Link>

            {!isAdmin && (
              <Link
                href="/book-meeting"
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                title="Book Meeting"
              >
                <CalendarPlus className="h-4 w-4" />
              </Link>
            )}

            {/* Divider Line on Mobile to separate shortcuts from utility status icons */}
            <div className="h-4 w-px bg-border md:hidden mx-0.5" />

            {/* Core Utilities */}
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