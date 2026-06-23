"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { approveProjectRequest } from "@/features/project-requests/actions/approve-project-request";

interface ApproveProjectRequestButtonProps {
  requestId: string;
}

export function ApproveProjectRequestButton({
  requestId,
}: ApproveProjectRequestButtonProps) {
  const [pending, startTransition] =
    useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(
          async () => {
            try {
              await approveProjectRequest(
                requestId
              );

              toast.success(
                "Project request approved"
              );
            } catch (error) {
              console.error(error);

              toast.error(
                "Failed to approve request"
              );
            }
          }
        )
      }
    >
      {pending
        ? "Approving..."
        : "Approve"}
    </Button>
  );
}