import Link from "next/link";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";

import { Button } from "@/components/ui/button";

import { TimezoneSelector } from "@/features/settings/components/timezone-selector";
import { ResetPasswordButton } from "@/features/settings/components/reset-password-button";

export default function AdminSettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your admin account and system preferences"
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
                  Send a password reset email.
                </p>
              </div>

              <ResetPasswordButton />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  Two-Factor Authentication
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

        <SectionCard title="Business Profile">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                Manage Business Details
              </h4>

              <p className="text-sm text-muted-foreground">
                Update company information from your profile page.
              </p>
            </div>

            <Button asChild>
              <Link href="/admin/profile">
                Open Profile
              </Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="System">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>
                Storage Management
              </span>

              <Button
                variant="outline"
                disabled
              >
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span>
                Email Configuration
              </span>

              <Button
                variant="outline"
                disabled
              >
                Configured
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Danger Zone">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-destructive">
                Delete Admin Account
              </h4>

              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>

            <Button
              variant="destructive"
              disabled
            >
              Coming Soon
            </Button>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}