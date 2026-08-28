"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Circle,
  CalendarDays,
  FolderKanban,
  Flame,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DeveloperTaskStatus,
  type Status,
} from "@/features/tasks/components/developer-task-status";

function getPriorityBadge(priority: string) {
  switch (priority?.toUpperCase()) {
    case "URGENT":
    case "HIGH":
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400"
        >
          <Flame className="mr-1 h-3 w-3" />
          High
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
        >
          Medium
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-muted-foreground/30 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          Low
        </Badge>
      );
  }
}

interface DeveloperTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: string;
    status: Status | string;
    due_date: string | null;
    created_at: string;
    project_id: string;
    projects: unknown;
  };
}

export function DeveloperTaskCard({ task }: DeveloperTaskCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const taskStatus = (task.status as Status) || "TODO";
  const completed = taskStatus === "COMPLETED";
  const inProgress = taskStatus === "IN_PROGRESS";

  const projectName =
    Array.isArray(task.projects) && task.projects.length > 0
      ? (task.projects[0] as { name?: string })?.name
      : (task.projects as { name?: string } | null)?.name;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation on modified clicks
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    startTransition(() => {
      router.push(`/developer/tasks/${task.id}`);
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border p-4.5 shadow-xs transition-all duration-200 sm:p-5 ${
        isPending
          ? "pointer-events-none border-primary/50 bg-muted/40 shadow-sm"
          : completed
          ? "border-border/40 bg-card/60 opacity-80 hover:opacity-100"
          : inProgress
          ? "border-blue-500/40 bg-card hover:border-blue-500/70"
          : "border-border/70 bg-card hover:border-border hover:shadow-sm"
      }`}
    >
      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/70 backdrop-blur-[1.5px] transition-all">
          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-1.5 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Opening task...
            </span>
          </div>
        </div>
      )}

      {/* Status Accent Strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          completed
            ? "bg-emerald-500"
            : inProgress
            ? "bg-blue-500"
            : "bg-muted-foreground/30"
        }`}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Status Icon & Details */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="mt-0.5 shrink-0">
            {completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : inProgress ? (
              <Clock className="h-5 w-5 text-blue-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/70" />
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            {/* Project Tag & Priority */}
            <div className="flex flex-wrap items-center gap-2">
              {projectName && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex"
                >
                  <Link
                    href={`/developer/projects/${task.project_id}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <FolderKanban className="h-3 w-3 text-primary" />
                    <span className="truncate max-w-40">{projectName}</span>
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-60" />
                  </Link>
                </div>
              )}
              {getPriorityBadge(task.priority)}
            </div>

            {/* Task Title */}
            <h2
              className={`block text-sm font-semibold tracking-tight transition-colors sm:text-base ${
                completed
                  ? "text-muted-foreground line-through decoration-muted-foreground/60"
                  : "text-foreground group-hover:text-primary"
              }`}
            >
              {task.title}
            </h2>

            {task.description && (
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {task.description}
              </p>
            )}

            {/* Meta Footer */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              {task.due_date ? (
                <span className="flex items-center gap-1 text-[11px]">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                  Due:{" "}
                  <span
                    suppressHydrationWarning
                    className="font-medium text-foreground"
                  >
                    {new Date(task.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              ) : (
                <span className="text-[11px] text-muted-foreground/70">
                  No hard deadline
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Interactive Status Switcher (stopPropagation applied internally) */}
        <div className="flex shrink-0 items-center justify-between border-t border-border/40 pt-3 sm:border-0 sm:pt-0">
          <DeveloperTaskStatus
            taskId={task.id}
            status={taskStatus}
          />
        </div>
      </div>
    </div>
  );
}