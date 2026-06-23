import Link from "next/link";

import { Button } from "@/components/ui/button";

import { LogoutButton } from "@/components/auth/logout-button";
import { RequestAccountDeletionButton } from "@/features/settings/components/request-account-deletion-button";

export default function SuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl border p-8 text-center">
        <h1 className="text-3xl font-bold">
          Account Suspended
        </h1>

        <p className="mt-3 text-muted-foreground">
          Your account has been temporarily suspended by the Zaynex administration team.
        </p>

        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-left">
          <h2 className="font-medium">
            What this means
          </h2>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Access to the client portal is restricted.
            </li>

            <li>
              File uploads are disabled.
            </li>

            <li>
              Support tickets cannot be created.
            </li>

            <li>
              Project access is temporarily unavailable.
            </li>
          </ul>
        </div>

        <div className="mt-6 rounded-lg border bg-muted/30 p-4 text-left">
          <h2 className="font-medium">
            Need assistance?
          </h2>

          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              Email: contact@zaynex.tech
            </p>

            <p>
              Website: zaynex.tech
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-destructive/20 p-4 text-left">
          <h2 className="font-medium text-destructive">
            Account Deletion
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            If you no longer wish to use your account, you may submit an account deletion request for review.
          </p>

          <div className="mt-4">
            <RequestAccountDeletionButton />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              Go to Website
            </Link>
          </Button>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}