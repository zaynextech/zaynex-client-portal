// src/features/support/actions/send-message.ts

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { createNotification } from "@/lib/notifications/create-notification";

interface SendMessageInput {
  ticketId: string;
  message: string;
}

export async function sendMessage({
  ticketId,
  message,
}: SendMessageInput) {
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

  if (!message.trim()) {
    throw new Error(
      "Message cannot be empty"
    );
  }

  const {
    data: profile,
  } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: ticket } =
    await supabase
      .from("tickets")
      .select(`
        id,
        project_id,
        client_id
      `)
      .eq("id", ticketId)
      .single();

  if (!ticket) {
    throw new Error(
      "Support chat not found"
    );
  }

  const { error } =
    await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message:
          message.trim(),
      });

  if (error) {
    console.error(error);

    throw new Error(
      error.message
    );
  }

  // CLIENT -> ADMIN
  if (
    profile?.role ===
    "CLIENT"
  ) {
    const {
      data: admins,
    } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "ADMIN");

    for (const admin of admins ??
      []) {
      await createNotification({
        userId: admin.id,
        title:
          "New Support Message",
        message:
          "A client replied to a support ticket.",
        href: `/admin/support/${ticket.project_id}`,
      });
    }
  }

  // ADMIN -> CLIENT
  if (
    profile?.role ===
    "ADMIN"
  ) {
    await createNotification({
      userId:
        ticket.client_id,
      title:
        "Support Reply",
      message:
        "You received a new message from the Zaynex team.",
      href: `/client/support/${ticket.project_id}`,
    });
  }

  revalidatePath(
    `/client/support/${ticket.project_id}`
  );

  revalidatePath(
    `/admin/support/${ticket.project_id}`
  );

  revalidatePath(
    "/admin/notifications"
  );

  revalidatePath(
    "/client/notifications"
  );

  return {
    success: true,
  };
}