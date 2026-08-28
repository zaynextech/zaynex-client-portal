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

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function DeveloperProjectSupportPage({
  params,
}: PageProps) {
  const { projectId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Verify developer belongs to this project
  const { data: membership } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) {
    notFound();
  }

  // Project
  const { data: project } = await supabase
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

  // Client
  const { data: client } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      company_name
    `)
    .eq("id", project.client_id)
    .single();

  // Ticket
  const { data: ticket } = await supabase
    .from("tickets")
    .select(`
      id,
      project_id,
      subject,
      status,
      created_at
    `)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!ticket) {
    notFound();
  }

  // Messages
  const { data: messages, error } = await supabase
    .from("ticket_messages")
    .select(`
      id,
      sender_id,
      message,
      created_at
    `)
    .eq("ticket_id", ticket.id)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const messageList = (messages ?? []) as Message[];

  return (
    <PageContainer>
      <PageHeader
        title={project.name}
        description="Client Support Conversation"
      />

      {/* Client Information */}
      <SectionCard title="Client Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Name
            </p>

            <p className="mt-1 font-medium">
              {client?.full_name ?? "Unknown"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Email
            </p>

            <p className="mt-1 font-medium">
              {client?.email ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Company
            </p>

            <p className="mt-1 font-medium">
              {client?.company_name ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Project Status
            </p>

            <p className="mt-1 font-medium">
              {project.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Ticket Status
            </p>

            <p className="mt-1 font-medium">
              {ticket.status}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Subject
            </p>

            <p className="mt-1 font-medium">
              {ticket.subject}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Conversation */}
      <SectionCard title="Conversation">
        <div className="space-y-4">
          {messageList.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium">
                No messages yet.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Send a message to start the conversation.
              </p>
            </div>
          ) : (
            messageList.map((message) => {
              const isClient =
                message.sender_id === project.client_id;

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
                      {isClient ? "Client" : "Developer"}
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.message}
                    </p>

                    <p
                      className="mt-2 text-xs opacity-70"
                      suppressHydrationWarning
                    >
                      {new Date(
                        message.created_at
                      ).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Developer can reply */}
        <div className="mt-6 border-t pt-6">
          <SendMessageForm ticketId={ticket.id} />
        </div>
      </SectionCard>
    </PageContainer>
  );
}