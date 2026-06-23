import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/server";

import { approveAccountDeletion } from "@/features/settings/actions/approve-account-deletion";
import { rejectAccountDeletion } from "@/features/settings/actions/reject-account-deletion";

type AccountDeletionRequest = {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    id: string;
    email: string;
    full_name: string | null;
    role: string | null;
  } | null;
};

export default async function AccountDeletionRequestsPage() {
  const supabase =
    await createClient();

  const {
    data: requests,
    error,
  } = await supabase
    .from(
      "account_deletion_requests"
    )
    .select(`
      id,
      user_id,
      status,
      created_at,
      profiles!account_deletion_requests_user_id_fkey (
        id,
        email,
        full_name,
        role
      )
    `)
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    return (
      <PageContainer>
        <PageHeader
          title="Account Deletion Requests"
          description="Manage account deletion requests"
        />

        <SectionCard title="Error">
          <p className="text-destructive">
            {error.message}
          </p>
        </SectionCard>
      </PageContainer>
    );
  }

  const data =
    (requests ??
      []) as unknown as AccountDeletionRequest[];

  return (
    <PageContainer>
      <PageHeader
        title="Account Deletion Requests"
        description="Manage account deletion requests"
      />

      <SectionCard title="Requests">
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map(
              (request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <h4 className="font-medium">
                      {request.profiles
                        ?.full_name ||
                        "Unknown User"}
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {request.profiles
                        ?.email ||
                        request.user_id}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Role:{" "}
                      {request.profiles
                        ?.role ??
                        "-"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      {request.status}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        request.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  {request.status ===
                    "Pending" && (
                    <div className="flex gap-2">
                      <form
                        action={async () => {
                          "use server";

                          await approveAccountDeletion(
                            request.id
                          );
                        }}
                      >
                        <Button>
                          Approve
                        </Button>
                      </form>

                      <form
                        action={async () => {
                          "use server";

                          await rejectAccountDeletion(
                            request.id
                          );
                        }}
                      >
                        <Button variant="destructive">
                          Reject
                        </Button>
                      </form>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <p className="text-muted-foreground">
              No deletion requests found.
            </p>
          )}
        </div>
      </SectionCard>
    </PageContainer>
  );
}