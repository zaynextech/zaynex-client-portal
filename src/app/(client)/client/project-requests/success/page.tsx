import Link from "next/link";

import { Button } from "@/components/ui/button";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

export default function ProjectRequestSuccessPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Request Submitted"
        description="Your project request has been received successfully."
      />

      <div className="mx-auto max-w-xl rounded-xl border p-8 text-center">
        <h2 className="text-2xl font-semibold">
          Thank You
        </h2>

        <p className="mt-3 text-muted-foreground">
          Our team will review your request and contact you shortly.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/client/dashboard">
              Back to Website
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
          >
            <Link href="/client/project-requests">
              Submit Another Request
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}