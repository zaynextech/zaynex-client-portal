"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { sendTicketMessage } from "@/features/tickets/actions/send-ticket-message";

interface TicketReplyFormProps {
  ticketId: string;
}

export function TicketReplyForm({
  ticketId,
}: TicketReplyFormProps) {
  const router = useRouter();

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      setLoading(true);

      await sendTicketMessage(
        ticketId,
        message
      );

      setMessage("");

      toast.success(
        "Message sent"
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <textarea
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        placeholder="Type your message..."
        className="min-h-32 w-full rounded-md border p-3"
      />

      <Button
        type="submit"
        disabled={
          loading ||
          !message.trim()
        }
      >
        {loading
          ? "Sending..."
          : "Send Reply"}
      </Button>
    </form>
  );
}