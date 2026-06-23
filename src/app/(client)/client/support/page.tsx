// src/app/(client)/client/support/page.tsx

import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

export default async function SupportPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: projects } =
    await supabase
      .from("projects")
      .select(`
        id,
        name,
        description,
        status
      `)
      .eq("client_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="Support"
        description="Select a project to start a conversation with the Zaynex team."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {projects?.length ? (
          projects.map((project) => (
           <SectionCard
                key={project.id}
                title={project.name}
                >
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-muted-foreground">
                        Project Support
                    </p>

                    <span className="mt-1 inline-flex rounded-md border px-2 py-1 text-xs">
                        {project.status}
                    </span>
                    </div>

                    <Link
                    href={`/client/support/${project.id}`}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                    Open Chat
                    </Link>
                </div>
                </SectionCard>
          ))
        ) : (
          <SectionCard title="No Projects">
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any projects yet.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}