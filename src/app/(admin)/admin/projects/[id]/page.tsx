import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Mail,
  Building2,
  FileText,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

import { ProjectTimeline } from "@/features/projects/components/project-timeline";
import { getProjectTimeline } from "@/features/projects/actions/get-project-timeline";
import { AddTimelineDialog } from "@/features/projects/components/add-timeline-dialog";

import { UploadProjectFile } from "@/features/projects/components/upload-project-file";
import { ProjectFiles } from "@/features/projects/components/project-files";
import { getProjectFiles } from "@/features/projects/actions/get-project-files";

import { DeleteProjectButton } from "@/features/projects/components/delete-project-button";
import { EditProjectDialog } from "@/features/projects/components/edit-project-dialog";

import { ProjectTaskBoard } from "@/features/projects/components/project-task-board";
import { CreateProjectTaskDialog } from "@/features/projects/components/create-project-task-dialog";

import { ProjectNoteCard } from "@/features/projects/components/project-note-card";
import { ProjectNotes } from "@/features/projects/components/project-notes";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-3 mb-2 text-base font-bold tracking-tight text-foreground sm:text-lg">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-3 mb-1.5 text-sm font-semibold tracking-tight text-foreground sm:text-base">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-2.5 mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
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
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
      {children}
    </code>
  ),
};

function getStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400"
        >
          <Clock className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 bg-rose-500/10 font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400"
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
          className="border-amber-500/30 bg-amber-500/10 font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400"
        >
          <AlertCircle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch primary project record
  const { data: project } = await supabase
    .from("projects")
    .select(`
      *,
      client:profiles(
        id,
        full_name,
        email,
        company_name
      )
    `)
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  // 2. Fetch all dependent collections in parallel
  const [
    { data: notes },
    { data: tasks },
    timeline,
    files,
  ] = await Promise.all([
    supabase
      .from("project_notes")
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq("project_id", project.id)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false }),

    supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", project.id)
      .order("position", { ascending: true }),

    getProjectTimeline(id),
    getProjectFiles(id),
  ]);

  // Ensure progress is safely bounded between 0 and 100 as a strict number
  const progress = Math.min(Math.max(Number(project.progress) || 0, 0), 100);

  const formattedStartDate = project.start_date
    ? new Date(project.start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const formattedDueDate = project.due_date
    ? new Date(project.due_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title={project.name}
        description="Manage project details, timeline milestones, tasks, files, and internal notes."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <EditProjectDialog project={project} />
            <DeleteProjectButton projectId={project.id} />
          </div>
        }
      />

      {/* Project Overview + Client Details */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Project Overview */}
        <SectionCard title="Project Overview">
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Current Status
              </span>
              {getStatusBadge(project.status)}
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Overall Completion
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {progress}%
                </span>
              </div>

              {/* Robust CSS Progress Track & Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    progress === 100
                      ? "bg-emerald-500"
                      : "bg-primary"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5 text-primary" />
                  Allocated Budget
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {project.budget
                    ? `$${Number(project.budget).toLocaleString()}`
                    : "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Start Date
                </div>
                <p
                  suppressHydrationWarning
                  className="mt-1 text-sm font-semibold text-foreground"
                >
                  {formattedStartDate}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Due Date
                </div>
                <p
                  suppressHydrationWarning
                  className="mt-1 text-sm font-semibold text-foreground"
                >
                  {formattedDueDate}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <p className="text-xs font-medium text-muted-foreground">Project ID</p>
                <p
                  className="mt-1 truncate font-mono text-xs text-muted-foreground"
                  title={project.id}
                >
                  {project.id}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Client Card */}
        <SectionCard title="Client Information">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Client Name
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {project.client?.full_name ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="break-all text-sm font-semibold text-foreground">
                  {project.client?.email ?? "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Company
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {project.client?.company_name ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Project Description with Rich Markdown Support */}
      <SectionCard title="Project Description">
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 sm:p-5">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>No description provided for this project.</span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Timeline */}
      <SectionCard
        title="Timeline"
        action={<AddTimelineDialog projectId={project.id} />}
      >
        <ProjectTimeline items={timeline} projectId={project.id} />
      </SectionCard>

      {/* Tasks */}
      <SectionCard
        title="Tasks Board"
        action={<CreateProjectTaskDialog projectId={project.id} />}
      >
        <ProjectTaskBoard projectId={project.id} tasks={tasks ?? []} />
      </SectionCard>

      {/* Files */}
      <SectionCard
        title="Files"
        action={<UploadProjectFile projectId={project.id} />}
      >
        <ProjectFiles files={files} />
      </SectionCard>

      {/* Internal Notes */}
      <SectionCard title="Internal Notes">
        <div className="space-y-6">
          <ProjectNotes projectId={project.id} />

          <div className="space-y-3">
            {notes?.length ? (
              notes.map((note) => (
                <ProjectNoteCard key={note.id} note={note} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-foreground">
                No internal notes recorded yet.
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}