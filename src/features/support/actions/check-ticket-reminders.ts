// src/features/support/actions/check-ticket-reminders.ts

"use server";

import { createClient } from "@/lib/supabase/server";

import { sendSupportReminderToAdminEmail } from "@/lib/emails/send-support-reminder-to-admin-email";
import { sendSupportReminderToClientEmail } from "@/lib/emails/send-support-reminder-to-client-email";

export async function checkTicketReminders() {
  const supabase =
    await createClient();

  const twentyFourHoursAgo =
    new Date(
      Date.now() -
        24 * 60 * 60 * 1000
    ).toISOString();

  const { data: tickets, error } =
    await supabase
      .from("tickets")
      .select(`
        id,
        subject,
        client_id,
        last_message_at,
        last_message_by,
        admin_reminder_sent,
        client_reminder_sent
      `)
      .not(
        "last_message_at",
        "is",
        null
      )
      .lt(
        "last_message_at",
        twentyFourHoursAgo
      );

  if (error) {
    throw new Error(
      error.message
    );
  }

  for (const ticket of tickets ?? []) {
    const {
      data: client,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        full_name
      `)
      .eq(
        "id",
        ticket.client_id
      )
      .single();

    if (!client) {
      continue;
    }

    const clientWasLastSender =
      ticket.last_message_by ===
      ticket.client_id;

    if (
      clientWasLastSender &&
      !ticket.admin_reminder_sent
    ) {
      try {
        await sendSupportReminderToAdminEmail({
          clientName:
            client.full_name ??
            "Client",
          clientEmail:
            client.email,
          subject:
            ticket.subject,
          ticketId:
            ticket.id,
        });

        await supabase
          .from("tickets")
          .update({
            admin_reminder_sent:
              true,
          })
          .eq(
            "id",
            ticket.id
          );
      } catch (error) {
        console.error(
          "Admin reminder failed:",
          error
        );
      }
    }

    if (
      !clientWasLastSender &&
      !ticket.client_reminder_sent
    ) {
      try {
        await sendSupportReminderToClientEmail(
          client.email,
          client.full_name,
          ticket.subject
        );

        await supabase
          .from("tickets")
          .update({
            client_reminder_sent:
              true,
          })
          .eq(
            "id",
            ticket.id
          );
      } catch (error) {
        console.error(
          "Client reminder failed:",
          error
        );
      }
    }
  }

  return {
    success: true,
  };
}