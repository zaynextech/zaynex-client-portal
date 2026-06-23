"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { requestAccountDeletion } from "@/features/settings/actions/request-account-deletion";

export function RequestAccountDeletionButton() {
  const [pending, startTransition] =
    useTransition();

  const handleClick = () => {
    startTransition(
      async () => {
        try {
          await requestAccountDeletion();

          toast.success(
            "Account deletion request submitted"
          );
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to submit request"
          );
        }
      }
    );
  };

  return (
    <Button
      variant="destructive"
      onClick={handleClick}
      disabled={pending}
    >
      {pending
        ? "Submitting..."
        : "Request"}
    </Button>
  );
}