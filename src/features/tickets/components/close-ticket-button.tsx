"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { closeTicket } from "@/features/tickets/actions/close-ticket";

interface Props {
  ticketId: string;
}

export function CloseTicketButton({
  ticketId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleClose = async () => {
    try {
      setLoading(true);

      await closeTicket(
        ticketId
      );

      toast.success(
        "Ticket closed"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to close ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      disabled={loading}
      onClick={handleClose}
    >
      {loading
        ? "Closing..."
        : "Close Ticket"}
    </Button>
  );
}