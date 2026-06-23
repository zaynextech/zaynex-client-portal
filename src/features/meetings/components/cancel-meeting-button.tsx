"use client";

import { useTransition } from "react";

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

import { cancelClientMeeting } from "@/features/meetings/actions/cancel-client-meeting";

export function CancelMeetingButton({
  id,
}: {
  id: string;
}) {
  const [pending, startTransition] =
    useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
        >
          Cancel
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Cancel Meeting?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This meeting will be marked as cancelled.
            You can book another meeting later if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Keep Meeting
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={pending}
            onClick={() =>
              startTransition(
                async () => {
                  await cancelClientMeeting(
                    id
                  );
                }
              )
            }
          >
            {pending
              ? "Cancelling..."
              : "Cancel Meeting"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}