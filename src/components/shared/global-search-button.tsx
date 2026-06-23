"use client";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GlobalSearchButton() {
  const openSearch = () => {
    window.dispatchEvent(
      new Event(
        "open-global-search"
      )
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={openSearch}
      className="hidden items-center gap-2 md:flex"
    >
      <Search className="h-4 w-4" />

      <span>Search</span>

      <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
        Ctrl K
      </kbd>
    </Button>
  );
}