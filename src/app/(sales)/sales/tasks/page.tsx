import Link from "next/link";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function getStatusBadge(status: string) {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge variant="outline" className="text-emerald-600">
          Completed
        </Badge>
      );

    case "IN_PROGRESS":
      return (
        <Badge variant="outline" className="text-blue-600">
          In Progress
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="text-amber-600">
          Pending
        </Badge>
      );
  }
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "HIGH":
      return (
        <Badge variant="outline" className="text-red-600">
          High
        </Badge>
      );

    case "LOW":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Low
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className="text-amber-600">
          Medium
        </Badge>
      );
  }
}

export default async function SalesTasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: tasks, error } = await supabase
    .from("sales_tasks")
    .select(`
      id,
      title,
      description,
      priority,
      status,
      due_date,
      lead_id
    `)
    .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
    .order("due_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const taskList = tasks ?? [];

  const pending = taskList.filter(
    (task) => task.status === "PENDING"
  ).length;

  const inProgress = taskList.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completed = taskList.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Sales Tasks"
          description="Manage your sales follow-ups and tasks."
          action={
            <Button asChild>
              <Link href="/sales/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Pending
              </span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>

            <p className="mt-2 text-2xl font-bold">
              {pending}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                In Progress
              </span>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>

            <p className="mt-2 text-2xl font-bold">
              {inProgress}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Completed
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>

            <p className="mt-2 text-2xl font-bold">
              {completed}
            </p>
          </div>
        </div>

        {taskList.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-4 font-semibold">
              No tasks yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a task to track your sales follow-ups.
            </p>

            <Button asChild className="mt-5">
              <Link href="/sales/tasks/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {taskList.map((task) => (
              <Link
                key={task.id}
                href={`/sales/tasks/${task.id}`}
                className="block rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold">
                      {task.title}
                    </h2>

                    {task.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>

                  {task.due_date && (
                    <p className="text-xs text-muted-foreground">
                      Due:{" "}
                      {new Date(
                        task.due_date
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}