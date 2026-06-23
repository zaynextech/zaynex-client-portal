import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { createClient } from "@/lib/supabase/server";

export default async function ClientDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id);

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .eq("client_id", user.id);

  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .eq("client_id", user.id);

  const { data: activity } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  const activeProjects =
    projects?.filter(
      (p) => p.status !== "COMPLETED"
    ).length ?? 0;

  const openTickets =
    tickets?.filter(
      (t) => t.status !== "Closed"
    ).length ?? 0;

  const unpaidInvoices =
    invoices?.filter(
      (i) => i.status !== "Paid"
    ).length ?? 0;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Projects">
          <div className="text-3xl font-bold">
            {activeProjects}
          </div>
          <p className="text-sm text-muted-foreground">
            Active Projects
          </p>
        </SectionCard>

        <SectionCard title="Invoices">
          <div className="text-3xl font-bold">
            {unpaidInvoices}
          </div>
          <p className="text-sm text-muted-foreground">
            Unpaid Invoices
          </p>
        </SectionCard>

        <SectionCard title="Tickets">
          <div className="text-3xl font-bold">
            {openTickets}
          </div>
          <p className="text-sm text-muted-foreground">
            Open Tickets
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Recent Activity">
        <div className="space-y-4">
          {activity?.length ? (
            activity.map((item) => (
              <div
                key={item.id}
                className="border-b pb-3"
              >
                <div className="font-medium">
                  {item.action}
                </div>

                <div className="text-xs text-muted-foreground">
                  {new Date(
                    item.created_at
                  ).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent activity.
            </div>
          )}
        </div>
      </SectionCard>
    </PageContainer>
  );
}