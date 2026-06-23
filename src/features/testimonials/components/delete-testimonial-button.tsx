"use client";

import { useTransition } from "react";

import { Trash2 } from "lucide-react";

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

import { deleteTestimonial } from "@/features/testimonials/actions/delete-testimonial";

interface Props {
  id: string;
}

export function DeleteTestimonialButton({
  id,
}: Props) {
  const [
    pending,
    startTransition,
  ] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button
          size="icon"
          variant="destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Testimonial
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action
            cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(
                async () => {
                  await deleteTestimonial(
                    id
                  );

                  location.reload();
                }
              )
            }
            disabled={
              pending
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}