import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { SendMessageForm } from "@/features/support/components/send-message-form";
import { DeleteTicketButton } from "@/features/tickets/components/delete-ticket-button";

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export default async function AdminProjectSupportPage({
  params,
}: {
  params: Promise<{
    projectId: string;
  }>;
}) {
  const { projectId } =
    await params;

  const supabase =
    await createClient();

  const { data: project } =
    await supabase
      .from("projects")
      .select(`
        id,
        name,
        description,
        status,
        client_id
      `)
      .eq("id", projectId)
      .single();

  if (!project) {
    notFound();
  }

  const { data: client } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        email,
        company_name
      `)
      .eq(
        "id",
        project.client_id
      )
      .single();

  const { data: ticket } =
    await supabase
      .from("tickets")
      .select("*")
      .eq(
        "project_id",
        projectId
      )
      .single();

  if (!ticket) {
    notFound();
  }

  const { data: messages } =
    await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", {
        ascending: true,
      });

  return (
    <PageContainer>
     <PageHeader
            title={project.name}
            description="Client Support Conversation"
            />

            <DeleteTicketButton
            ticketId={ticket.id}
            />

      <SectionCard title="Client Information">
        <div className="space-y-2">
          <p>
            <strong>Name:</strong>{" "}
            {client?.full_name ??
              "Unknown"}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {client?.email}
          </p>

          <p>
            <strong>Company:</strong>{" "}
            {client?.company_name ??
              "-"}
          </p>

          <p>
            <strong>Project Status:</strong>{" "}
            {project.status}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Conversation">
        <div className="space-y-4">
          {messages?.length ? (
            messages.map(
              (
                message: Message
              ) => {
                const isClient =
                  message.sender_id ===
                  project.client_id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isClient
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-lg rounded-xl px-4 py-3 ${
                        isClient
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="mb-1 text-xs font-medium opacity-80">
                        {isClient
                          ? "Client"
                          : "Admin"}
                      </div>

                      <p className="whitespace-pre-wrap text-sm">
                        {
                          message.message
                        }
                      </p>

                      <p className="mt-2 text-xs opacity-70">
                        {new Date(
                          message.created_at
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              No messages yet.
            </p>
          )}
        </div>

        <SendMessageForm
          ticketId={ticket.id}
        />
      </SectionCard>
    </PageContainer>
  );
}