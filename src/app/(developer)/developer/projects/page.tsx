import Link from "next/link";
import {
  FolderKanban,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Layers,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

function getProjectStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Cancelled
        </Badge>
      );
    case "PENDING":
    default:
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
}

export default async function DeveloperProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: memberships, error } = await supabase
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
        created_at
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const projects = (memberships ?? [])
    .map((membership) => {
      const project = Array.isArray(membership.projects)
        ? membership.projects[0]
        : membership.projects;

      return project;
    })
    .filter(Boolean);

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgressProjects = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const avgProgress =
    totalProjects > 0
      ? Math.round(
          projects.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) /
            totalProjects
        )
      : 0;

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Assigned Projects"
        description="Active client workspaces, milestones, and deliverable environments."
      />

      {/* Telemetry Overview Strip */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Total Projects */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-primary/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Assigned
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {totalProjects}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Repositories</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-blue-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              In Active Sprint
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 sm:text-3xl">
              {inProgressProjects}
            </p>
            <span className="text-xs font-medium text-muted-foreground">In Progress</span>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-emerald-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Delivered
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-3xl">
              {completedProjects}
            </p>
            <span className="text-xs font-medium text-muted-foreground">Completed</span>
          </div>
        </div>

        {/* Avg Progress */}
        <div className="rounded-xl border border-border/70 bg-card p-4.5 shadow-xs transition-all hover:border-cyan-500/40 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Avg. Completion
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {avgProgress}%
            </p>
            <span className="text-xs font-medium text-muted-foreground">Global Pace</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="mt-4 text-base font-bold tracking-tight text-foreground">
            No Projects Assigned
          </p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
            You currently have no project workspaces attached to your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const progress = Math.min(
              Math.max(Number(project.progress) || 0, 0),
              100
            );
            const isComplete = progress === 100 || project.status === "COMPLETED";

            return (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                {/* Visual Status Indicator Accent */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isComplete
                      ? "bg-emerald-500"
                      : project.status === "IN_PROGRESS"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                />

                <div className="space-y-4">
                  {/* Top: Icon + Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                      <FolderKanban className="h-5 w-5" />
                    </div>

                    <div className="shrink-0">
                      {getProjectStatusBadge(project.status)}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-1.5">
                    <h2 className="line-clamp-1 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {project.name}
                    </h2>

                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {project.description ||
                        "Production client workspace and task deliverable board."}
                    </p>
                  </div>
                </div>

                {/* Bottom: Progress Bar, Meta & Navigation */}
                <div className="mt-5 space-y-3.5 border-t border-border/40 pt-3.5">
                  {/* Progress Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">
                        Sprint Completion
                      </span>
                      <span className="font-bold tabular-nums text-foreground">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          isComplete ? "bg-emerald-500" : "bg-primary"
                        }`}
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Due Date & Action Link */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {project.due_date ? (
                        <span suppressHydrationWarning className="font-medium">
                          Due{" "}
                          {new Date(project.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/70">Continuous</span>
                      )}
                    </div>

                    <Link
                      href={`/developer/projects/${project.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
                    >
                      Workspace
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}