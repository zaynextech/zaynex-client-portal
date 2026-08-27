import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileIcon,
  FolderArchive,
  ListTodo,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/server";
import { ClientUploadFile } from "@/features/projects/components/client-upload-file";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Custom Markdown formatting component to handle spaces, bullet points, bolding, and headings
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mt-2 mb-1.5 text-base font-bold tracking-tight text-foreground sm:text-lg">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-2 mb-1 text-sm font-semibold tracking-tight text-foreground sm:text-base">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-1.5 mb-1 text-xs font-semibold text-foreground sm:text-sm">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-1.5 text-xs leading-relaxed text-muted-foreground last:mb-0 sm:text-sm">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-1.5 list-disc space-y-1 pl-5 text-xs text-muted-foreground marker:text-primary sm:text-sm">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 list-decimal space-y-1 pl-5 text-xs text-muted-foreground marker:text-muted-foreground sm:text-sm">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed text-muted-foreground">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 border-l-2 border-primary/50 pl-3 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-foreground sm:text-xs">
      {children}
    </code>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
    >
      {children}
    </a>
  ),
};

function FormattedContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none font-normal leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default async function ClientProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (!project) {
    notFound();
  }

  const [{ data: timeline }, { data: files }, { data: tasks }] =
    await Promise.all([
      supabase
        .from("project_timeline")
        .select("*")
        .eq("project_id", id)
        .eq("visible_to_client", true)
        .order("created_at", { ascending: false }),

      supabase
        .from("project_files")
        .select("*")
        .eq("project_id", id)
        .eq("visible_to_client", true)
        .order("created_at", { ascending: false }),

      supabase
        .from("project_tasks")
        .select("*")
        .eq("project_id", id)
        .eq("visible_to_client", true)
        .order("created_at", { ascending: true }),
    ]);

  const progress = project.progress ?? 0;

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={project.name}
        description="Track your project milestones, tasks, timeline updates, and shared deliverables in real time."
      />

      {/* Project Overview + Upload Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Project Overview */}
        <SectionCard title="Project Overview">
          <div className="space-y-5">
            {/* Status Badge */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                Current Status
              </span>
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-primary"
              >
                {project.status}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-muted-foreground">
                  Completion
                </span>
                <span className="font-semibold tabular-nums text-foreground">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Description with formatting */}
            {project.description && (
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Overview Details
                </p>
                <FormattedContent content={project.description} />
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Budget
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {project.budget
                    ? `$${Number(project.budget).toLocaleString()}`
                    : "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Start Date
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {project.start_date
                    ? new Date(project.start_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Due Date
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {project.due_date
                    ? new Date(project.due_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Upload Action */}
        <SectionCard title="Upload Project Files">
          <ClientUploadFile projectId={project.id} />
        </SectionCard>
      </div>

      {/* Timeline Section */}
      <SectionCard title="Project Timeline">
        <div className="space-y-3">
          {timeline?.length ? (
            timeline.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border/60 bg-card p-4 text-card-foreground shadow-xs transition-colors hover:border-border"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h4>
                  </div>

                  {item.status && (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {item.status}
                    </Badge>
                  )}
                </div>

                {/* Formatted multi-line / bullet description */}
                {item.description && (
                  <div className="mt-2.5 pt-2 border-t border-border/30">
                    <FormattedContent content={item.description} />
                  </div>
                )}

               {item.created_at && (
                  <p className="mt-3 text-[11px] text-muted-foreground/70">
                    {new Date(item.created_at).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                No timeline milestones published yet.
              </p>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Bottom Grid: Tasks & Files */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Project Tasks */}
        <SectionCard title="Project Tasks">
          <div className="space-y-3">
            {tasks?.length ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-border/60 bg-card p-4 text-card-foreground shadow-xs transition-colors hover:border-border"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold tracking-tight text-foreground">
                        {task.title}
                      </h4>
                    </div>

                    <Badge variant="outline" className="text-[11px] font-medium">
                      {task.status}
                    </Badge>
                  </div>

                  {/* Formatted Task Description */}
                  {task.description && (
                    <div className="mt-2.5 pt-2 border-t border-border/30">
                      <FormattedContent content={task.description} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  No public tasks assigned to this project yet.
                </p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Project Deliverables & Files */}
        <SectionCard title="Shared Project Files">
          <div className="space-y-3">
            {files?.length ? (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-card p-4 text-card-foreground shadow-xs transition-colors hover:border-border sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileIcon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {file.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          By {file.uploaded_by_role === "ADMIN" ? "Team" : "You"}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(file.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8 gap-1.5 text-xs font-medium"
                    >
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Preview
                      </a>
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      asChild
                      className="h-8 gap-1.5 text-xs font-medium"
                    >
                      <a
                        href={file.file_url}
                        download={file.name}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 text-center">
                <FolderArchive className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  No files uploaded for this project yet.
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}