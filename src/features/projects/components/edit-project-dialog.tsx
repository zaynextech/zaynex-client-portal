"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateProject } from "@/features/projects/actions/update-project";

interface EditProjectDialogProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number | null;
    budget: number | null;
    start_date: string | null;
    due_date: string | null;
  };
}

export function EditProjectDialog({
  project,
}: EditProjectDialogProps) {
  const [open, setOpen] =
    useState(false);

  const [pending, startTransition] =
    useTransition();

  const [name, setName] =
    useState(project.name);

  const [
    description,
    setDescription,
  ] = useState(
    project.description ?? ""
  );

  const [status, setStatus] =
    useState(project.status);

  const [progress, setProgress] =
    useState(
      project.progress ?? 0
    );

  const [budget, setBudget] =
    useState(
      project.budget ?? 0
    );

  const [
    startDate,
    setStartDate,
  ] = useState(
    project.start_date
      ?.split("T")[0] ?? ""
  );

  const [dueDate, setDueDate] =
    useState(
      project.due_date
        ?.split("T")[0] ?? ""
    );

  const handleSave = () => {
    startTransition(
      async () => {
        try {
          await updateProject({
            id: project.id,
            name,
            description,
            status,
            progress:
              Number(progress),
            budget:
              Number(budget),
            start_date:
              startDate || null,
            due_date:
              dueDate || null,
          });

          toast.success(
            "Project updated successfully"
          );

          setOpen(false);

          window.location.reload();
        } catch (error) {
          console.error(error);

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update project"
          );
        }
      }
    );
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        onClick={() =>
          setOpen(true)
        }
      >
        Edit Project
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl border bg-background p-6">
        <h2 className="mb-6 text-xl font-semibold">
          Edit Project
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Project Name
            </label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="min-h-28 w-full rounded-md border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <Input
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Progress (%)
            </label>

            <Input
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(e) =>
                setProgress(
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Budget
            </label>

            <Input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(
                  Number(
                    e.target.value
                  )
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Start Date
            </label>

            <Input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Due Date
            </label>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={
              handleSave
            }
            disabled={pending}
          >
            {pending
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}