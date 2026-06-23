import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";
import { FreezeClientButton } from "@/features/clients/components/freeze-client-button";
import { DeleteClientButton } from "@/features/clients/components/delete-client-button";
import { UnfreezeClientButton } from "@/features/clients/components/unfreeze-client-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const { data: client } =
    await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

  if (!client) {
    notFound();
  }

  const {
    count: projectsCount,
  } = await supabase
    .from("projects")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("client_id", id);

  const {
    count: ticketsCount,
  } = await supabase
    .from("tickets")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", id);

  const {
    count: filesCount,
  } = await supabase
    .from("project_files")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("uploaded_by", id);

  return (
    <PageContainer>
      <PageHeader
        title={
          client.full_name ||
          "Client"
        }
        description={
          client.email
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Client Information">
          <div className="space-y-3">
            <div>
              <strong>Name:</strong>{" "}
              {client.full_name ??
                "-"}
            </div>

            <div>
              <strong>Email:</strong>{" "}
              {client.email}
            </div>

            <div>
              <strong>Phone:</strong>{" "}
              {client.phone ??
                "-"}
            </div>

            <div>
              <strong>Company:</strong>{" "}
              {client.company_name ??
                "-"}
            </div>

            <div>
              <strong>Role:</strong>{" "}
              {client.role}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Statistics">
          <div className="space-y-3">
            <div>
              <strong>Projects:</strong>{" "}
              {projectsCount ??
                0}
            </div>

            <div>
              <strong>Tickets:</strong>{" "}
              {ticketsCount ??
                0}
            </div>

            <div>
              <strong>Files:</strong>{" "}
              {filesCount ??
                0}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Danger Zone">
  <div className="flex flex-wrap gap-3">
   {client.status ===
            "FROZEN" ? (
            <UnfreezeClientButton
                clientId={client.id}
            />
            ) : (
            <FreezeClientButton
                clientId={client.id}
            />
            )}

    <DeleteClientButton
      clientId={client.id}
    />
  </div>
</SectionCard>
    </PageContainer>
  );
}