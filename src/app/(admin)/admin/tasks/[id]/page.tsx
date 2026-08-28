import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  User,
  FolderKanban,
  Flag,
  Clock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskFileUpload } from "@/features/tasks/components/task-file-upload";
import { TaskCommentForm } from "@/features/tasks/components/task-comment-form";
import { TaskCommentList } from "@/features/tasks/components/task-comment-list";
import { TaskPaymentForm } from "@/features/tasks/components/task-payment-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminTaskDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Authenticate Current User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // 2. Fetch Task Details (with payment fields)
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

      profiles:assigned_to (
        id,
        full_name,
        email
      ),

      projects:project_id (
        id,
        name
      )
    `)
    .eq("id", id)
    .single();

  if (error || !task) {
    notFound();
  }

  // 3. Fetch Task Files
  const { data: taskFiles, error: taskFilesError } = await supabase
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

  if (taskFilesError) {
    throw new Error(taskFilesError.message);
  }

  const fileList = taskFiles ?? [];

  // 4. Fetch Task Comments
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

  const developer = Array.isArray(task.profiles)
    ? task.profiles[0]
    : task.profiles;

  const project = Array.isArray(task.projects)
    ? task.projects[0]
    : task.projects;

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/admin/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        {/* Header */}
        <PageHeader
          title={task.title}
          description="Manage this task and its assigned developer."
          action={
            <Badge
              variant="outline"
              className="w-fit px-3 py-1 text-xs font-semibold uppercase"
            >
              {task.status}
            </Badge>
          }
        />

        {/* Task Overview */}
        <SectionCard title="Task Overview">
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/80">
                {task.description || "No description provided."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-medium">Developer</span>
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {developer?.full_name ?? "Unassigned"}
                </p>

                {developer?.email && (
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {developer.email}
                  </p>
                )}
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FolderKanban className="h-4 w-4" />
                  <span className="text-xs font-medium">Project</span>
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {project?.name ?? "No project"}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flag className="h-4 w-4" />
                  <span className="text-xs font-medium">Priority</span>
                </div>

                <p className="mt-2 text-sm font-semibold uppercase">
                  {task.priority}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-medium">Due Date</span>
                </div>

                <p className="mt-2 text-sm font-semibold">
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

        {/* Task Management */}
        <SectionCard title="Task Management">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`/admin/tasks/${task.id}/edit`}
              className="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted"
            >
              Edit Task
            </Link>

            <button
              type="button"
              className="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted"
            >
              Change Developer
            </button>

            <button
              type="button"
              className="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted"
            >
              Change Status
            </button>

            <button
              type="button"
              className="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted"
            >
              Change Due Date
            </button>
          </div>
        </SectionCard>

        {/* Attached Files */}
        <SectionCard
          title="Attached Files"
          action={<TaskFileUpload taskId={task.id} />}
        >
          {fileList.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium">No files attached</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Task files will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fileList.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {file.file_name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(file.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Preview
                      </a>
                    </Button>

                    <Button asChild size="sm" variant="outline">
                      <a
                        href={file.file_url}
                        download={file.file_name}
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Comments & Notes */}
        <SectionCard
          title="Comments & Notes"
          action={
            <span className="text-xs text-muted-foreground">
              {commentList.length}{" "}
              {commentList.length === 1 ? "comment" : "comments"}
            </span>
          }
        >
          <div className="space-y-5">
            <p className="text-xs text-muted-foreground">
              Communication between the admin and developer.
            </p>

            <TaskCommentList
              comments={commentList}
              currentUserId={user.id}
            />

            <div className="border-t pt-5">
              <TaskCommentForm taskId={task.id} />
            </div>
          </div>
        </SectionCard>

        {/* Developer Payment */}
        <SectionCard title="Developer Payment">
          <div className="space-y-6">
            <p className="text-xs text-muted-foreground">
              Manage the payment assigned to this task.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Payment Amount
                </p>

                <p className="mt-2 text-xl font-bold">
                  {task.payment_amount !== null && task.payment_amount !== undefined
                    ? `$${Number(task.payment_amount).toFixed(2)}`
                    : "Not Set"}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Payment Status
                </p>

                <p className="mt-2 text-sm font-semibold uppercase">
                  {task.payment_status ?? "UNPAID"}
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Paid At
                </p>

                <p
                  suppressHydrationWarning
                  className="mt-2 text-sm font-semibold"
                >
                  {task.paid_at
                    ? new Date(task.paid_at).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>

            <div className="border-t pt-5">
              <TaskPaymentForm
                taskId={task.id}
                currentAmount={task.payment_amount}
                currentStatus={task.payment_status ?? "UNPAID"}
              />
            </div>
          </div>
        </SectionCard>

        {/* Task Activity */}
        <SectionCard title="Task Activity">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Task created {new Date(task.created_at).toLocaleString()}
            </span>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}