"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { createClient } from "@/lib/supabase/client";

type UserRole =
  | "ADMIN"
  | "DEVELOPER"
  | "SELLER"
  | "CLIENT";

interface SearchItem {
  label: string;
  href: string;
}

export function GlobalSearchDialog() {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role) {
        setRole(
          profile.role.toUpperCase() as UserRole
        );
      }
    };

    loadRole();
  }, [supabase]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "k" &&
        (e.ctrlKey || e.metaKey)
      ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleOpen = () => {
      setOpen(true);
    };

    document.addEventListener(
      "keydown",
      handleKeyboard
    );

    window.addEventListener(
      "open-global-search",
      handleOpen
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyboard
      );

      window.removeEventListener(
        "open-global-search",
        handleOpen
      );
    };
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const getSearchItems = (): SearchItem[] => {
    switch (role) {
      case "ADMIN":
        return [
          {
            label: "Projects",
            href: "/admin/projects",
          },
          {
            label: "Clients",
            href: "/admin/clients",
          },
          {
            label: "Invoices",
            href: "/admin/invoices",
          },
          {
            label: "Support Tickets",
            href: "/admin/tickets",
          },
          {
            label: "Analytics",
            href: "/admin/analytics",
          },
          {
            label: "Emails",
            href: "/admin/emails",
          },
          {
            label: "Notifications",
            href: "/admin/notifications",
          },
        ];

      case "DEVELOPER":
        return [
          {
            label: "Projects",
            href: "/developer/projects",
          },
          {
            label: "Files",
            href: "/developer/files",
          },
          {
            label: "Support",
            href: "/developer/support",
          },
          {
            label: "Notifications",
            href: "/developer/notifications",
          },
        ];

      case "SELLER":
        return [
          {
            label: "Projects",
            href: "/seller/projects",
          },
          {
            label: "Files",
            href: "/seller/files",
          },
          {
            label: "Support",
            href: "/seller/support",
          },
          {
            label: "Notifications",
            href: "/seller/notifications",
          },
        ];

      case "CLIENT":
        return [
          {
            label: "Projects",
            href: "/client/projects",
          },
          {
            label: "Files",
            href: "/client/files",
          },
          {
            label: "Invoices",
            href: "/client/invoices",
          },
          {
            label: "Support",
            href: "/client/support",
          },
          {
            label: "Notifications",
            href: "/client/notifications",
          },
        ];

      default:
        return [];
    }
  };

  const searchItems = getSearchItems();

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Search navigation..."
      />

      <CommandList>
        <CommandEmpty>
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Navigation">
          {searchItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() =>
                navigate(item.href)
              }
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}