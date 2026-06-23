"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { sendMessage } from "@/features/support/actions/send-message";

interface SendMessageFormProps {
  ticketId: string;
}

export function SendMessageForm({
  ticketId,
}: SendMessageFormProps) {
  const [message, setMessage] =
    useState("");

  const [pending, startTransition] =
    useTransition();

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error(
        "Message cannot be empty"
      );

      return;
    }

    startTransition(
      async () => {
        try {
          await sendMessage({
            ticketId,
            message,
          });

          setMessage("");

          toast.success(
            "Message sent"
          );

          window.location.reload();
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to send message"
          );
        }
      }
    );
  };

  return (
    <div className="mt-6 space-y-3 border-t pt-6">
      <Textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }
        rows={4}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={
            pending ||
            !message.trim()
          }
        >
          {pending
            ? "Sending..."
            : "Send Message"}
        </Button>
      </div>
    </div>
  );
}