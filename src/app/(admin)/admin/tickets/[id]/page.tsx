import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

import { TicketReplyForm } from "@/features/tickets/components/ticket-reply-form";
import { CloseTicketButton } from "@/features/tickets/components/close-ticket-button";
import { TicketChat } from "@/features/tickets/components/ticket-chat";
import { DeleteTicketButton } from "@/features/tickets/components/delete-ticket-button";

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

  const { data: ticket } =
    await supabase
      .from("tickets")
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

  if (!ticket) {
    notFound();
  }

  const { data: messages } =
    await supabase
      .from("ticket_messages")
      .select(`
        *,
        sender:profiles(
          id,
          full_name,
          email
        )
      `)
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
        description={`Status: ${ticket.status}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Ticket Details">
          <div className="space-y-3">
            <div>
              <strong>
                Priority:
              </strong>{" "}
              {ticket.priority}
            </div>

            <div>
              <strong>
                Status:
              </strong>{" "}
              {ticket.status}
            </div>

            <div>
              <strong>
                Created:
              </strong>{" "}
              {new Date(
                ticket.created_at
              ).toLocaleDateString()}
            </div>

             {ticket.status !==
                    "Closed" && (
                    <CloseTicketButton
                      ticketId={ticket.id}
                    />
                  )}

                  <DeleteTicketButton
                    ticketId={ticket.id}
                  />
                </div>
        </SectionCard>

        <SectionCard title="Client">
          <div className="space-y-3">
            <div>
              <strong>
                Name:
              </strong>{" "}
              {ticket.client
                ?.full_name ??
                "-"}
            </div>

            <div>
              <strong>
                Email:
              </strong>{" "}
              {ticket.client
                ?.email ?? "-"}
            </div>

            <div>
              <strong>
                Company:
              </strong>{" "}
              {ticket.client
                ?.company_name ??
                "-"}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Conversation">
        <div className="space-y-4">
          {messages?.length ? (
            messages.map(
              (message) => (
                <div
                  key={message.id}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">
                      {message.sender
                        ?.full_name ||
                        message.sender
                          ?.email ||
                        "User"}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {new Date(
                        message.created_at
                      ).toLocaleString()}
                    </span>
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
            <p className="text-muted-foreground">
              No messages.
            </p>
          )}
        </div>
      </SectionCard>

      {ticket.status !==
        "Closed" && (
        <SectionCard title="Reply">
          <TicketReplyForm
            ticketId={ticket.id}
          />
        </SectionCard>
      )}
    </PageContainer>
    </>
  );
}