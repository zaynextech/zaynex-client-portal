import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { updateTask } from "@/features/tasks/actions/update-task";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function EditTaskPage({
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

  const dueDate = task.due_date
    ? new Date(task.due_date).toISOString().slice(0, 16)
    : "";

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
            <Link href={`/sales/tasks/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Task
            </Link>
          </Button>

          <PageHeader
            title="Edit Task"
            description="Update task information."
          />
        </div>

        <SectionCard title="Task Information">
          <form
            action={updateTask}
            className="space-y-5"
          >
            <input
              type="hidden"
              name="id"
              value={task.id}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title
              </label>

              <Input
                name="title"
                defaultValue={task.title}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>

              <Textarea
                name="description"
                defaultValue={task.description ?? ""}
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Priority
                </label>

                <select
                  name="priority"
                  defaultValue={task.priority ?? "MEDIUM"}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status
                </label>

                <select
                  name="status"
                  defaultValue={task.status ?? "TODO"}
                  className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Due Date
              </label>

              <Input
                name="due_date"
                type="datetime-local"
                defaultValue={dueDate}
              />
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                asChild
              >
                <Link href={`/sales/tasks/${id}`}>
                  Cancel
                </Link>
              </Button>

              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageContainer>
  );
}