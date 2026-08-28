import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  FolderKanban,
  Flag,
  Clock,
  FileText,
  MessageSquare,
  CreditCard,
  Download,
  ExternalLink,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeveloperTaskStatus } from "@/features/tasks/components/developer-task-status";
import { TaskCommentForm } from "@/features/tasks/components/task-comment-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DeveloperTaskDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Current developer
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Task must belong to the logged-in developer
  const { data: task, error } = await supabase
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
      payment_amount,
      payment_status,
      paid_at,

      projects:project_id (
        id,
        name
      )
    `)
    .eq("id", id)
    .eq("assigned_to", user.id)
    .single();

  if (error || !task) {
    notFound();
  }

  // Files
  const { data: taskFiles, error: filesError } = await supabase
    .from("task_files")
    .select(`
      id,
      task_id,
      file_name,
      file_url,
      uploaded_by,
      created_at
    `)
    .eq("task_id", task.id)
    .order("created_at", {
      ascending: false,
    });

  if (filesError) {
    throw new Error(filesError.message);
  }

  const fileList = taskFiles ?? [];

  // Comments
  const { data: comments, error: commentsError } = await supabase
    .from("task_comments")
    .select(`
      id,
      task_id,
      user_id,
      comment,
      created_at,

      profiles:user_id (
        full_name,
        email
      )
    `)
    .eq("task_id", task.id)
    .order("created_at", {
      ascending: true,
    });

  if (commentsError) {
    throw new Error(commentsError.message);
  }

  const commentList = comments ?? [];

  const project = Array.isArray(task.projects)
    ? task.projects[0]
    : task.projects;

  return (
    <PageContainer>
      <div className="space-y-4 sm:space-y-6">
        {/* Back navigation */}
        <Link
          href="/developer/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Tasks
        </Link>

        {/* Responsive Header */}
        <PageHeader
          title={task.title}
          description="View task requirements, attached files, notes, and payment status."
          action={
            <Badge
              variant="outline"
              className="w-fit px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider sm:px-3 sm:py-1 sm:text-xs"
            >
              {task.status.replace("_", " ")}
            </Badge>
          }
        />

        {/* Task Overview */}
        <SectionCard title="Task Overview">
          <div className="space-y-4 sm:space-y-5">
            {/* Description */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                Description
              </p>
              <p className="mt-1.5 wrap-break-word whitespace-pre-wrap text-xs leading-relaxed text-foreground/85 sm:mt-2 sm:text-sm sm:leading-6">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Overview Metadata Grid */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
              {/* Project */}
              <div className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderKanban className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[11px] font-medium sm:text-xs">Project</span>
                </div>
                <p className="mt-1.5 truncate text-xs font-semibold text-foreground sm:mt-2 sm:text-sm">
                  {project?.name ?? "No project"}
                </p>
              </div>

              {/* Status Switcher */}
              <div className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[11px] font-medium sm:text-xs">Status</span>
                </div>
                <div className="mt-2 overflow-x-auto pb-0.5">
                  <DeveloperTaskStatus
                    taskId={task.id}
                    status={task.status}
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[11px] font-medium sm:text-xs">Priority</span>
                </div>
                <p className="mt-1.5 text-xs font-semibold uppercase text-foreground sm:mt-2 sm:text-sm">
                  {task.priority}
                </p>
              </div>

              {/* Due Date */}
              <div className="min-w-0 rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="text-[11px] font-medium sm:text-xs">Due Date</span>
                </div>
                <p
                  suppressHydrationWarning
                  className="mt-1.5 text-xs font-semibold text-foreground sm:mt-2 sm:text-sm"
                >
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "No deadline"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Attached Files */}
        <SectionCard
          title="Attached Files"
          action={
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span>
                {fileList.length} {fileList.length === 1 ? "file" : "files"}
              </span>
            </div>
          }
        >
          {fileList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 p-6 text-center sm:p-8">
              <FileText className="mx-auto h-7 w-7 text-muted-foreground/60 sm:h-8 sm:w-8" />
              <p className="mt-2 text-xs font-semibold text-foreground sm:text-sm">
                No files attached
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                Deliverables and assets attached to this task will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {fileList.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-xs transition-colors hover:border-border sm:flex-row sm:items-center sm:p-3.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-9 sm:w-9">
                      <FileText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                        {file.file_name}
                      </p>
                      <p
                        suppressHydrationWarning
                        className="text-[10px] text-muted-foreground sm:text-[11px]"
                      >
                        {new Date(file.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 px-2.5 text-xs font-medium"
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
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5 px-2.5 text-xs font-medium"
                    >
                      <a
                        href={file.file_url}
                        download={file.file_name}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Comments */}
        <SectionCard
          title="Comments & Notes"
          action={
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground sm:text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>
                {commentList.length}{" "}
                {commentList.length === 1 ? "comment" : "comments"}
              </span>
            </div>
          }
        >
          <div className="space-y-4 sm:space-y-5">
            {commentList.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 p-6 text-center sm:p-8">
                <MessageSquare className="mx-auto h-7 w-7 text-muted-foreground/60 sm:h-8 sm:w-8" />
                <p className="mt-2 text-xs font-semibold text-foreground sm:text-sm">
                  No comments yet
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                  Start a conversation or leave updates about this task below.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {commentList.map((comment) => {
                  const profile = Array.isArray(comment.profiles)
                    ? comment.profiles[0]
                    : comment.profiles;

                  return (
                    <div
                      key={comment.id}
                      className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary sm:h-7 sm:w-7 sm:text-xs">
                            {profile?.full_name?.charAt(0)?.toUpperCase() ?? "T"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                              {profile?.full_name ?? "Team Member"}
                            </p>
                            {profile?.email && (
                              <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                                {profile.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <p
                          suppressHydrationWarning
                          className="shrink-0 text-[10px] text-muted-foreground sm:text-xs"
                        >
                          {new Date(comment.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <p className="mt-2.5 wrap-break-word whitespace-pre-wrap text-xs leading-relaxed text-foreground/85 sm:mt-3 sm:text-sm sm:leading-6">
                        {comment.comment}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-border/50 pt-4 sm:pt-5">
              <TaskCommentForm taskId={task.id} />
            </div>
          </div>
        </SectionCard>

        {/* Developer Payment */}
        <SectionCard title="Developer Payment">
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-4">
              {/* Amount */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <p className="text-[11px] font-medium sm:text-xs">
                    Payment Amount
                  </p>
                </div>
                <p className="mt-1.5 text-lg font-bold tracking-tight text-foreground sm:mt-2 sm:text-xl">
                  {task.payment_amount !== null && task.payment_amount !== undefined
                    ? `$${Number(task.payment_amount).toFixed(2)}`
                    : "Not Set"}
                </p>
              </div>

              {/* Status */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  Payment Status
                </p>
                <p className="mt-1.5 text-xs font-semibold uppercase text-foreground sm:mt-2 sm:text-sm">
                  {task.payment_status ?? "UNPAID"}
                </p>
              </div>

              {/* Paid At */}
              <div className="rounded-xl border border-border/70 bg-muted/20 p-3 sm:p-4">
                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  Paid At
                </p>
                <p
                  suppressHydrationWarning
                  className="mt-1.5 text-xs font-semibold text-foreground sm:mt-2 sm:text-sm"
                >
                  {task.paid_at
                    ? new Date(task.paid_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Activity */}
        <SectionCard title="Task Activity">
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:gap-2.5 sm:text-sm">
            <Clock className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span suppressHydrationWarning className="truncate">
              Task created{" "}
              {new Date(task.created_at).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}