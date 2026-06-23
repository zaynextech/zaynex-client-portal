"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

interface CreateTicketInput {
  subject: string;
  priority: string;
  message: string;
}

export async function createTicket(
  data: CreateTicketInput
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Create ticket
  const {
    data: ticket,
    error: ticketError,
  } = await supabase
    .from("tickets")
    .insert({
      client_id: user.id,
      subject: data.subject,
      priority: data.priority,
      status: "Open",
    })
    .select()
    .single();

  if (ticketError) {
    console.error(
      "CREATE TICKET ERROR:",
      ticketError
    );

    throw new Error(
      ticketError.message
    );
  }

  // Create first message
  const { error: messageError } =
    await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: data.message,
      });

  if (messageError) {
    console.error(
      "CREATE MESSAGE ERROR:",
      messageError
    );

    throw new Error(
      messageError.message
    );
  }

  revalidatePath(
    "/client/tickets"
  );

  return ticket;
}