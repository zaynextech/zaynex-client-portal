"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { freezeClient } from "@/features/clients/actions/freeze-client";

interface FreezeClientButtonProps {
  clientId: string;
}

export function FreezeClientButton({
  clientId,
}: FreezeClientButtonProps) {
  const [pending, startTransition] =
    useTransition();

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(
          async () => {
            try {
              await freezeClient(
                clientId
              );

              toast.success(
                "Client account frozen"
              );

              window.location.reload();
            } catch (error) {
              console.error(error);

              toast.error(
                "Failed to freeze account"
              );
            }
          }
        )
      }
    >
      {pending
        ? "Freezing..."
        : "Freeze Account"}
    </Button>
  );
}