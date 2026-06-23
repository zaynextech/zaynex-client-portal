"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function GlobalSearchDialog() {
  const router =
    useRouter();

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    const handleKeyboard = (
      e: KeyboardEvent
    ) => {
      if (
        e.key.toLowerCase() ===
          "k" &&
        (e.ctrlKey ||
          e.metaKey)
      ) {
        e.preventDefault();

        setOpen(
          (prev) => !prev
        );
      }
    };

    const handleOpen = () =>
      setOpen(true);

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

  const navigate = (
    href: string
  ) => {
    router.push(href);

    setOpen(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Search projects, clients, invoices..." />

      <CommandList>
        <CommandEmpty>
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/projects"
              )
            }
          >
            Projects
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/clients"
              )
            }
          >
            Clients
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/invoices"
              )
            }
          >
            Invoices
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/tickets"
              )
            }
          >
            Support Tickets
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/analytics"
              )
            }
          >
            Analytics
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/emails"
              )
            }
          >
            Emails
          </CommandItem>

          <CommandItem
            onSelect={() =>
              navigate(
                "/admin/notifications"
              )
            }
          >
            Notifications
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}