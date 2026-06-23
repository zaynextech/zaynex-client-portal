"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";

interface CreateClientMeetingInput {
  meeting_date: string;
  meeting_time: string;
  notes: string;
}

export async function createClientMeeting(
  input: CreateClientMeetingInput
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const { data: profile } =
    await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

  const {
    data: meeting,
    error,
  } = await supabase
    .from("meetings")
    .insert({
      client_name:
        profile?.full_name ??
        "Client",

      email:
        user.email,

      meeting_type:
        "Consultation",

      meeting_date:
        input.meeting_date,

      meeting_time:
        input.meeting_time,

      notes:
        input.notes,

      status:
        "PENDING",
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  const { data: admins } =
    await supabase
      .from("profiles")
      .select("id")
      .eq(
        "role",
        "ADMIN"
      );

  for (const admin of admins ??
    []) {
    await createNotification({
      userId: admin.id,

      title:
        "New Meeting Request",

      message: `${profile?.full_name ?? user.email} requested a meeting.`,

      href:
        "/admin/meetings",
    });
  }

  revalidatePath(
    "/client/meetings"
  );

  revalidatePath(
    "/admin/meetings"
  );

  return meeting;
}