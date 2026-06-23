import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Button } from "@/components/ui/button";

import { ApproveProjectRequestButton } from "@/features/project-requests/components/approve-project-request-button";
import { RejectProjectRequestButton } from "@/features/project-requests/components/reject-project-request-button";

export default async function ProjectRequestPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

  const supabase =
    await createClient();

  const { data: request } =
    await supabase
      .from("project_requests")
      .select("*")
      .eq("id", id)
      .single();

  if (!request) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          request.project_name
        }
        description="Project Request Details"
      />

      <SectionCard title="Client Information">
        <div className="space-y-3">
          <p>
            <strong>
              Company:
            </strong>{" "}
            {
              request.company_name
            }
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {request.email}
          </p>

          <p>
            <strong>
              Phone:
            </strong>{" "}
            {request.phone ||
              "-"}
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Project Information">
        <div className="space-y-3">
          <p>
            <strong>
              Type:
            </strong>{" "}
            {
              request.project_type
            }
          </p>

          <p>
            <strong>
              Budget:
            </strong>{" "}
            {request.budget_range ||
              "Not specified"}
          </p>

          <p>
            <strong>
              Target Launch:
            </strong>{" "}
            {request.target_launch_date ||
              "Not specified"}
          </p>

          <div>
            <p className="mb-2 font-medium">
              Description
            </p>

            <div className="rounded-lg border p-4">
              <p className="whitespace-pre-wrap text-sm">
                {
                  request.description
                }
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Request Status">
        <div className="space-y-4">
          <div>
            <span className="rounded-md border px-3 py-1 text-sm font-medium">
              Status:{" "}
              {request.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {request.status ===
              "Pending" && (
              <>
                <ApproveProjectRequestButton
                  requestId={
                    request.id
                  }
                />

                <RejectProjectRequestButton
                  requestId={
                    request.id
                  }
                />
              </>
            )}

            {request.status ===
              "Approved" && (
              <Button asChild>
                <Link
                  href={`/admin/project-requests/${request.id}/create-project`}
                >
                  Create Project
                </Link>
              </Button>
            )}

            {request.status ===
              "Rejected" && (
              <Button
                variant="destructive"
                disabled
              >
                Request Rejected
              </Button>
            )}

            {request.status ===
              "Converted" && (
              <Button
                variant="outline"
                disabled
              >
                Project Created
              </Button>
            )}
          </div>
        </div>
      </SectionCard>
    </PageContainer>
  );
}