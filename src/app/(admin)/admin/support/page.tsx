import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";


export default async function AdminSupportPage() {
  const supabase =
    await createClient();

  const { data: tickets } =
    await supabase
      .from("tickets")
      .select(`
        id,
        project_id,
        subject,
        status,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

  const conversations =
    await Promise.all(
      (tickets ?? []).map(
        async (ticket) => {
          const {
            data: project,
          } = await supabase
            .from("projects")
            .select(`
              id,
              name,
              client_id
            `)
            .eq(
              "id",
              ticket.project_id
            )
            .single();

          return {
            ...ticket,
            project,
          };
        }
      )
    );

  return (
    <PageContainer>
      <PageHeader
        title="Support"
        description="Manage client conversations"
      />

      <div className="grid gap-4">
        {conversations.length >
        0 ? (
          conversations.map(
            (ticket) => (
              <SectionCard
                key={ticket.id}
                title={
                  ticket.project
                    ?.name ??
                  ticket.subject
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {
                        ticket.subject
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      {
                        ticket.status
                      }
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        ticket.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/admin/support/${ticket.project_id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Open Chat
                  </Link>
                </div>
              </SectionCard>
            )
          )
        ) : (
          <SectionCard title="Support">
            <p className="text-sm text-muted-foreground">
              No support conversations found.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}