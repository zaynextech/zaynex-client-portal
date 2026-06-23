"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { requestPasswordReset } from "@/features/settings/actions/request-password-reset";

export function ResetPasswordButton() {
  const [pending, startTransition] =
    useTransition();

  const handleClick = () => {
    startTransition(
      async () => {
        try {
          await requestPasswordReset();

          toast.success(
            "Password reset email sent"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to send reset email"
          );
        }
      }
    );
  };

  return (
    <Button
      onClick={handleClick}
      disabled={pending}
    >
      {pending
        ? "Sending..."
        : "Send Reset Email"}
    </Button>
  );
}