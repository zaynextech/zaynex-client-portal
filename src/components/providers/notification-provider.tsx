"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function NotificationProvider() {
  const router =
    useRouter();

  useEffect(() => {
    const supabase =
      createClient();

    const channel =
      supabase
        .channel(
          "notifications"
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "notifications",
          },
          () => {
            router.refresh();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [router]);

  return null;
}