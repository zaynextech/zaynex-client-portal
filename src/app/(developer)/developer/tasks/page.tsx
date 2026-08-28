import {
  CheckCircle2,
  Clock,
  Sparkles,
  ListTodo,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { DeveloperTaskCard } from "@/features/tasks/components/developer-task-card";

export default async function DeveloperTasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch tasks with linked project details
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
      project_id,
      projects (
        id,
        name
      )
    `)
    .eq("assigned_to", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const taskList = tasks ?? [];
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = taskList.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingTasks = taskList.filter((t) => t.status === "PENDING").length;

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="My Tasks & Assignments"
        description="Track active deliverables, update milestone statuses, and manage deadlines."
      />

      {/* Task Telemetry Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Queue
            </span>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {totalTasks}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Progress
            </span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-3xl">
            {inProgressTasks}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending
            </span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 sm:text-3xl">
            {pendingTasks}
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Completed
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
            {completedTasks}
          </p>
        </div>
      </div>

      {/* Main Task List */}
      {taskList.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-bold tracking-tight text-foreground">
            No Tasks Assigned
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
            You currently have no tasks assigned to your queue. You&apos;ll be notified when new tasks are added.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {taskList.map((task) => (
            <DeveloperTaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}