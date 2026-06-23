import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

import { EmailCampaignForm } from "@/features/emails/components/email-campaign-form";

export default async function EmailsPage() {
  const supabase =
    await createClient();

  const [
    profilesResult,
    subscribersResult,
    projectsResult,
    campaignsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(`
        id,
        email,
        role
      `),

    supabase
      .from(
        "newsletter_subscribers"
      )
      .select(`
        id,
        email
      `)
      .eq("active", true),

    supabase
      .from("projects")
      .select(`
        id,
        client_id
      `),

    supabase
      .from(
        "email_campaigns"
      )
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(10),
  ]);

  const profiles =
    profilesResult.data ?? [];

  const subscribers =
    subscribersResult.data ?? [];

  const projects =
    projectsResult.data ?? [];

  const campaigns =
    campaignsResult.data ?? [];

  const totalContacts =
    profiles.length;

  const totalSubscribers =
    subscribers.length;

  const clients =
    profiles.filter(
      (profile) =>
        profile.role ===
        "CLIENT"
    );

  const clientsWithProjects =
    clients.filter(
      (client) =>
        projects.some(
          (project) =>
            project.client_id ===
            client.id
        )
    );

  const clientsWithoutProjects =
    clients.filter(
      (client) =>
        !projects.some(
          (project) =>
            project.client_id ===
            client.id
        )
    );

  return (
    <PageContainer>
      <PageHeader
        title="Email Center"
        description="Manage campaigns, announcements and newsletters"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Contacts"
          value={
            totalContacts
          }
          description="All contacts"
        />

        <StatCard
          title="Subscribers"
          value={
            totalSubscribers
          }
          description="Newsletter list"
        />

        <StatCard
          title="Clients"
          value={
            clients.length
          }
          description="Registered clients"
        />

        <StatCard
          title="With Projects"
          value={
            clientsWithProjects.length
          }
          description="Active clients"
        />

        <StatCard
          title="No Projects"
          value={
            clientsWithoutProjects.length
          }
          description="Potential leads"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard
            title="Create Campaign"
          >
            <EmailCampaignForm />
          </SectionCard>
        </div>

        <SectionCard
          title="Audience Overview"
        >
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                All Contacts
              </p>

              <p className="text-2xl font-bold">
                {
                  totalContacts
                }
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Subscribers
              </p>

              <p className="text-2xl font-bold">
                {
                  totalSubscribers
                }
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Clients
              </p>

              <p className="text-2xl font-bold">
                {
                  clients.length
                }
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Clients With
                Projects
              </p>

              <p className="text-2xl font-bold">
                {
                  clientsWithProjects.length
                }
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent Campaigns"
      >
        {campaigns.length >
        0 ? (
          <div className="space-y-4">
            {campaigns.map(
              (
                campaign
              ) => (
                <div
                  key={
                    campaign.id
                  }
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        {
                          campaign.title
                        }
                      </h3>

                      <p className="text-sm text-muted-foreground">
                        {
                          campaign.campaign_type
                        }
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        {
                          campaign.sent_count
                        }
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Sent
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Audience:
                    {" "}
                    {
                      campaign.audience
                    }
                  </p>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No campaigns
            sent yet.
          </p>
        )}
      </SectionCard>
    </PageContainer>
  );
}