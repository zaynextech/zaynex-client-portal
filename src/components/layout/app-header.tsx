import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/components/shared/user-menu";
import { NotificationBell } from "@/components/shared/notification-bell";
import { GlobalSearchButton } from "@/components/shared/global-search-button";
import { GlobalSearchDialog } from "@/components/shared/global-search-dialog";
import Link from "next/link";
import {
  CalendarPlus,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";

interface AppHeaderProps {
  title?: string;
  sidebar?: React.ReactNode;
}

type UserRole =
  | "ADMIN"
  | "DEVELOPER"
  | "SELLER"
  | "CLIENT";

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
  let isDeveloper = false;
  let isSeller = false;
  let isClient = false;

  let isOwner = false;

  if (user) {
    /*
     * ============================================================
     * 1. NOTIFICATIONS
     * ============================================================
     */

    const { count } = await supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    unreadCount = count ?? 0;

    /*
     * ============================================================
     * 2. USER PROFILE
     * ============================================================
     */

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role =
      profile?.role?.toUpperCase() as UserRole | undefined;

    /*
     * ============================================================
     * 3. ROLE DETECTION
     * ============================================================
     */

    isAdmin = role === "ADMIN";

    isDeveloper = role === "DEVELOPER";

    isSeller = role === "SELLER";

    isClient = role === "CLIENT";

    /*
     * ============================================================
     * 4. OWNER
     * ============================================================
     */

    isOwner =
      user.email?.toLowerCase() ===
      "gkasmiro@gmail.com";

    /*
     * ============================================================
     * 5. NOTIFICATION ROUTING
     * ============================================================
     */

    if (isAdmin) {
      notificationHref = "/admin/notifications";
    } else if (isDeveloper) {
      notificationHref = "/developer/notifications";
    } else if (isSeller) {
      notificationHref = "/seller/notifications";
    } else if (isClient) {
      notificationHref = "/client/notifications";
    }
  }

  /*
   * ==============================================================
   * MEETING ROUTE
   * ==============================================================
   */

  const meetingsHref = isAdmin
    ? "/admin/meetings"
    : isDeveloper
      ? "/developer/meetings"
      : isSeller
        ? "/seller/meetings"
        : "/client/meetings";

  return (
    <>
      {/* GLOBAL SEARCH */}
      <GlobalSearchDialog />

      {/* HEADER */}
      <header className="sticky top-0 z-40 h-14 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sm:h-16">
        <div className="flex h-full items-center justify-between px-3 sm:px-4 md:px-6">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            {/* MOBILE SIDEBAR */}
            {sidebar && (
              <div className="shrink-0">
                {sidebar}
              </div>
            )}

            {/* PAGE TITLE */}
            {title && (
              <h1 className="max-w-35 truncate text-sm font-semibold tracking-tight sm:max-w-xs sm:text-lg md:max-w-none">
                {title}
              </h1>
            )}
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="flex items-center gap-1 sm:gap-2.5">

            {/* =================================================
                OWNER / ADMIN MANAGEMENT
            ================================================== */}

            {isOwner && (
              <>
                {/* DESKTOP */}
                <Link
                  href="/admin/admins"
                  className="hidden items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors hover:bg-muted dark:border-zinc-800 md:flex"
                >
                  Admins
                </Link>

                {/* MOBILE */}
                <Link
                  href="/admin/admins"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-zinc-800 sm:h-9 sm:w-9 md:hidden"
                  title="Admin Management"
                >
                  <ShieldAlert className="h-4 w-4" />
                </Link>
              </>
            )}

              {/* =================================================
                  MEETINGS - DESKTOP
              ================================================== */}

              {(isAdmin || isClient) && (
                <Link
                  href={meetingsHref}
                  className="hidden items-center gap-2 rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors hover:bg-muted dark:border-zinc-800 md:flex"
                >
                  <CalendarPlus className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Meetings</span>
                </Link>
              )}

              {/* =================================================
                  MEETINGS - MOBILE
              ================================================== */}

              {(isAdmin || isClient) && (
                <Link
                  href={meetingsHref}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground dark:border-zinc-800 sm:h-9 sm:w-9 md:hidden"
                  title="Meetings Dashboard"
                >
                  <CalendarDays className="h-4 w-4" />
                </Link>
              )}

            {/* =================================================
                BOOK MEETING - CLIENT / STAFF
            ================================================== */}

            {!isAdmin && (
              <Link
                href="/book-meeting"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90 sm:h-9 sm:w-9 md:hidden"
                title="Book Meeting"
              >
                <CalendarPlus className="h-4 w-4" />
              </Link>
            )}

            {/* MOBILE DIVIDER */}

            <div className="mx-0.5 h-4 w-px bg-zinc-200 dark:bg-zinc-800 md:hidden" />

            {/* =================================================
                GLOBAL SEARCH
            ================================================== */}

            <GlobalSearchButton />

            {/* =================================================
                NOTIFICATIONS
            ================================================== */}

            <NotificationBell
              count={unreadCount}
              href={notificationHref}
            />

            {/* =================================================
                THEME
            ================================================== */}

            <ThemeToggle />

            {/* =================================================
                USER MENU
            ================================================== */}

            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}