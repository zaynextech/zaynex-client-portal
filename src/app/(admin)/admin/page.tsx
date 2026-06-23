import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { SectionCard } from "@/components/shared/section-card";
import { DataTable } from "@/components/shared/data-table";

import { columns } from "@/features/dashboard/columns";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    clientsResult,
    projectsResult,
    ticketsResult,
    projectsTableResult,
    notificationsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("role", "CLIENT"),

    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "IN_PROGRESS"),

    supabase
      .from("support_tickets")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "OPEN"),

    supabase
      .from("projects")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(10),

    supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        created_at
      `)
      .eq("user_id", user!.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(3),
  ]);

  const totalClients = clientsResult.count ?? 0;
  const activeProjects = projectsResult.count ?? 0;
  const openTickets = ticketsResult.count ?? 0;
  const recentProjects = projectsTableResult.data ?? [];
  const activities = notificationsResult.data ?? [];

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Overview of your agency"
      />

      {/* 
        STAT CARDS GRID:
        - 1 column on smallest mobile screens (grid-cols-1)
        - 2 columns on small tablets (sm:grid-cols-2)
        - 4 columns on desktop layouts (xl:grid-cols-4)
      */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={totalClients}
          description="Registered clients"
        />

        <StatCard
          title="Active Projects"
          value={activeProjects}
          description="Currently running"
        />

        <StatCard
          title="Revenue"
          value="$0"
          description="Invoice integration coming soon"
        />

        <StatCard
          title="Open Tickets"
          value={openTickets}
          description="Awaiting response"
        />
      </div>

      {/* 
        MAIN DASHBOARD PANELS LAYOUT:
        - Added margin-top (mt-6) to cleanly separate stat rows
        - Uses grid-cols-1 natively, shifting to lg:grid-cols-3 on wider monitors
      */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        
        {/* Table Panel Container wrapper */}
        <div className="lg:col-span-2 min-w-0 w-full overflow-hidden">
          <SectionCard title="Recent Projects">
            {/* 
              DataTable Responsiveness:
              This wrapper isolates the nested standard table layout markup, 
              forcing an internal overflow-x scrollbar instead of stretching out the web page canvas layout.
            */}
            <div className="w-full overflow-x-auto rounded-md">
              <DataTable
                columns={columns}
                data={recentProjects}
              />
            </div>
          </SectionCard>
        </div>

        {/* Activity Feed Panel */}
        <div className="w-full min-w-0">
          <SectionCard title="Recent Activity">
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>

                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {activity.message}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground/80">
                        {new Date(activity.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-2 text-center">
                  No recent activity found.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

      </div>
    </PageContainer>
  );
}