import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { EditTaskForm } from "@/features/tasks/components/edit-task-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTaskPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      description,
      priority,
      status,
      due_date,
      assigned_to,
      project_id
    `)
    .eq("id", id)
    .single();

  if (taskError || !task) {
    notFound();
  }

  const { data: developers, error: developersError } =
    await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "DEVELOPER")
      .order("full_name");

  if (developersError) {
    throw new Error(developersError.message);
  }

  const { data: projects, error: projectsError } =
    await supabase
      .from("projects")
      .select("id, name")
      .order("name");

  if (projectsError) {
    throw new Error(projectsError.message);
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <Link
          href={`/admin/tasks/${task.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Task
        </Link>

        <PageHeader
          title="Edit Task"
          description={`Update "${task.title}"`}
        />

        <EditTaskForm
          task={task}
          developers={developers ?? []}
          projects={projects ?? []}
        />
      </div>
    </PageContainer>
  );
}