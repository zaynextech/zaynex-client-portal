import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

export default async function ClientDashboardPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [
    projectsResult,
    invoicesResult,
    ticketsResult,
    notificationsResult,
    deadlinesResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "client_id",
        user.id
      ),

    supabase
      .from("invoices")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "client_id",
        user.id
      )
      .eq(
        "status",
        "Pending"
      ),

    supabase
      .from("support_tickets")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "client_id",
        user.id
      )
      .eq(
        "status",
        "OPEN"
      ),

    supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        created_at
      `)
      .eq(
        "user_id",
        user.id
      )
      .order("created_at", {
        ascending: false,
      })
      .limit(3),

    supabase
      .from("projects")
      .select(`
        id,
        name,
        due_date
      `)
      .eq(
        "client_id",
        user.id
      )
      .not(
        "due_date",
        "is",
        null
      )
      .order("due_date", {
        ascending: true,
      })
      .limit(5),
  ]);

  const activeProjects =
    projectsResult.count ?? 0;

  const pendingInvoices =
    invoicesResult.count ?? 0;

  const openTickets =
    ticketsResult.count ?? 0;

  const recentUpdates =
    notificationsResult.data ??
    [];

  const deadlines =
    deadlinesResult.data ??
    [];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Projects"
          value={activeProjects}
          description="Your active projects"
        />

        <StatCard
          title="Invoices"
          value={pendingInvoices}
          description="Pending invoices"
        />

        <StatCard
          title="Support Tickets"
          value={openTickets}
          description="Open conversations"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recent Updates">
          <div className="space-y-4">
            {recentUpdates.length >
            0 ? (
              recentUpdates.map(
                (update) => (
                  <div
                    key={
                      update.id
                    }
                    className="border-b pb-3 last:border-0"
                  >
                    <div className="font-medium text-sm">
                      {
                        update.title
                      }
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {
                        update.message
                      }
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        update.created_at
                      ).toLocaleString()}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent updates.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming Deadlines">
          <div className="space-y-4">
            {deadlines.length >
            0 ? (
              deadlines.map(
                (item) => (
                  <div
                    key={item.id}
                    className="border-b pb-3 last:border-0"
                  >
                    <div className="font-medium">
                      {item.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Due:{" "}
                      {new Date(
                        item.due_date
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming deadlines.
              </p>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}