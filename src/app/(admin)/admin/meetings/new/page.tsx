import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { MeetingForm } from "@/features/meetings/components/meeting-form";

export default function NewMeetingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Create Meeting"
        description="Schedule a new meeting with a client."
      />

      <div className="max-w-3xl">
        <MeetingForm />
      </div>
    </PageContainer>
  );
}