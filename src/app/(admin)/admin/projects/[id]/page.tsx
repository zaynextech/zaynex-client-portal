import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

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

export default async function ProjectPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

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

const { data: notes } =
  await supabase
    .from("project_notes")
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .eq(
      "project_id",
      project.id
    )
    .order("pinned", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

    const { data: tasks } =
  await supabase
    .from("project_tasks")
    .select("*")
    .eq(
      "project_id",
      project.id
    )
    .order(
      "position",
      {
        ascending: true,
      }
    );

    const timeline =
  await getProjectTimeline(id);

  const files =
  await getProjectFiles(id);
  if (!project) {
    notFound();
  }

  return (
    <PageContainer>
     <PageHeader
  title={project.name}
  description={
    project.description ||
    "No description provided"
  }
  action={
    <div className="flex gap-2">
      <EditProjectDialog
        project={project}
      />

      <DeleteProjectButton
        projectId={project.id}
      />
    </div>
  }
/>

      <div className="grid gap-6 lg:grid-cols-2">
       <SectionCard title="Project Details">
  <div className="space-y-5">
    <div>
      <strong>Status:</strong>{" "}
      <span className="rounded-md border px-2 py-1 text-xs">
        {project.status}
      </span>
    </div>

    <div>
      <strong>Progress:</strong>

      <div className="mt-2">
        <div className="mb-2 flex justify-between text-sm">
          <span>
            {project.progress ?? 0}%
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{
              width: `${project.progress ?? 0}%`,
            }}
          />
        </div>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-sm text-muted-foreground">
          Budget
        </p>

        <p className="font-medium">
          {project.budget
            ? `$${project.budget}`
            : "-"}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Start Date
        </p>

        <p className="font-medium">
          {project.start_date
            ? new Date(
                project.start_date
              ).toLocaleDateString()
            : "-"}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Due Date
        </p>

        <p className="font-medium">
          {project.due_date
            ? new Date(
                project.due_date
              ).toLocaleDateString()
            : "-"}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          Project ID
        </p>

        <p className="font-medium">
          {project.id}
        </p>
      </div>
    </div>

    <div>
      <p className="text-sm text-muted-foreground">
        Description
      </p>

      <p className="mt-1">
        {project.description ||
          "No description provided."}
      </p>
    </div>
  </div>
</SectionCard>

        <SectionCard title="Client">
          <div className="space-y-3">
            <div>
              <strong>Name:</strong>{" "}
              {project.client?.full_name ??
                "-"}
            </div>

            <div>
              <strong>Email:</strong>{" "}
              {project.client?.email ??
                "-"}
            </div>

            <div>
              <strong>Company:</strong>{" "}
              {project.client
                ?.company_name ?? "-"}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Timeline"
        action={
          <AddTimelineDialog
            projectId={project.id}
          />
        }
      >
        <ProjectTimeline
          items={timeline}
          projectId={project.id}
        />
      </SectionCard>

      <SectionCard
        title="Files"
        action={
          <UploadProjectFile
            projectId={project.id}
          />
        }
      >
        <ProjectFiles files={files} />
      </SectionCard>

      <SectionCard title="Internal Notes">
          <ProjectNotes
            projectId={project.id}
          />

          <div className="mt-6 space-y-4">
            {notes?.length ? (
              notes.map((note) => (
                <ProjectNoteCard
                  key={note.id}
                  note={note}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No notes yet.
              </div>
            )}
          </div>
      </SectionCard>

      <SectionCard
        title="Tasks Board"
        action={
          <CreateProjectTaskDialog
            projectId={project.id}
          />
        }
      >
        <ProjectTaskBoard
          projectId={project.id}
          tasks={tasks ?? []}
        />
      </SectionCard>

    </PageContainer>
  );
}