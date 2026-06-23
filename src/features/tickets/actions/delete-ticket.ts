"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteTicket(
  ticketId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Delete messages first
  const {
    error: messagesError,
  } = await supabase
    .from("ticket_messages")
    .delete()
    .eq("ticket_id", ticketId);

  if (messagesError) {
    throw new Error(
      messagesError.message
    );
  }

  // Delete ticket
  const { error } =
    await supabase
      .from("tickets")
      .delete()
      .eq("id", ticketId);

  if (error) {
    throw new Error(
      error.message
    );
  }

  revalidatePath(
    "/admin/tickets"
  );

  revalidatePath(
    "/client/tickets"
  );

  return {
    success: true,
  };
}