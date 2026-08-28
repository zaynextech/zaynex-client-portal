import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

export default async function DeveloperSupportPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Only projects assigned to this developer
  const { data: memberships, error: membershipError } =
    await supabase
      .from("project_members")
      .select(`
        project_id,
        projects (
          id,
          name
        )
      `)
      .eq("user_id", user.id);

  if (membershipError) {
    throw new Error(membershipError.message);
  }

  const projectIds = (memberships ?? [])
    .map((membership) => membership.project_id)
    .filter(Boolean);

  if (projectIds.length === 0) {
    return (
      <PageContainer>
        <PageHeader
          title="Support"
          description="Client support conversations"
        />

        <SectionCard title="Support">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground/50" />

            <p className="mt-4 font-semibold">
              No projects assigned
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Support conversations will appear here when you are assigned to a project.
            </p>
          </div>
        </SectionCard>
      </PageContainer>
    );
  }

  // Get tickets for developer's projects
  const { data: tickets, error: ticketError } = await supabase
    .from("tickets")
    .select(`
      id,
      project_id,
      subject,
      status,
      created_at
    `)
    .in("project_id", projectIds)
    .order("created_at", {
      ascending: false,
    });

  if (ticketError) {
    throw new Error(ticketError.message);
  }

  const projectMap = new Map<string, string>();

  for (const membership of memberships ?? []) {
    const project = Array.isArray(membership.projects)
      ? membership.projects[0]
      : membership.projects;

    if (project) {
      projectMap.set(project.id, project.name);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Support"
        description="Client support conversations"
      />

      <div className="space-y-4">
        {tickets?.length ? (
          tickets.map((ticket) => (
            <SectionCard
              key={ticket.id}
              title={
                projectMap.get(ticket.project_id) ??
                "Unknown Project"
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">
                    {ticket.subject}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>
                      Status:{" "}
                      <span className="font-medium text-foreground">
                        {ticket.status}
                      </span>
                    </span>

                    <span>
                      {new Date(
                        ticket.created_at
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/developer/support/${ticket.project_id}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  Open Chat
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Support">
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground/50" />

              <p className="mt-3 font-medium">
                No support conversations
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Client conversations will appear here.
              </p>
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}