"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteTicket } from "@/features/support/actions/delete-ticket";

interface DeleteTicketButtonProps {
  ticketId: string;
}

export function DeleteTicketButton({
  ticketId,
}: DeleteTicketButtonProps) {
  const [pending, startTransition] =
    useTransition();

  async function handleDelete() {
    try {
      await deleteTicket(
        ticketId
      );

      toast.success(
        "Conversation deleted"
      );

      window.location.href =
        "/admin/support";
    } catch {
      toast.error(
        "Failed to delete conversation"
      );
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={pending}
        >
          Delete Conversation
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Conversation?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
            All messages in this conversation
            will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Keep Conversation
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={pending}
            onClick={() =>
              startTransition(
                handleDelete
              )
            }
          >
            {pending
              ? "Deleting..."
              : "Delete Conversation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}