"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { deleteTask } from "@/features/tasks/actions";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  created_at: string;
  assigned_to: string;
  project_id: string;
  developer: {
    full_name: string | null;
    email: string | null;
  } | null;
  project: {
    name: string;
  } | null;
};

function formatDate(date: string | null) {
  if (!date) return "No deadline";

  const [year, month, day] = date.split("T")[0].split("-");

  return `${day}/${month}/${year}`;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteTask(deleteId);

      toast.success("Task deleted successfully");
      setDeleteId(null);

      // Refresh the current page so the deleted task disappears
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete task"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="divide-y">
        {tasks.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No tasks created yet.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="space-y-4 p-5"
            >
              {/* HEADER */}
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                    {task.status}
                  </span>

                  <span className="rounded-md border px-2.5 py-1 text-xs font-medium">
                    {task.priority}
                  </span>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteId(task.id)}
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* DETAILS */}
              <div className="grid gap-3 text-sm md:grid-cols-3">
                {/* DEVELOPER */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Developer
                  </p>

                  <p className="font-medium">
                    {task.developer?.full_name ||
                      task.developer?.email ||
                      "Unassigned"}
                  </p>
                </div>

                {/* PROJECT */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Project
                  </p>

                  <p className="font-medium">
                    {task.project?.name || "No project"}
                  </p>
                </div>

                {/* DUE DATE */}
                <div>
                  <p className="text-xs text-muted-foreground">
                    Due Date
                  </p>

                  <p className="font-medium">
                    {formatDate(task.due_date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE CONFIRMATION */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this task?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The task will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete Task"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}