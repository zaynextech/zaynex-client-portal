import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { CreateTaskForm } from "@/features/tasks/components/create-task-form";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export default async function CreateTaskPage() {
  const supabase = await createClient();

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
        {/* BACK */}
        <Link
          href="/admin/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Link>

        <PageHeader
          title="Create Task"
          description="Create and assign a new task to a developer."
        />

        <CreateTaskForm
          developers={developers ?? []}
          projects={projects ?? []}
        />
      </div>
    </PageContainer>
  );
}