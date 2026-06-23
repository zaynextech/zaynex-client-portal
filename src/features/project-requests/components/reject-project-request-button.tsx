"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { rejectProjectRequest } from "@/features/project-requests/actions/reject-project-request";

interface RejectProjectRequestButtonProps {
  requestId: string;
}

export function RejectProjectRequestButton({
  requestId,
}: RejectProjectRequestButtonProps) {
  const [pending, startTransition] =
    useTransition();

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() =>
        startTransition(
          async () => {
            try {
              await rejectProjectRequest(
                requestId
              );

              toast.success(
                "Project request rejected"
              );
            } catch (error) {
              console.error(error);

              toast.error(
                "Failed to reject request"
              );
            }
          }
        )
      }
    >
      {pending
        ? "Rejecting..."
        : "Reject"}
    </Button>
  );
}