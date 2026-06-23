"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { sendMeetingConfirmationEmail } from "@/lib/emails/send-meeting-confirmation-email";

interface UpdateMeetingInput {
  id: string;

  client_name?: string;
  email?: string;
  phone?: string;

  meeting_type?: string;

  meeting_date?: string;
  meeting_time?: string;

  notes?: string;

  status?:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

  meeting_link?: string;
}

export async function updateMeeting(
  input: UpdateMeetingInput
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("meetings")
    .update({
      client_name:
        input.client_name,

      email:
        input.email,

      phone:
        input.phone,

      meeting_type:
        input.meeting_type,

      meeting_date:
        input.meeting_date,

      meeting_time:
        input.meeting_time,

      notes:
        input.notes,

      status:
        input.status,

      meeting_link:
        input.meeting_link,
    })
    .eq(
      "id",
      input.id
    )
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  if (
    data &&
    data.status ===
      "CONFIRMED" &&
    data.meeting_link
  ) {
    try {
      console.log("SENDING MEETING EMAIL");
      console.log(data.email);
      console.log(data.meeting_link);
      await sendMeetingConfirmationEmail(
        {
          email:
            data.email,

          clientName:
            data.client_name,

          meetingDate:
            data.meeting_date,

          meetingTime:
            data.meeting_time,

          meetingLink:
            data.meeting_link,
        }
      );
    } catch (
      emailError
    ) {
      console.error(
        "Meeting email error:",
        emailError
      );
    }
  }

  revalidatePath(
    "/admin/meetings"
  );

  revalidatePath(
    `/admin/meetings/${input.id}`
  );

  return data;
}