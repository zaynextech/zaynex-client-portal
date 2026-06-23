"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";

interface CreateMeetingInput {
  client_name: string;
  email: string;
  phone?: string;

  meeting_type: string;

  meeting_date: string;
  meeting_time: string;

  notes?: string;

  status?: string;
  meeting_link?: string;
}

export async function createMeeting(
  input: CreateMeetingInput
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("meetings")
    .insert({
      client_name:
        input.client_name,

      email:
        input.email,

      phone:
        input.phone ?? null,

      meeting_type:
        input.meeting_type,

      meeting_date:
        input.meeting_date,

      meeting_time:
        input.meeting_time,

      notes:
        input.notes ?? null,

      status:
        input.status ??
        "PENDING",

      meeting_link:
        input.meeting_link ??
        null,
    })
    .select()
    .single();

if (error) {
  console.error("MEETING ERROR:", error);

  throw new Error(
    JSON.stringify(error)
  );
}

  const { data: admins } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("role", "ADMIN");

  for (const admin of admins ?? []) {
    await createNotification({
      userId: admin.id,

      title:
        "New Meeting Request",

      message: `${input.client_name} requested a meeting.`,

      href:
        "/admin/meetings",
    });
  }

  revalidatePath(
    "/admin/meetings"
  );

  revalidatePath(
    "/admin/notifications"
  );

  return data;
}