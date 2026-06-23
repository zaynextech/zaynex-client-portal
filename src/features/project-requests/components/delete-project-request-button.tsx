"use client";

import { useTransition } from "react";

import { toast } from "sonner";

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

import { Button } from "@/components/ui/button";

import { deleteProjectRequest } from "@/features/project-requests/actions/delete-project-request";

export function DeleteProjectRequestButton({
  requestId,
}: {
  requestId: string;
}) {
  const [pending, startTransition] =
    useTransition();

  const handleDelete = () => {
    startTransition(
      async () => {
        try {
          await deleteProjectRequest(
            requestId
          );

          toast.success(
            "Project request deleted"
          );

          window.location.reload();
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Delete failed"
          );
        }
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button
          size="sm"
          variant="destructive"
        >
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Project Request?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be
            undone. The project
            request will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={pending}
            onClick={
              handleDelete
            }
          >
            {pending
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}