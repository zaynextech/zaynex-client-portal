"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import { deleteTicket } from "@/features/tickets/actions/delete-ticket";

interface DeleteTicketButtonProps {
  ticketId: string;
  redirectTo?: string;
}

export function DeleteTicketButton({
  ticketId,
  redirectTo = "/admin/tickets",
}: DeleteTicketButtonProps) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteTicket(
        ticketId
      );

      toast.success(
        "Ticket deleted successfully"
      );

      router.push(
        redirectTo
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to delete ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
        >
          Delete Ticket
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Ticket?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone. The ticket and
            all associated messages
            will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}