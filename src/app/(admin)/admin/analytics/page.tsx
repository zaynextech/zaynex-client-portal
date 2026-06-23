import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";

import { ProjectCalendar } from "@/features/analytics/components/project-calendar";
import { MeetingCalendar } from "@/features/analytics/components/meeting-calendar";

import { UpcomingDeadlines } from "@/features/analytics/components/upcoming-deadlines";
import { UpcomingMeetings } from "@/features/analytics/components/upcoming-meetings";

export default async function AnalyticsPage() {
  const supabase =
    await createClient();

  const [
    projectsResult,
    clientsResult,
    activeProjectsResult,
    completedProjectsResult,
    meetingsResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select(`
        id,
        name,
        status,
        progress,
        due_date,
        client:profiles(
          full_name
        )
      `),

    supabase
      .from("profiles")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "role",
        "CLIENT"
      ),

    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .neq(
        "status",
        "COMPLETED"
      ),

    supabase
      .from("projects")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "COMPLETED"
      ),

    supabase
      .from("meetings")
      .select("*"),
  ]);

  const projects =
    projectsResult.data ?? [];

  const meetings =
    meetingsResult.data ?? [];

  const totalClients =
    clientsResult.count ?? 0;

  const activeProjects =
    activeProjectsResult.count ??
    0;

  const completedProjects =
    completedProjectsResult.count ??
    0;

  const pendingMeetings =
    meetings.filter(
      (m) =>
        m.status ===
        "PENDING"
    ).length;

  const confirmedMeetings =
    meetings.filter(
      (m) =>
        m.status ===
        "CONFIRMED"
    ).length;

  const cancelledMeetings =
    meetings.filter(
      (m) =>
        m.status ===
        "CANCELLED"
    ).length;

  const today =
    new Date();

  const overdueProjects =
    projects.filter(
      (project) =>
        project.due_date &&
        new Date(
          project.due_date
        ) < today &&
        project.status !==
          "COMPLETED"
    ).length;

  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Project insights, meetings, and deadlines"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <StatCard
          title="Clients"
          value={totalClients}
          description="Registered clients"
        />

        <StatCard
          title="Active Projects"
          value={
            activeProjects
          }
          description="Currently running"
        />

        <StatCard
          title="Completed"
          value={
            completedProjects
          }
          description="Finished projects"
        />

        <StatCard
          title="Overdue"
          value={
            overdueProjects
          }
          description="Require attention"
        />

        <StatCard
          title="Pending Meetings"
          value={
            pendingMeetings
          }
          description="Awaiting review"
        />

        <StatCard
          title="Confirmed"
          value={
            confirmedMeetings
          }
          description="Scheduled"
        />

        <StatCard
          title="Cancelled"
          value={
            cancelledMeetings
          }
          description="Cancelled"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SectionCard title="Project Calendar">
            <ProjectCalendar
              projects={
                projects
              }
            />
          </SectionCard>

          <SectionCard title="Meeting Calendar">
            <MeetingCalendar
              meetings={
                meetings
              }
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Upcoming Deadlines">
            <UpcomingDeadlines
              projects={
                projects
              }
            />
          </SectionCard>

          <SectionCard title="Upcoming Meetings">
            <UpcomingMeetings
              meetings={
                meetings
              }
            />
          </SectionCard>
        </div>
      </div>
    </PageContainer>
  );
}