// src/features/project-requests/components/create-client-from-request-button.tsx

"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { createClientFromRequest } from "@/features/project-requests/actions/create-client-from-request";

interface CreateClientFromRequestButtonProps {
  requestId: string;
}

export function CreateClientFromRequestButton({
  requestId,
}: CreateClientFromRequestButtonProps) {
  const [pending, startTransition] =
    useTransition();

  return (
    <Button
  type="button"
  disabled={pending}
  onClick={() =>
    startTransition(async () => {
      try {
        await createClientFromRequest(
          requestId
        );

        toast.success(
          "Client account created successfully"
        );

        window.location.reload();
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create client account"
        );
      }
    })
  }
>
  {pending
    ? "Creating Account..."
    : "Create Client Account"}
</Button>
  );
}