"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

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

import { deletePortfolioProject } from "@/features/portfolio/actions/delete-portfolio-project";

interface Props {
  projectId: string;
}

export function DeletePortfolioButton({
  projectId,
}: Props) {
  const router =
    useRouter();

  const [
    pending,
    startTransition,
  ] = useTransition();

  const handleDelete = () => {
    startTransition(
      async () => {
        await deletePortfolioProject(
          projectId
        );

        router.push(
          "/admin/portfolio"
        );

        router.refresh();
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        asChild
      >
        <Button
          variant="destructive"
          size="sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Portfolio Project
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action
            cannot be
            undone. The
            portfolio project
            will be
            permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={
              handleDelete
            }
            disabled={
              pending
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