"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { cancelAccountDeletionRequest } from "@/features/settings/actions/cancel-account-deletion-request";

export function CancelAccountDeletionButton() {
  const [pending, startTransition] =
    useTransition();

  const handleClick = () => {
    startTransition(
      async () => {
        try {
          await cancelAccountDeletionRequest();

          toast.success(
            "Deletion request cancelled"
          );

          window.location.reload();
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to cancel request"
          );
        }
      }
    );
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={pending}
    >
      {pending
        ? "Cancelling..."
        : "Cancel Request"}
    </Button>
  );
}