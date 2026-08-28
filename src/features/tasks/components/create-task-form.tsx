"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTask } from "@/features/tasks/actions";

interface Developer {
  id: string;
  full_name: string | null;
  email: string;
}

interface Project {
  id: string;
  name: string;
}

interface Props {
  developers: Developer[];
  projects: Project[];
}

export function CreateTaskForm({
  developers,
  projects,
}: Props) {
  const [pending, startTransition] =
    useTransition();

const handleSubmit = (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  startTransition(async () => {
    try {
      await createTask(formData);

      toast.success("Task created");

      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create task"
      );
    }
  });
};
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-5 rounded-xl border p-6"
    >
      <Input
        name="title"
        placeholder="Task title"
        required
      />

      <textarea
        name="description"
        placeholder="Task description"
        className="min-h-28 w-full rounded-xl border bg-background p-3 text-sm outline-none"
      />

      <select
        name="project_id"
        required
        className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
      >
        <option value="">
          Select project
        </option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.id}
          >
            {project.name}
          </option>
        ))}
      </select>

      <select
        name="assigned_to"
        required
        className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
      >
        <option value="">
          Assign developer
        </option>

        {developers.map((developer) => (
          <option
            key={developer.id}
            value={developer.id}
          >
            {developer.full_name ||
              developer.email}
          </option>
        ))}
      </select>

      <select
        name="priority"
        defaultValue="MEDIUM"
        className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <Input
        name="due_date"
        type="date"
      />

      <Button
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Creating..."
          : "Create Task"}
      </Button>
    </form>
  );
}