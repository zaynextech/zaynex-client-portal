"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

interface Props {
  ticketId: string;
}

export function TicketChat({
  ticketId,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    const supabase =
      createClient();

    const channel =
      supabase
        .channel(
          `ticket-${ticketId}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "ticket_messages",
            filter: `ticket_id=eq.${ticketId}`,
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
  }, [ticketId, router]);

  return null;
}