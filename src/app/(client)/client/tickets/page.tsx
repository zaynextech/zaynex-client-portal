import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";
import { CreateTicketDialog } from "@/features/tickets/components/create-ticket-dialog";

export default async function ClientTicketsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: tickets } =
    await supabase
      .from("tickets")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <PageContainer>
      <PageHeader
        title="Support Tickets"
        description="Contact the Zaynex team"
        action={<CreateTicketDialog />}
      />

      <div className="space-y-4">
        {tickets?.length ? (
          tickets.map((ticket) => (
            <SectionCard
              key={ticket.id}
              title={ticket.subject}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p>
                    Status:{" "}
                    {ticket.status}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      ticket.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  href={`/client/tickets/${ticket.id}`}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  Open
                </Link>
              </div>
            </SectionCard>
          ))
        ) : (
          <SectionCard title="Tickets">
            No tickets found.
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}