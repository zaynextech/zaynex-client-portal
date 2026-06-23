"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function closeTicket(
  ticketId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("tickets")
    .update({
      status: "Closed",
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", ticketId);

  if (error) {
    console.error(
      "CLOSE TICKET ERROR:",
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

  revalidatePath(
    "/client/tickets"
  );

  revalidatePath(
    "/admin/tickets"
  );

  return {
    success: true,
  };
}