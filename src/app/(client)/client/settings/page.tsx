import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/server";

import { TimezoneSelector } from "@/features/settings/components/timezone-selector";
import { ResetPasswordButton } from "@/features/settings/components/reset-password-button";
import { RequestAccountDeletionButton } from "@/features/settings/components/request-account-deletion-button";
import { CancelAccountDeletionButton } from "@/features/settings/components/cancel-account-deletion-button";

export default async function ClientSettingsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: deletionRequest } =
    user
      ? await supabase
          .from(
            "account_deletion_requests"
          )
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle()
      : { data: null };

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your account settings"
      />

      <div className="space-y-6">
        <SectionCard title="Security">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  Password
                </h4>

                <p className="text-sm text-muted-foreground">
                  Send a password reset email to your account.
                </p>
              </div>

              <ResetPasswordButton />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  Devices Logged In
                </h4>

                <p className="text-sm text-muted-foreground">
                  Coming soon.
                </p>
              </div>

              <Button
                variant="outline"
                disabled
              >
                Coming Soon
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Appearance">
          <div>
            <h4 className="font-medium">
              Theme
            </h4>

            <p className="text-sm text-muted-foreground">
              Theme settings are available from the navigation bar.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Preferences">
          <TimezoneSelector />

          <div className="mt-6 flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                Language
              </h4>

              <p className="text-sm text-muted-foreground">
                Coming soon.
              </p>
            </div>

            <Button
              variant="outline"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Danger Zone">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">
                Account Deletion
              </h4>

              {!deletionRequest && (
                <p className="text-sm text-muted-foreground">
                  Submit a request for the Zaynex team to review.
                </p>
              )}

              {deletionRequest?.status ===
                "Pending" && (
                <p className="text-sm text-amber-600">
                  Your deletion request is pending review.
                </p>
              )}

              {deletionRequest?.status ===
                "Approved" && (
                <p className="text-sm text-green-600">
                  Your request has been approved.
                </p>
              )}

              {deletionRequest?.status ===
                "Rejected" && (
                <p className="text-sm text-red-600">
                  Your request has been rejected.
                </p>
              )}
            </div>

            {!deletionRequest && (
              <RequestAccountDeletionButton />
            )}

            {deletionRequest?.status ===
              "Pending" && (
              <CancelAccountDeletionButton />
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}