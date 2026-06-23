import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Input } from "@/components/ui/input";

import { DeleteProjectRequestButton } from "@/features/project-requests/components/delete-project-request-button";

export default async function ProjectRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}) {
  const {
    search = "",
    status = "all",
  } = await searchParams;

  const supabase =
    await createClient();

  let query = supabase
    .from("project_requests")
    .select("*");

  if (search) {
    query = query.or(
      `company_name.ilike.%${search}%,email.ilike.%${search}%,project_name.ilike.%${search}%`
    );
  }

  if (status !== "all") {
    query = query.eq(
      "status",
      status
    );
  }

  const { data: requests } =
    await query.order(
      "created_at",
      {
        ascending: false,
      }
    );

  const { count: pendingCount } =
    await supabase
      .from("project_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Pending");

  const { count: approvedCount } =
    await supabase
      .from("project_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Approved");

  const { count: convertedCount } =
    await supabase
      .from("project_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Converted");

  const { count: rejectedCount } =
    await supabase
      .from("project_requests")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Rejected");

  return (
    <PageContainer>
      <PageHeader
        title="Project Requests"
        description="Manage incoming project requests"
      />

      <SectionCard title="Filters">
        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search company, email or project..."
            />

            <select
              name="status"
              defaultValue={status}
              className="h-10 rounded-md border bg-background px-3"
            >
              <option value="all">
                All Statuses
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Approved">
                Approved
              </option>

              <option value="Converted">
                Converted
              </option>

              <option value="Rejected">
                Rejected
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md border px-4 py-2 text-sm"
          >
            Apply Filters
          </button>
        </form>
      </SectionCard>

        <div className="grid gap-4 md:grid-cols-4">
          <SectionCard
            title="Pending"
          >
            <p className="text-2xl font-bold">
              {pendingCount ?? 0}
            </p>
          </SectionCard>

          <SectionCard
            title="Approved"
          >
            <p className="text-2xl font-bold">
              {approvedCount ?? 0}
            </p>
          </SectionCard>

          <SectionCard
            title="Converted"
          >
            <p className="text-2xl font-bold">
              {convertedCount ?? 0}
            </p>
          </SectionCard>

          <SectionCard
            title="Rejected"
          >
            <p className="text-2xl font-bold">
              {rejectedCount ?? 0}
            </p>
          </SectionCard>
        </div>

      <div className="grid gap-4">
        {requests?.length ? (
          requests.map(
            (request) => (
              <SectionCard
                key={request.id}
                title={
                  request.project_name
                }
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {
                        request.company_name
                      }
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {request.email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {
                        request.project_type
                      }
                    </p>

                    <div className="pt-1">
                      <span className="rounded-md border px-2 py-1 text-xs font-medium">
                        {
                          request.status
                        }
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/project-requests/${request.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Review
                    </Link>

                    <DeleteProjectRequestButton
                      requestId={
                        request.id
                      }
                    />
                  </div>
                </div>
              </SectionCard>
            )
          )
        ) : (
          <SectionCard title="Requests">
            <p className="text-sm text-muted-foreground">
              No project requests found.
            </p>
          </SectionCard>
        )}
      </div>
    </PageContainer>
  );
}