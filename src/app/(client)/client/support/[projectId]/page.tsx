// src/app/(client)/client/support/[projectId]/page.tsx

import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { SendMessageForm } from "@/features/support/components/send-message-form";

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export default async function ProjectSupportPage({
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

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
      .eq("client_id", user.id)
      .single();

  if (!project) {
    notFound();
  }

  let { data: ticket } =
    await supabase
      .from("tickets")
      .select(`
        id,
        subject,
        status,
        project_id
      `)
      .eq("project_id", projectId)
      .single();

  if (!ticket) {
    const {
      data: newTicket,
      error,
    } = await supabase
        .from("tickets")
        .insert({
            project_id: project.id,
            client_id: user.id,
            subject: `${project.name} Support`,
            status: "Open",
            priority: "Medium",
        })
      .select(`
        id,
        subject,
        status,
        project_id
      `)
      .single();

    if (error) {
      console.error(error);

      throw new Error(
        error.message
      );
    }

    ticket = newTicket;
  }

  if (!ticket) {
    throw new Error(
      "Failed to create support chat"
    );
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
        description="Chat directly with the Zaynex team about this project."
      />

      <SectionCard title="Project Information">
        <div className="space-y-2">
          <p>
            <span className="font-medium">
              Status:
            </span>{" "}
            {project.status}
          </p>

          {project.description && (
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Conversation">
        <div className="space-y-4">
          {messages &&
          messages.length > 0 ? (
            messages.map(
              (
                message: Message
              ) => {
                const isClient =
                  message.sender_id ===
                  user.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isClient
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-lg rounded-xl px-4 py-3 ${
                        isClient
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.message}
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
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No messages yet.
                Start the conversation below.
              </p>
            </div>
          )}
        </div>

        <SendMessageForm
          ticketId={ticket.id}
        />
      </SectionCard>
    </PageContainer>
  );
}