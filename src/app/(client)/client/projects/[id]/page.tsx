import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";
import { ClientUploadFile } from "@/features/projects/components/client-upload-file";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientProjectPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: project } =
    await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("client_id", user.id)
      .single();

  if (!project) {
    notFound();
  }

const { data: timeline } =
  await supabase
    .from("project_timeline")
    .select("*")
    .eq("project_id", id)
    .eq(
      "visible_to_client",
      true
    )
    .order("created_at");

const { data: files } =
  await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", id)
    .eq(
      "visible_to_client",
      true
    )
    .order("created_at", {
      ascending: false,
    });
    const { data: tasks } =
  await supabase
    .from("project_tasks")
    .select("*")
    .eq(
      "project_id",
      id
    )
    .eq(
      "visible_to_client",
      true
    )
    .order("created_at", {
      ascending: true,
    });
      
      

  return (
    <PageContainer>
      <PageHeader
        title={project.name}
        description={
          project.description ||
          "Project details"
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Project Information">
          <div className="space-y-3">
            <div>
              <strong>Status:</strong>{" "}
              {project.status}
            </div>

            <div>
              <strong>Progress:</strong>{" "}
              {project.progress}%
            </div>

            <div>
              <strong>Budget:</strong>{" "}
              {project.budget ?? "-"}
            </div>

            <div>
              <strong>Start Date:</strong>{" "}
              {project.start_date ?? "-"}
            </div>

            <div>
              <strong>Due Date:</strong>{" "}
              {project.due_date ?? "-"}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Progress">
          <div className="space-y-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

           <p className="text-sm text-muted-foreground">
              Project completion:
              {" "}
              <strong>
                {project.progress ?? 0}%
              </strong>
            </p>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Timeline">
        <div className="space-y-4">
          {timeline?.length ? (
            timeline.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {item.title}
                  </h4>

                  <span className="rounded-md border px-2 py-1 text-xs">
                    {item.status}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No timeline updates yet.
            </p>
          )}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
  <SectionCard title="Upload Files">
    <ClientUploadFile
      projectId={project.id}
    />
  </SectionCard>
  <SectionCard title="Tasks">
  <div className="space-y-4">
    {tasks?.length ? (
      tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-lg border p-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              {task.title}
            </h4>

            <span className="rounded-md border px-2 py-1 text-xs">
              {task.status}
            </span>
          </div>

          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
      ))
    ) : (
      <p className="text-muted-foreground">
        No tasks available.
      </p>
    )}
  </div>
</SectionCard>

  <SectionCard title="Project Files">
        <div className="space-y-3">
          {files?.length ? (
            files.map((file) => (
              <div
                  key={file.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {file.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Uploaded by:{" "}
                      {file.uploaded_by_role ?? "ADMIN"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        file.created_at
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      Preview
                    </a>

                    <a
                      href={file.file_url}
                      download={file.name}
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      Download
                    </a>
                  </div>
                </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No files uploaded yet.
            </p>
          )}
        </div>
      </SectionCard>
      </div>
    </PageContainer>
  );
}