import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

export default async function TicketsPage() {
  const supabase = await createClient();

  const { data: tickets } =
    await supabase
      .from("tickets")
      .select(`
        *,
        client:profiles(
          id,
          full_name,
          email
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="Tickets"
        description="Manage support tickets"
      />

      <div className="space-y-4">
        {tickets?.length ? (
          tickets.map((ticket) => (
            <SectionCard
              key={ticket.id}
              title={ticket.subject}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p>
                    <strong>
                      Client:
                    </strong>{" "}
                    {ticket.client
                      ?.full_name ||
                      ticket.client
                        ?.email ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Priority:
                    </strong>{" "}
                    {ticket.priority}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {ticket.status}
                  </p>
                </div>

                <Link
                  href={`/admin/tickets/${ticket.id}`}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Open Ticket
                </Link>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Tickets">
            <div className="text-muted-foreground">
              No tickets found.
            </div>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}