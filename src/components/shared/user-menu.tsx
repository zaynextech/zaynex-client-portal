"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  User,
  LogOut,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { createClient } from "@/lib/supabase/client";

interface UserMenuProps {
  role?: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

export function UserMenu({
  role = "CLIENT",
  fullName,
  avatarUrl,
}: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName =
    fullName?.trim() ||
    (role === "ADMIN" ? "Administrator" : "Client");

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const profilePath = role === "ADMIN" ? "/admin/profile" : "/client/profile";
  const dashboardPath = role === "ADMIN" ? "/admin" : "/client";

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        return;
      }

      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="outline-none focus:outline-none transition-transform active:scale-95 rounded-full p-0.5"
          aria-label="User menu"
        >
          {/* Responsive downscaling sizes matching the compact design system */}
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <AvatarImage
              src={
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&background=030303&color=ffffff`
              }
              alt={displayName}
            />
            <AvatarFallback className="text-[10px] sm:text-xs font-bold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 p-1.5 shadow-md bg-background"
      >
        <DropdownMenuLabel className="px-2.5 py-2">
          <div className="flex flex-col space-y-0.5">
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground truncate">
              {displayName}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
              {role === "ADMIN" ? "Administrator" : "Client Portal"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

        <DropdownMenuItem asChild>
          <Link
            href={dashboardPath}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer text-foreground hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={profilePath}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer text-foreground hover:bg-muted"
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Profile Setting</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}