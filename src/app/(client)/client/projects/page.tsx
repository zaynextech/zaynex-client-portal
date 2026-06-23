import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

export default async function ClientProjectsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      client:profiles(
        id,
        full_name,
        email
      )
    `)
    .eq("client_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  return (
    <PageContainer>
      <PageHeader
        title="My Projects"
        description="Track project progress and updates"
      />

      <div className="grid gap-6">
        {projects?.length ? (
          projects.map((project) => (
            <SectionCard
              key={project.id}
              title={project.name}
            >
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Status
                    </p>

                    <p className="font-medium">
                      {project.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Progress
                    </p>

                    <p className="font-medium">
                      {project.progress}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Start Date
                    </p>

                    <p>
                      {project.start_date ??
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Due Date
                    </p>

                    <p>
                      {project.due_date ??
                        "-"}
                    </p>
                  </div>
                </div>

                {project.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Description
                    </p>

                    <p className="mt-1">
                      {project.description}
                    </p>
                  </div>
                )}

                <Link
                  href={`/client/projects/${project.id}`}
                  className="inline-flex rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  View Project
                </Link>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Projects">
            <div className="text-muted-foreground">
              No projects found.
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}