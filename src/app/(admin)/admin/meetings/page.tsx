import Link from "next/link";

import { Button } from "@/components/ui/button";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { getMeetings } from "@/features/meetings/actions/get-meetings";
import { MeetingsTable } from "@/features/meetings/components/meetings-table";

export default async function MeetingsPage() {
  const meetings =
    await getMeetings();

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Meetings"
          description="Manage client meetings and consultations."
        />

        <Link href="/admin/meetings/new">
          <Button>
            New Meeting
          </Button>
        </Link>
      </div>

      <MeetingsTable
        meetings={
          meetings ?? []
        }
      />
    </PageContainer>
  );
}