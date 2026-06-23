"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteTicket(
  ticketId: string
) {
  const supabase =
    await createClient();

  await supabase
    .from("ticket_messages")
    .delete()
    .eq("ticket_id", ticketId);

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
    "/admin/support"
  );

  return {
    success: true,
  };
}