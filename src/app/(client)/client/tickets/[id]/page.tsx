import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";
import { TicketChat } from "@/features/tickets/components/ticket-chat";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketPage({
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

  const { data: ticket } =
    await supabase
      .from("tickets")
      .select("*")
      .eq("id", id)
      .eq("client_id", user.id)
      .single();

  if (!ticket) {
    notFound();
  }

  const { data: messages } =
    await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at");

  return (
    <>
        <TicketChat
      ticketId={ticket.id}
    />
    <PageContainer>
      <PageHeader
        title={ticket.subject}
        description={ticket.status}
      />

      <SectionCard title="Conversation">
        <div className="space-y-4">
          {messages?.length ? (
            messages.map(
              (message) => (
                <div
                  key={message.id}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 text-xs text-muted-foreground">
                    {new Date(
                      message.created_at
                    ).toLocaleString()}
                  </div>

                  <p>
                    {
                      message.message
                    }
                  </p>
                </div>
              )
            )
          ) : (
            <p>
              No messages yet.
            </p>
          )}
        </div>
      </SectionCard>
    </PageContainer>
    </>
  );
}