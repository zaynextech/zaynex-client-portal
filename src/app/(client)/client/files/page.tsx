import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

export default async function ClientFilesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: files } =
    await supabase
      .from("project_files")
      .select(`
        *,
        project:projects(
          id,
          name,
          client_id
        )
      `)
      .eq(
        "project.client_id",
        user.id
      )
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="Files"
        description="All project files shared with you"
      />

      <div className="space-y-4">
        {files?.length ? (
          files.map((file) => (
            <SectionCard
              key={file.id}
              title={file.file_name}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Project
                  </p>

                  <p className="font-medium">
                    {file.project
                      ?.name ?? "-"}
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Uploaded by{" "}
                    {file.uploaded_by_role ??
                      "ADMIN"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      file.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Preview
                  </a>

                  <a
                    href={file.file_url}
                    download
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Download
                  </a>

                  <Link
                    href={`/client/projects/${file.project_id}`}
                    className="rounded-md border px-4 py-2 text-sm"
                  >
                    Project
                  </Link>
                </div>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Files">
            <p className="text-muted-foreground">
              No files available.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}