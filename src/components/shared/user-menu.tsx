"use client";

import { useRouter } from "next/navigation";

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

  const displayName =
    fullName?.trim() ||
    "User";

  const initials =
    displayName
      .split(" ")
      .map(
        (name) => name[0]
      )
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const profilePath =
    role === "ADMIN"
      ? "/admin/profile"
      : "/client/profile";

  const dashboardPath =
    role === "ADMIN"
      ? "/admin"
      : "/client";

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/auth/login");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={
                avatarUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&background=random`
              }
              alt={displayName}
            />

            <AvatarFallback>
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">
              {displayName}
            </span>

            <span className="text-xs text-muted-foreground">
              {role}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            router.push(
              dashboardPath
            )
          }
        >
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            router.push(
              profilePath
            )
          }
        >
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}