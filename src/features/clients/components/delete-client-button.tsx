"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteClient } from "@/features/clients/actions/delete-client";

interface DeleteClientButtonProps {
  clientId: string;
}

export function DeleteClientButton({
  clientId,
}: DeleteClientButtonProps) {
  const router = useRouter();

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
              await deleteClient(
                clientId
              );

              toast.success(
                "Client deleted successfully"
              );

              router.replace(
                "/admin/clients"
              );

              router.refresh();
            } catch (error) {
              console.error(error);

              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to delete client"
              );
            }
          }
        )
      }
    >
      {pending
        ? "Deleting..."
        : "Delete Account"}
    </Button>
  );
}