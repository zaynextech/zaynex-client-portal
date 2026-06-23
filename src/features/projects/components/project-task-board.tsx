"use client";

import { useTransition } from "react";

import {
  Trash2,
  ArrowRight,
} from "lucide-react";

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

import { deleteProjectTask } from "@/features/projects/actions/delete-project-task";
import { updateProjectTaskStatus } from "@/features/projects/actions/update-project-task-status";
import { VisibilityToggle } from "./visibility-toggle";

type Task = {
  id: string;
  title: string;
  description: string | null;
  visible_to_client: boolean;
  status:
    | "TODO"
    | "IN_PROGRESS"
    | "REVIEW"
    | "DONE";
};

interface Props {
  projectId: string;
  tasks: Task[];
}

const statuses = [
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
] as const;

const statusLabels = {
  TODO: "Todo",
  IN_PROGRESS:
    "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

export function ProjectTaskBoard({
  projectId,
  tasks,
}: Props) {
  const [pending, startTransition] =
    useTransition();

  const moveTask = (
    taskId: string,
    currentStatus: Task["status"]
  ) => {
    const currentIndex =
      statuses.indexOf(
        currentStatus
      );

    const nextStatus =
      statuses[
        currentIndex + 1
      ];

    if (!nextStatus) {
      return;
    }

    startTransition(
      async () => {
        await updateProjectTaskStatus(
          taskId,
          nextStatus
        );

        location.reload();
      }
    );
  };

  const removeTask = (
    taskId: string
  ) => {
    startTransition(
      async () => {
        await deleteProjectTask(
          taskId
        );

        location.reload();
      }
    );
  };

  

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {statuses.map(
        (status) => {
          const columnTasks =
            tasks.filter(
              (task) =>
                task.status ===
                status
            );

          return (
            <div
              key={status}
              className="rounded-xl border bg-muted/30 p-4"
            >
                
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                  {
                    statusLabels[
                      status
                    ]
                  }
                </h3>

                <span className="rounded-full bg-background px-2 py-1 text-xs">
                  {
                    columnTasks.length
                  }
                </span>
              </div>

              <div className="space-y-3">
                {columnTasks.map(
                  (task) => (
                    <div
                      key={
                        task.id
                      }
                      className="rounded-lg border bg-background p-3 shadow-sm"
                    >
                      <h4 className="font-medium">
                        {
                          task.title
                        }
                      </h4>

                      <div className="mt-3">
                        <VisibilityToggle
                            id={task.id}
                            projectId={projectId}
                            visible={
                            task.visible_to_client
                            }
                            table="project_tasks"
                        />
                        </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {status !==
                          "DONE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              pending
                            }
                            onClick={() =>
                              moveTask(
                                task.id,
                                task.status
                              )
                            }
                          >
                            <ArrowRight className="mr-1 h-4 w-4" />
                            Move
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger
                            asChild
                          >
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={
                                pending
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Task
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                This action
                                cannot be
                                undone. The
                                task will be
                                permanently
                                deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                Cancel
                              </AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() =>
                                  removeTask(
                                    task.id
                                  )
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                )}

                {columnTasks.length ===
                  0 && (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}