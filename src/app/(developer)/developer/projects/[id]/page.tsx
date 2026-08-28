import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CheckCircle2,
  Clock,
  Circle,
  CalendarDays,
  FileText,
  Calendar,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { DeveloperTaskStatus } from "@/features/tasks/components/developer-task-status";
import { getProjectTimeline } from "@/features/projects/actions/get-project-timeline";
import { DeveloperTimeline } from "@/features/projects/components/developer-timeline";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Markdown parser components for clean headings, bullet lists, code, and paragraph spacing
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-4 mb-2 text-base font-bold tracking-tight text-foreground sm:text-lg">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3.5 mb-1.5 text-sm font-semibold tracking-tight text-foreground sm:text-base">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-2 text-sm leading-relaxed text-foreground/85 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 text-sm text-foreground/85 marker:text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 text-sm text-foreground/85 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
      {children}
    </code>
  ),
};

export default async function DeveloperProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Verify developer is assigned to this project
  const { data: membership } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("project_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    notFound();
  }

  const { data: project } = await supabase
    .from("projects")
    .select(`
      id,
      name,
      description,
      status,
      progress,
      start_date,
      due_date
    `)
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  // Fetch project timeline milestones
  const timeline = await getProjectTimeline(id);
  const milestones = timeline ?? [];

  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      status,
      priority,
      due_date
    `)
    .eq("project_id", id)
    .eq("assigned_to", user.id)
    .order("created_at", { ascending: false });

  const taskList = tasks ?? [];

  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(
    (milestone) => milestone.status === "COMPLETED"
  ).length;
  const inProgressMilestones = milestones.filter(
    (milestone) => milestone.status === "IN_PROGRESS"
  ).length;

  const calculatedProgress =
    totalMilestones > 0
      ? Math.round(
          ((completedMilestones + inProgressMilestones * 0.5) /
            totalMilestones) *
            100
        )
      : 0;

  return (
    <PageContainer>
      <PageHeader
        title={project.name}
        description="Your project workspace, timeline milestones, and assigned sprint tasks."
      />

      {/* Progress Section */}
      <SectionCard title="Project Progress">
        <div className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Overall completion</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              {calculatedProgress}%
            </p>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${calculatedProgress}%`,
              }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Milestones
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {totalMilestones}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Completed
              </p>
              <p className="mt-1 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                {completedMilestones}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                In Progress
              </p>
              <p className="mt-1 text-xl font-semibold text-blue-600 dark:text-blue-400">
                {inProgressMilestones}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Project Overview with Rich Markdown Rendering */}
      <SectionCard
        title="Project Overview & Specifications"
        action={
          <div className="flex items-center gap-2">
            {project.status && (
              <Badge variant="outline" className="text-xs font-semibold uppercase">
                {project.status}
              </Badge>
            )}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/10 p-4.5 sm:p-5">
            {project.description ? (
              <div className="prose prose-sm dark:prose-invert max-w-none font-normal leading-relaxed text-foreground/90">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {project.description}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <FileText className="h-4 w-4" />
                <span>No project description or scope documented yet.</span>
              </div>
            )}
          </div>

          {/* Schedule Footer Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs sm:text-sm">
            {project.start_date && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  Started:{" "}
                  <span suppressHydrationWarning className="font-medium text-foreground">
                    {new Date(project.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span>
                Target Deadline:{" "}
                {project.due_date ? (
                  <span
                    suppressHydrationWarning
                    className="font-medium text-foreground"
                  >
                    {new Date(project.due_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : (
                  <span className="font-medium text-foreground">Continuous delivery</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Project Timeline */}
      <SectionCard title="Project Timeline">
        <DeveloperTimeline items={milestones} projectId={project.id} />
      </SectionCard>

      {/* My Tasks */}
      <SectionCard title="My Tasks">
        {taskList.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 p-8 text-center">
            <p className="font-medium text-foreground">No tasks assigned yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tasks assigned to you will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {taskList.map((task) => {
              const completed = task.status === "COMPLETED";
              const inProgress = task.status === "IN_PROGRESS";

              return (
                <div
                  key={task.id}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="pt-1">
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : inProgress ? (
                      <Clock className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
                        {task.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold uppercase"
                        >
                          {task.status}
                        </Badge>

                        <DeveloperTaskStatus
                          taskId={task.id}
                          status={task.status}
                        />
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
                      <span className="rounded-md bg-muted/50 px-2 py-0.5 font-medium">
                        Priority: {task.priority}
                      </span>

                      <span className="flex items-center gap-1">
                        Due:{" "}
                        {task.due_date ? (
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
                        ) : (
                          "No deadline"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}