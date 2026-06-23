// src/app/(admin)/admin/project-requests/[id]/create-project/page.tsx

import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CreateClientFromRequestButton } from "@/features/project-requests/components/create-client-from-request-button";
import { createProjectFromRequest } from "@/features/project-requests/actions/create-project-from-request";

export default async function CreateProjectPage({
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
        title="Create Project"
        description="Convert approved request into a project."
      />

      <SectionCard title="Request Information">
        <div className="space-y-2">
          <p>
            <span className="font-medium">
              Company:
            </span>{" "}
            {request.company_name}
          </p>

          <p>
            <span className="font-medium">
              Email:
            </span>{" "}
            {request.email}
          </p>

          <p>
            <span className="font-medium">
              Project Type:
            </span>{" "}
            {request.project_type}
          </p>

          <p>
            <span className="font-medium">
              Status:
            </span>{" "}
            {request.status}
          </p>
        </div>
      </SectionCard>

      {!request.client_id && (
        <SectionCard title="Client Account Required">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This requester does not
              have a client account yet.
            </p>

            <CreateClientFromRequestButton
              requestId={request.id}
            />
          </div>
        </SectionCard>
      )}

      {request.client_id && (
        <SectionCard title="Project Details">
          <form
            action={
              createProjectFromRequest
            }
            className="space-y-6"
          >
            <input
              type="hidden"
              name="requestId"
              value={request.id}
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Project Name
              </label>

              <Input
                name="projectName"
                defaultValue={
                  request.project_name
                }
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <Textarea
                name="description"
                rows={8}
                defaultValue={
                  request.description
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Budget
                </label>

                <Input
                  name="budget"
                  defaultValue={
                    request.budget_range
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Due Date
                </label>

                <Input
                  name="dueDate"
                  type="date"
                  defaultValue={
                    request.target_launch_date
                  }
                />
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Client account already
                exists. Review the project
                details below and click
                Create Project.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              Create Project
            </Button>
          </form>
        </SectionCard>
      )}
    </PageContainer>
  );
}