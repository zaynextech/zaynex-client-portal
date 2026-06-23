import { notFound } from "next/navigation";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { getMeeting } from "@/features/meetings/actions/get-meeting";

import { MeetingForm } from "@/features/meetings/components/meeting-form";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMeetingPage({
  params,
}: Props) {
  const { id } =
    await params;

  const meeting =
    await getMeeting(id);

  if (!meeting) {
    notFound();
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Meeting"
        description="Update meeting details, status, and meeting link."
      />

      <div className="max-w-3xl">
        <MeetingForm
          meeting={
            meeting
          }
        />
      </div>
    </PageContainer>
  );
}