"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { unfreezeClient } from "@/features/clients/actions/unfreeze-client";

interface Props {
  clientId: string;
}

export function UnfreezeClientButton({
  clientId,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(
          async () => {
            try {
              await unfreezeClient(
                clientId
              );

              toast.success(
                "Client account unfrozen"
              );

              window.location.reload();
            } catch (error) {
              console.error(error);

              toast.error(
                "Failed to unfreeze account"
              );
            }
          }
        )
      }
    >
      {pending
        ? "Unfreezing..."
        : "Unfreeze Account"}
    </Button>
  );
}