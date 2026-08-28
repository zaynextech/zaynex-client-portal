import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

export default async function AdminTasksPage() {
  const supabase = await createClient();

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      assigned_to,
      project_id,
      profiles:assigned_to (
        full_name,
        email
      ),
      projects:project_id (
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const formattedTasks = (tasks ?? []).map((task) => {
    const developer = Array.isArray(task.profiles)
      ? task.profiles[0]
      : task.profiles;

    const project = Array.isArray(task.projects)
      ? task.projects[0]
      : task.projects;

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
      created_at: task.created_at,
      assigned_to: task.assigned_to,
      project_id: task.project_id,
      developer: developer
        ? {
            full_name: developer.full_name,
            email: developer.email,
          }
        : null,
      project: project
        ? {
            name: project.name,
          }
        : null,
    };
  });

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title="Tasks"
            description="Create, assign, and manage developer tasks."
          />

          <Link
            href="/admin/tasks/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Task
          </Link>
        </div>

        {/* TASKS */}
        <SectionCard
          title={`All Tasks (${formattedTasks.length})`}
        >
          {formattedTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium">
                No tasks found.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a task to assign work to a developer.
              </p>

              <Link
                href="/admin/tasks/create"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Create your first task
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {formattedTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/admin/tasks/${task.id}`}
                  className="group block py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/20"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    {/* TASK INFO */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-semibold">
                          {task.title}
                        </h2>

                        <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase">
                          {task.status}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          Developer:{" "}
                          <span className="font-medium text-foreground">
                            {task.developer?.full_name ??
                              "Unassigned"}
                          </span>
                        </span>

                        <span>
                          Project:{" "}
                          <span className="font-medium text-foreground">
                            {task.project?.name ??
                              "No project"}
                          </span>
                        </span>

                        <span>
                          Priority:{" "}
                          <span className="font-medium text-foreground">
                            {task.priority}
                          </span>
                        </span>

                        {task.due_date && (
                          <span>
                            Due:{" "}
                            <span className="font-medium text-foreground">
                              {new Date(
                                task.due_date
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* OPEN */}
                    <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-primary">
                      Manage
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </PageContainer>
  );
}