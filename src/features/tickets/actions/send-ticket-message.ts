"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function sendTicketMessage(
  ticketId: string,
  message: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!message.trim()) {
    throw new Error(
      "Message is required"
    );
  }

  // Verify ticket exists
  const {
    data: ticket,
    error: ticketError,
  } = await supabase
    .from("tickets")
    .select("id")
    .eq("id", ticketId)
    .single();

  if (ticketError || !ticket) {
    throw new Error(
      "Ticket not found"
    );
  }

  const { error } = await supabase
    .from("ticket_messages")
    .insert({
      ticket_id: ticketId,
      sender_id: user.id,
      message: message.trim(),
    });

  if (error) {
    console.error(
      "SEND MESSAGE ERROR:",
      error
    );

    throw new Error(
      error.message
    );
  }

  revalidatePath(
    `/client/tickets/${ticketId}`
  );

  revalidatePath(
    `/admin/tickets/${ticketId}`
  );

  return {
    success: true,
  };
}