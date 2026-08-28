"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteTask } from "@/features/tasks/actions";

interface Props {
  taskId: string;
}

export function DeleteTaskButton({
  taskId,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      try {
        await deleteTask(taskId);

        toast.success("Task deleted");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete task"
        );
      }
    });
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="destructive"
      disabled={pending}
      onClick={handleDelete}
    >
      <Trash2 className="mr-2 h-4 w-4" />

      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}