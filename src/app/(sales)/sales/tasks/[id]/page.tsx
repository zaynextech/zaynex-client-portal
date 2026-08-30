import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskButton } from "@/features/tasks/components/delete-task-button";

function getStatusBadge(status: string | null) {
  switch (status?.toUpperCase()) {
    case "TODO":
      return (
        <Badge variant="outline" className="text-blue-600">
          To Do
        </Badge>
      );

    case "IN_PROGRESS":
      return (
        <Badge variant="outline" className="text-amber-600">
          In Progress
        </Badge>
      );

    case "COMPLETED":
      return (
        <Badge variant="outline" className="text-emerald-600">
          Completed
        </Badge>
      );

    case "PENDING":
      return (
        <Badge variant="outline" className="text-amber-600">
          Pending
        </Badge>
      );

    default:
      return <Badge variant="outline">{status ?? "Unknown"}</Badge>;
  }
}

function getPriorityBadge(priority: string | null) {
  switch (priority?.toUpperCase()) {
    case "LOW":
      return (
        <Badge variant="outline" className="text-green-600">
          Low
        </Badge>
      );

    case "MEDIUM":
      return (
        <Badge variant="outline" className="text-yellow-600">
          Medium
        </Badge>
      );

    case "HIGH":
      return (
        <Badge variant="outline" className="text-red-600">
          High
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {priority ?? "Not set"}
        </Badge>
      );
  }
}

export default async function SalesTaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: task, error } = await supabase
    .from("sales_tasks")
    .select(`
      id,
      title,
      description,
      priority,
      status,
      due_date,
      lead_id,
      assigned_to,
      created_by
    `)
    .eq("id", id)
    .or(`assigned_to.eq.${user.id},created_by.eq.${user.id}`)
    .single();

  if (error || !task) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mb-4"
          >
            <Link href="/sales/tasks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Link>
          </Button>

          <PageHeader
            title={task.title}
            description="Task details and information."
          />
        </div>

        <SectionCard title="Task Information">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-sm font-medium">
                Description
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {task.description || "No description provided."}
              </p>
            </div>

            {/* Status / Priority / Due Date */}
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Status
                </p>

                <div className="mt-2">
                  {getStatusBadge(task.status)}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Priority
                </p>

                <div className="mt-2">
                  {getPriorityBadge(task.priority)}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-sm text-muted-foreground">
                    Due Date
                  </p>

                  <p className="font-medium">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "No due date"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lead */}
            <div>
              <p className="text-sm text-muted-foreground">
                Lead
              </p>

              <p className="mt-1 font-medium">
                {task.lead_id || "No lead"}
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/sales/tasks/${task.id}/edit`}>
              Edit Task
            </Link>
          </Button>

          <DeleteTaskButton taskId={task.id} />

          {task.status === "COMPLETED" && (
            <Badge
              variant="outline"
              className="h-9 px-4"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </Badge>
          )}
        </div>
      </div>
    </PageContainer>
  );
}