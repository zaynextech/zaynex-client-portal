"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface Developer {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  project_id: string | null;
}

interface EditTaskFormProps {
  task: Task;
  developers: Developer[];
  projects: Project[];
}

export function EditTaskForm({
  task,
  developers,
  projects,
}: EditTaskFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description ?? ""
  );
  const [developer, setDeveloper] = useState(
    task.assigned_to ?? ""
  );
  const [project, setProject] = useState(
    task.project_id ?? ""
  );
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [dueDate, setDueDate] = useState(
    task.due_date
      ? task.due_date.split("T")[0]
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            assigned_to: developer || null,
            project_id: project || null,
            priority,
            status,
            due_date: dueDate || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update task."
        );
      }

      router.push(`/admin/tasks/${task.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* BASIC INFORMATION */}
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium">
              Task Title
            </label>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* ASSIGNMENT */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">
          Assignment
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Developer
            </label>

            <select
              value={developer}
              onChange={(event) =>
                setDeveloper(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">
                Unassigned
              </option>

              {developers.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.full_name ||
                    item.email ||
                    "Developer"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Project
            </label>

            <select
              value={project}
              onChange={(event) =>
                setProject(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="">
                No project
              </option>

              {projects.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TASK SETTINGS */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold">
          Task Settings
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            >
              <option value="PENDING">
                Pending
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm"
            />
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(`/admin/tasks/${task.id}`)
          }
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}