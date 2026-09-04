import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  Zap,
  CheckSquare2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/shared/loading-button";

function getPriorityBadge(priority: string) {
  switch (priority?.toUpperCase()) {
    case "URGENT":
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          <Flame className="h-3 w-3" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
          Medium
        </span>
      );
    default:
      return (
        <span className="text-[11px] font-medium text-muted-foreground">
          Low
        </span>
      );
  }
}

export default async function DeveloperDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 1. Fetch profile metadata
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name?.split(" ")[0] ||
    user.email?.split("@")[0] ||
    "Developer";

  // 2. Fetch projects assigned to developer
  const { data: memberships, error: projectsError } = await supabase
    .from("project_members")
    .select(`
      project_id,
      projects (
        id,
        name,
        description,
        status,
        progress,
        due_date,
        start_date
      )
    `)
    .eq("user_id", user.id);

  if (projectsError) {
    throw new Error(projectsError.message);
  }

  const projects = (memberships ?? [])
    .map((membership) => {
      const project = Array.isArray(membership.projects)
        ? membership.projects[0]
        : membership.projects;
      return project;
    })
    .filter(Boolean);

  // 3. Fetch developer tasks
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      status,
      priority,
      due_date,
      project_id
    `)
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false });

  if (tasksError) {
    throw new Error(tasksError.message);
  }

  const taskList = tasks ?? [];
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter((t) => t.status === "COMPLETED").length;
  const inProgressTasks = taskList.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingTasks = taskList.filter((t) => t.status === "PENDING").length;

  const urgentTasks = taskList.filter(
    (t) =>
      (t.priority?.toUpperCase() === "HIGH" ||
        t.priority?.toUpperCase() === "URGENT") &&
      t.status !== "COMPLETED"
  );

  const focusTasks = taskList.filter((t) => t.status !== "COMPLETED").slice(0, 4);

  const velocityScore =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 4. Fetch notifications
  const { data: notifications, error: notificationsError } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4);

  if (notificationsError) {
    throw new Error(notificationsError.message);
  }

  return (
    <PageContainer>
      {/* Dynamic Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-card via-card/90 to-muted/30 p-6 shadow-xs sm:p-8">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-8 right-32 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Developer Workspace Active
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              Welcome back, {displayName}
            </h1>
            <p className="max-w-xl text-xs text-muted-foreground sm:text-sm">
              You have <strong className="text-foreground">{inProgressTasks} tasks in progress</strong> and{" "}
              <strong className="text-foreground">{urgentTasks.length} high priority items</strong> requiring attention today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <LoadingButton href="/developer/tasks" size="sm" className="gap-1.5 font-medium shadow-xs">
              <CheckSquare2 className="h-4 w-4" />
              Go to Tasks
            </LoadingButton>
            <LoadingButton href="/developer/projects" variant="outline" size="sm" className="gap-1.5 font-medium">
              <FolderKanban className="h-4 w-4" />
              Projects
            </LoadingButton>
          </div>
        </div>
      </div>

      {/* Primary Telemetry Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Active Projects */}
        <div className="group rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all duration-200 hover:border-primary/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspaces
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {projects.length}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Assigned</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="group rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all duration-200 hover:border-blue-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Progress
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-105">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-3xl">
              {inProgressTasks}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Active now</span>
          </div>
        </div>

        {/* High Priority Alerts */}
        <div className="group rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all duration-200 hover:border-rose-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Urgent / High
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 transition-transform group-hover:scale-105">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400 sm:text-3xl">
              {urgentTasks.length}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Action needed</span>
          </div>
        </div>

        {/* Task Velocity Score */}
        <div className="group rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all duration-200 hover:border-emerald-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Velocity
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-105">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
              {velocityScore}%
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              {completedTasks}/{totalTasks} done
            </span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Focus Queue & Active Workspaces */}
        <div className="space-y-6 lg:col-span-8">
          {/* Actionable Focus Queue */}
          <SectionCard
            title="Focus Queue"
            action={
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                <Link href="/developer/tasks">
                  View All Tasks ({totalTasks})
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            }
          >
            {focusTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Zero Pending Tasks
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  You are completely caught up with your current sprint queue!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {focusTasks.map((task) => {
                  const isInProgress = task.status === "IN_PROGRESS";

                  return (
                    <div
                      key={task.id}
                      className="group flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-border hover:shadow-xs sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            isInProgress
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isInProgress ? (
                            <Zap className="h-3.5 w-3.5 fill-current" />
                          ) : (
                            <Clock className="h-3.5 w-3.5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {getPriorityBadge(task.priority)}
                            <span className="flex items-center gap-1 text-[11px]">
                              <Calendar className="h-3 w-3" />
                              {task.due_date ? (
                                <span suppressHydrationWarning>
                                  Due{" "}
                                  {new Date(task.due_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              ) : (
                                "No deadline"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 border-t border-border/40 pt-2 sm:border-0 sm:pt-0">
                        <span className={`text-[11px] font-medium capitalize ${
                          isInProgress ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                        }`}>
                          {task.status.toLowerCase().replace("_", " ")}
                        </span>
                        <Button asChild size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <Link href={`/developer/projects/${task.project_id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Assigned Workspaces */}
          <SectionCard
            title="My Active Projects"
            action={
              projects.length > 3 ? (
                <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                  <Link href="/developer/projects">
                    View All ({projects.length})
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              ) : null
            }
          >
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                <Layers className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-semibold text-foreground">
                  No Assigned Workspaces
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  You have not been attached to any project repositories yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {projects.slice(0, 4).map((project) => {
                  const progress = Math.min(
                    Math.max(Number(project.progress) || 0, 0),
                    100
                  );

                  return (
                    <div
                      key={project.id}
                      className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {project.name}
                            </h4>
                            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                              {project.description || "Active production client workspace"}
                            </p>
                          </div>
                          <span className="text-[11px] font-medium text-muted-foreground uppercase shrink-0">
                            {project.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 pt-2 border-t border-border/40">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground font-medium">Completion</span>
                          <span className="font-bold tabular-nums text-foreground">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              progress === 100 ? "bg-emerald-500" : "bg-primary"
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-muted-foreground">
                            {project.due_date ? (
                              <span suppressHydrationWarning>
                                Due {new Date(project.due_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            ) : (
                              "Continuous delivery"
                            )}
                          </span>
                          <Link
                            href={`/developer/projects/${project.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            Workspace
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column (4 cols): Velocity Breakdown & System Notifications */}
        <div className="space-y-6 lg:col-span-4">
          {/* Workload Breakdown Card */}
          <SectionCard title="Task Distribution">
            <div className="space-y-4">
              <div className="space-y-2.5">
                {/* Pending */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium text-foreground">Pending Queue</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">{pendingTasks}</span>
                </div>

                {/* In Progress */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-foreground">Active In-Progress</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-blue-600 dark:text-blue-400">{inProgressTasks}</span>
                </div>

                {/* Completed */}
                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-foreground">Completed</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{completedTasks}</span>
                </div>
              </div>

              {/* Mini visual summary bar */}
              {totalTasks > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div style={{ width: `${(completedTasks / totalTasks) * 100}%` }} className="bg-emerald-500 transition-all" />
                    <div style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }} className="bg-blue-500 transition-all" />
                    <div style={{ width: `${(pendingTasks / totalTasks) * 100}%` }} className="bg-amber-500 transition-all" />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{velocityScore}% completed</span>
                    <span>{totalTasks} total</span>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Activity & System Notifications */}
          <SectionCard
            title="Recent Activity"
            action={
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary">
                <Link href="/developer/notifications">View All</Link>
              </Button>
            }
          >
            {notifications && notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-muted/10 p-3 transition-colors hover:bg-muted/20"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Bell className="h-3 w-3" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground leading-snug">
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                          {n.message}
                        </p>
                      )}
                      <p
                        suppressHydrationWarning
                        className="mt-1 text-[10px] text-muted-foreground/80 font-mono"
                      >
                        {new Date(n.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-6 text-center">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
                <p className="mt-2 text-xs font-semibold text-foreground">
                  No Recent Activity
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  You are caught up with all updates.
                </p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
}